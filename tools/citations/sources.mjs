// API-specific lookups (DOI handle service, Crossref, PubMed E-utilities) and the
// orchestration that turns them into per-citation results. Uses the injected
// `http` client from ./net.mjs, so tests can run the full pipeline offline.

import {
  assessTopics,
  citationVerdict,
  classifyLink,
  compareCrossref,
  comparePubmed,
  detectNotices,
  gradeEvidence,
  isAcknowledgedRetraction,
  summarize,
} from './lib.mjs';

const DAY = 24 * 3600e3;
export const TTL = { metadata: 7 * DAY, notices: 2 * DAY, links: 3 * DAY };

const enc = (doi) => encodeURIComponent(doi).replace(/%2F/g, '/');

export function mailtoParam() {
  const m = process.env.CROSSREF_MAILTO;
  return m ? `mailto=${encodeURIComponent(m)}` : '';
}

/** DOI handle API: authoritative "does this DOI exist and where does it point". */
export async function doiHandle(http, doi) {
  const r = await http.getJson(`https://doi.org/api/handles/${enc(doi)}`, { ttl: TTL.metadata });
  const code = r.json?.responseCode;
  const target = r.json?.values?.find((v) => v.type === 'URL')?.data?.value ?? null;
  if (code === 1) return { exists: true, target };
  if (code === 100 || r.status === 404) return { exists: false, target: null };
  return { exists: null, target: null, detail: `handle API HTTP ${r.status}` };
}

export async function crossrefWork(http, doi) {
  const q = mailtoParam();
  const r = await http.getJson(`https://api.crossref.org/works/${enc(doi)}${q ? `?${q}` : ''}`, { ttl: TTL.metadata });
  if (r.status === 200 && r.json?.message) return { found: true, message: r.json.message };
  return { found: false, status: r.status };
}

/** Which registration agency (Crossref, DataCite, mEDRA, …) owns a DOI. */
export async function registrationAgency(http, doi) {
  const r = await http.getJson(`https://doi.org/ra/${enc(doi)}`, { ttl: TTL.metadata });
  const ra = Array.isArray(r.json) ? r.json[0]?.RA : null;
  return ra && !/does not exist|invalid/i.test(ra) ? ra : null;
}

export async function crossrefUpdates(http, doi) {
  const q = mailtoParam();
  const url = `https://api.crossref.org/works?filter=updates:${enc(doi)}&rows=20${q ? `&${q}` : ''}`;
  const r = await http.getJson(url, { ttl: TTL.notices });
  return r.status === 200 ? r.json?.message?.items ?? [] : [];
}

/** One batched esummary call for every PMID (NCBI asks for batching). */
export async function pubmedSummaries(http, pmids) {
  const out = {};
  const ids = [...new Set(pmids.filter(Boolean))];
  for (let i = 0; i < ids.length; i += 150) {
    const chunk = ids.slice(i, i + 150);
    const key = process.env.NCBI_API_KEY ? `&api_key=${encodeURIComponent(process.env.NCBI_API_KEY)}` : '';
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=sound-evidence-hub&id=${chunk.join(',')}${key}`;
    const r = await http.getJson(url, { ttl: TTL.metadata });
    if (r.status !== 200 || !r.json?.result) {
      for (const id of chunk) out[id] = { error: `esummary HTTP ${r.status}`, transient: true };
      continue;
    }
    for (const id of chunk) out[id] = r.json.result[id] ?? { error: 'not returned' };
  }
  return out;
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

/** Check one citation end to end. */
export async function checkCitation(http, c, pubmed) {
  const issues = [];
  const links = [];
  let crossref = null;
  let updates = [];
  let pubmedRec = null;

  if (c.doi) {
    const handle = await doiHandle(http, c.doi);
    const href = `https://doi.org/${c.doi}`;
    if (handle.exists === false) {
      links.push({ kind: 'doi', url: href, status: 'dead', detail: 'DOI is not registered (handle API responseCode 100)' });
    } else {
      // The DOI exists; also follow it to the publisher, which can still be broken.
      const p = await http.probe(href, { ttl: TTL.links });
      const cls = classifyLink(href, p);
      const host = (() => { try { return new URL(p.finalUrl).hostname; } catch { return '?'; } })();
      // doi.org always redirects; following it to the publisher is the point, so a
      // redirect here is just "reached the landing page".
      let status = cls.status === 'redirect' ? 'ok' : cls.status;
      const landing = cls.status === 'redirect' ? `HTTP ${p.status} at ${host}` : cls.status === 'blocked' ? `${host} refuses scripted requests (HTTP ${p.status})` : `${cls.detail} at ${host}`;
      let landingBlocked = false;
      // A publisher blocking bots is fine when the handle API confirms the DOI.
      if (status === 'blocked') { landingBlocked = true; status = handle.exists ? 'ok' : 'unreachable'; }
      if (handle.exists === null && status !== 'ok') status = 'unreachable';
      links.push({
        kind: 'doi',
        url: href,
        status,
        landingBlocked,
        detail: `${handle.exists ? 'DOI registered' : 'DOI handle unconfirmed'}; landing page: ${landing}`,
        target: handle.target ?? p.finalUrl,
        finalUrl: p.finalUrl,
      });
    }
    const cr = await crossrefWork(http, c.doi);
    if (cr.found) {
      crossref = cr.message;
      const cmp = compareCrossref(c, cr.message);
      issues.push(...cmp.issues.map((i) => ({ ...i, source: 'crossref' })));
      updates = await crossrefUpdates(http, c.doi);
    } else {
      const ra = await registrationAgency(http, c.doi);
      issues.push({
        level: 'info',
        source: 'crossref',
        code: 'not-in-crossref',
        message: ra
          ? `DOI is registered with ${ra}, not Crossref, so title/year/author and retraction checks rely on ${c.pmid ? 'PubMed' : 'the DOI handle only'}.`
          : `Crossref has no record (HTTP ${cr.status}); the DOI may be registered with another agency.`,
      });
    }
  }

  if (c.pmid) {
    pubmedRec = pubmed[c.pmid];
    if (pubmedRec?.transient) {
      issues.push({ level: 'warn', source: 'pubmed', code: 'pubmed-unavailable', message: `PubMed lookup failed (${pubmedRec.error}); PMID not verified this run.` });
    } else {
      const cmp = comparePubmed(c, pubmedRec);
      issues.push(...cmp.issues.map((i) => ({ ...i, source: 'pubmed' })));
      if (cmp.matched?.pmc) links.push({ kind: 'pmc', url: `https://pmc.ncbi.nlm.nih.gov/articles/${cmp.matched.pmc}/`, status: 'ok', detail: 'PMC id confirmed via PubMed' });
    }
    links.push({ kind: 'pubmed', url: `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`, status: pubmedRec && !pubmedRec.error ? 'ok' : pubmedRec?.transient ? 'unreachable' : 'dead', detail: pubmedRec && !pubmedRec.error ? 'PMID exists (E-utilities)' : pubmedRec?.error ?? 'missing' });
  }

  if (c.url) {
    const p = await http.probe(c.url, { ttl: TTL.links });
    const cls = classifyLink(c.url, p);
    links.push({ kind: 'url', url: c.url, ...cls, finalUrl: p.finalUrl, chain: p.chain });
  }

  if (!c.doi && !c.pmid && !c.url) issues.push({ level: 'error', source: 'registry', code: 'no-identifier', message: 'Citation has no DOI, PMID or URL.' });

  const pubmedTypes = pubmedRec?.pubtype ?? [];
  const notices = detectNotices({ doi: c.doi, crossref, updates, pubmedTypes });
  const grade = gradeEvidence(c, { pubmedTypes, crossrefType: crossref?.type ?? null, retracted: notices.retracted });
  if (c.retraction && !notices.retracted) {
    issues.push({ level: 'warn', source: 'registry', code: 'retraction-not-found', message: `Registry marks this as retracted (${c.retraction.noticeDoi}) but no retraction notice was found this run.` });
  }
  const result = {
    id: c.id,
    authors: c.authors,
    year: c.year,
    title: c.title,
    type: c.type,
    doi: c.doi ?? null,
    pmid: c.pmid ?? null,
    pmcid: c.pmcid ?? null,
    url: c.url ?? null,
    links,
    issues,
    notices,
    grade,
    retractionAcknowledged: isAcknowledgedRetraction(c, notices),
  };
  result.verdict = citationVerdict(result);
  return result;
}

/** Link-only check for URLs/DOIs that appear in content collections (study cards, news). */
export async function checkExtraLink(http, item) {
  if (item.doi && !item.url) {
    const h = await doiHandle(http, item.doi);
    return { ...item, url: `https://doi.org/${item.doi}`, status: h.exists === false ? 'dead' : h.exists ? 'ok' : 'unreachable', detail: h.exists ? 'DOI registered' : 'DOI not confirmed' };
  }
  const doiMatch = item.url.match(/^https?:\/\/(?:dx\.)?doi\.org\/(.+)$/i);
  if (doiMatch) {
    const h = await doiHandle(http, decodeURIComponent(doiMatch[1]));
    return { ...item, status: h.exists === false ? 'dead' : h.exists ? 'ok' : 'unreachable', detail: h.exists ? 'DOI registered' : 'DOI not confirmed' };
  }
  const p = await http.probe(item.url, { ttl: TTL.links });
  const cls = classifyLink(item.url, p);
  return { ...item, ...cls, finalUrl: p.finalUrl };
}

export async function runChecks(http, { citations, topics, extraLinks = [] }, { concurrency = 4, log = () => {} } = {}) {
  const list = Object.values(citations);
  const pubmed = await pubmedSummaries(http, list.map((c) => c.pmid));
  let done = 0;
  const results = await pool(list, concurrency, async (c) => {
    const r = await checkCitation(http, c, pubmed);
    log(`[${++done}/${list.length}] ${c.id}: ${r.verdict}`);
    return r;
  });
  const grades = Object.fromEntries(results.map((r) => [r.id, r.grade]));
  const topicAssessments = assessTopics(topics, grades);
  const extras = await pool(extraLinks, concurrency, (item) => checkExtraLink(http, item));
  // Topic references to citation ids that don't exist are a registry error.
  const missingRefs = topics.flatMap((t) => t.citations.filter((id) => !citations[id]).map((id) => ({ topic: t.slug, id })));
  const unused = list.filter((c) => !topics.some((t) => t.citations.includes(c.id))).map((c) => c.id);
  const summary = summarize(results, topicAssessments, extras);
  summary.missingRefs = missingRefs.length;
  summary.landingBlocked = results.filter((r) => r.links.some((l) => l.landingBlocked)).length;
  return { results, topics: topicAssessments, extraLinks: extras, missingRefs, unusedCitations: unused, summary };
}
