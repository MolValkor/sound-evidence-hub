// Pure, network-free logic for the citation checker. Everything here is unit-tested
// with fixtures in ./test; the network layer lives in ./sources.mjs.

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const ENTITY = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };

export function normalizeText(s = '') {
  return String(s)
    .replace(/<[^>]+>/g, ' ') // Crossref titles can carry <i>, <sup>, MathML
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITY[m.toLowerCase()] ?? ' ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics: Kühlmann -> Kuhlmann
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(s) {
  return normalizeText(s).split(' ').filter(Boolean);
}

/**
 * Similarity between two titles, 0..1. Dice coefficient on word tokens, but if one
 * title is fully contained in the other (e.g. Crossref drops/adds a subtitle) we
 * score the containment instead so "Reiki" vs "Reiki: what you need to know" is
 * not treated as a different paper.
 */
export function titleSimilarity(a, b) {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const ta = tokens(a);
  const tb = tokens(b);
  const setB = new Set(tb);
  const setA = new Set(ta);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const dice = (2 * inter) / (setA.size + setB.size);
  const shorter = ta.length <= tb.length ? na : nb;
  const longer = ta.length <= tb.length ? nb : na;
  if (shorter.split(' ').length >= 4 && longer.startsWith(shorter)) return Math.max(dice, 0.95);
  return dice;
}

/** Family name of the first listed author in strings like "de Witte M, Spruit A". */
export function firstAuthorFamily(authors = '') {
  const first = String(authors).split(',')[0].trim();
  if (!first) return '';
  const parts = first.split(/\s+/);
  // Drop trailing initials ("M", "AYR", "J.").
  while (parts.length > 1 && /^[A-Z][A-Z.\-]{0,4}$/.test(parts[parts.length - 1])) parts.pop();
  return parts.join(' ');
}

function squash(s) {
  return normalizeText(s).replace(/ /g, '');
}

export function isOrganisationAuthor(authors = '') {
  return /\b(national|center|centre|organization|organisation|institute|association|agency|ministry|commission|NIH)\b/i.test(authors);
}

// ---------------------------------------------------------------------------
// Crossref
// ---------------------------------------------------------------------------

export function crossrefYears(msg = {}) {
  const years = new Set();
  for (const k of ['issued', 'published-print', 'published-online', 'published', 'journal-issue']) {
    const v = k === 'journal-issue' ? msg[k]?.['published-print'] : msg[k];
    const y = v?.['date-parts']?.[0]?.[0];
    if (Number.isInteger(y)) years.add(y);
  }
  return [...years].sort();
}

/**
 * Compare a stored citation with a Crossref work message.
 * Returns { issues: [{level, code, message}], matched: {...} }.
 * level: 'error' (looks like a different paper) | 'warn' (minor drift) | 'info'.
 */
export function compareCrossref(citation, msg) {
  const issues = [];
  const crTitle = [msg.title?.[0], msg.subtitle?.[0]].filter(Boolean).join(': ');
  const sim = Math.max(titleSimilarity(citation.title, crTitle), titleSimilarity(citation.title, msg.title?.[0] ?? ''));
  if (sim < 0.6) {
    issues.push({ level: 'error', code: 'title-mismatch', message: `Crossref title "${crTitle}" does not match stored title (similarity ${sim.toFixed(2)}). The DOI may point to a different paper.` });
  } else if (sim < 0.85) {
    issues.push({ level: 'warn', code: 'title-drift', message: `Crossref title differs slightly: "${crTitle}" (similarity ${sim.toFixed(2)}).` });
  }

  const years = crossrefYears(msg);
  if (years.length && !years.includes(citation.year)) {
    const near = years.some((y) => Math.abs(y - citation.year) === 1);
    issues.push({
      level: near ? 'warn' : 'error',
      code: near ? 'year-drift' : 'year-mismatch',
      message: `Stored year ${citation.year}; Crossref has ${years.join('/')}${near ? ' (online-first vs print is a common cause)' : ''}.`,
    });
  }

  const family = firstAuthorFamily(citation.authors);
  const crAuthors = (msg.author ?? []).map((a) => a.family || a.name || '').filter(Boolean);
  if (family && crAuthors.length && !isOrganisationAuthor(citation.authors)) {
    const first = (msg.author.find((a) => a.sequence === 'first') ?? msg.author[0]);
    const firstFamily = first.family || first.name || '';
    if (squash(firstFamily) !== squash(family)) {
      const anywhere = crAuthors.some((f) => squash(f) === squash(family));
      issues.push({
        level: 'warn',
        code: anywhere ? 'author-order' : 'author-mismatch',
        message: anywhere
          ? `"${family}" is listed by Crossref but not as first author (first: ${firstFamily}).`
          : `First author "${family}" not found in Crossref author list (first: ${firstFamily}).`,
      });
    }
  }
  return { issues, matched: { titleSimilarity: Number(sim.toFixed(3)), crossrefTitle: crTitle, crossrefYears: years, crossrefFirstAuthor: crAuthors[0] ?? null } };
}

// ---------------------------------------------------------------------------
// Retractions / editorial notices
// ---------------------------------------------------------------------------

const RETRACTION_TYPES = new Set(['retraction', 'withdrawal', 'removal', 'partial_retraction', 'partial-retraction']);
const CONCERN_TYPES = new Set(['expression_of_concern', 'expression-of-concern']);
const CORRECTION_TYPES = new Set(['correction', 'erratum', 'corrigendum', 'addendum', 'clarification']);
// Cochrane and others register each review update as a new DOI that "updates" the
// previous one with type new_version. That is versioning, not an editorial notice.
const VERSION_TYPES = new Set(['new_version', 'new_edition', 'new-version', 'new-edition']);

export function classifyUpdateType(type = '') {
  const t = String(type).toLowerCase().replace(/\s+/g, '_');
  if (RETRACTION_TYPES.has(t)) return 'retracted';
  if (CONCERN_TYPES.has(t)) return 'concern';
  if (CORRECTION_TYPES.has(t)) return 'corrected';
  if (VERSION_TYPES.has(t)) return 'superseded';
  return 'other';
}

/**
 * Collect editorial notices for a DOI from:
 *  - msg['updated-by'] on the work itself (includes Retraction Watch data, source: "retraction-watch")
 *  - items from Crossref `filter=updates:{doi}` (notices that point at this DOI)
 *  - msg['update-to'] (the cited DOI is itself a notice, which is never what we want to cite)
 *  - a "RETRACTED" title prefix
 *  - PubMed publication types ("Retracted Publication", "Retraction of Publication", "Expression of Concern")
 */
export function detectNotices({ doi, crossref, updates = [], pubmedTypes = [] }) {
  const notices = [];
  const seen = new Set();
  const add = (n) => {
    const key = `${n.status}|${(n.doi ?? '').toLowerCase()}|${n.source}`;
    if (!seen.has(key)) { seen.add(key); notices.push(n); }
  };
  for (const u of crossref?.['updated-by'] ?? []) {
    add({ status: classifyUpdateType(u.type), type: u.type, doi: u.DOI, source: u.source ?? 'crossref', date: u.updated?.['date-time']?.slice(0, 10) ?? null });
  }
  const want = (doi ?? '').toLowerCase();
  for (const item of updates) {
    for (const u of item['update-to'] ?? []) {
      if ((u.DOI ?? '').toLowerCase() !== want) continue;
      add({ status: classifyUpdateType(u.type), type: u.type, doi: item.DOI, source: u.source ?? 'crossref', date: u.updated?.['date-time']?.slice(0, 10) ?? null });
    }
  }
  for (const u of crossref?.['update-to'] ?? []) {
    const kind = classifyUpdateType(u.type);
    // A newer version updating an older one is exactly what we want to cite.
    if (kind === 'superseded' || kind === 'other') continue;
    add({ status: 'is-notice', type: u.type, doi: u.DOI, source: 'crossref', date: null, message: `This DOI is itself a ${u.type} notice for ${u.DOI}, not the article.` });
  }
  if (/^\s*retract(ed|ion)\b/i.test(crossref?.title?.[0] ?? '')) {
    add({ status: 'retracted', type: 'title-prefix', doi: null, source: 'crossref-title', date: null });
  }
  for (const t of pubmedTypes) {
    if (/^retracted publication$/i.test(t)) add({ status: 'retracted', type: t, doi: null, source: 'pubmed', date: null });
    else if (/^retraction of publication$/i.test(t)) add({ status: 'is-notice', type: t, doi: null, source: 'pubmed', date: null });
    else if (/expression of concern/i.test(t)) add({ status: 'concern', type: t, doi: null, source: 'pubmed', date: null });
  }
  const retracted = notices.some((n) => n.status === 'retracted' || n.status === 'is-notice');
  const concern = notices.some((n) => n.status === 'concern');
  const superseded = notices.some((n) => n.status === 'superseded');
  return { retracted, concern, superseded, notices };
}

/**
 * A retraction is "acknowledged" when the registry entry carries
 * `retraction: { noticeDoi, date, note }` matching a notice we found, i.e. the site
 * already labels it as retracted. Unacknowledged retractions fail the run.
 */
export function isAcknowledgedRetraction(citation, notices) {
  const ack = citation?.retraction?.noticeDoi?.toLowerCase();
  if (!ack || !notices?.retracted) return false;
  return notices.notices.some((n) => n.status === 'retracted' && (n.doi ?? '').toLowerCase() === ack);
}

// ---------------------------------------------------------------------------
// PubMed
// ---------------------------------------------------------------------------

export function pubmedArticleId(rec, idtype) {
  return rec?.articleids?.find((a) => a.idtype === idtype)?.value ?? null;
}

export function comparePubmed(citation, rec) {
  const issues = [];
  if (!rec || rec.error) {
    issues.push({ level: 'error', code: 'pmid-missing', message: `PMID ${citation.pmid} not found in PubMed${rec?.error ? ` (${rec.error})` : ''}.` });
    return { issues, matched: null };
  }
  const sim = titleSimilarity(citation.title, rec.title);
  if (sim < 0.6) issues.push({ level: 'error', code: 'pmid-title-mismatch', message: `PubMed title "${rec.title}" does not match (similarity ${sim.toFixed(2)}).` });
  else if (sim < 0.85) issues.push({ level: 'warn', code: 'pmid-title-drift', message: `PubMed title differs slightly: "${rec.title}".` });

  const year = Number(String(rec.pubdate ?? rec.epubdate ?? '').slice(0, 4));
  const epubYear = Number(String(rec.epubdate ?? '').slice(0, 4));
  if (year && year !== citation.year && epubYear !== citation.year) {
    issues.push({ level: Math.abs(year - citation.year) === 1 ? 'warn' : 'error', code: 'pmid-year', message: `PubMed year ${year}; stored ${citation.year}.` });
  }
  const pmDoi = pubmedArticleId(rec, 'doi');
  if (citation.doi && pmDoi && pmDoi.toLowerCase() !== citation.doi.toLowerCase()) {
    issues.push({ level: 'error', code: 'pmid-doi-mismatch', message: `PubMed lists DOI ${pmDoi} for this PMID, but we store ${citation.doi}.` });
  }
  const pmc = pubmedArticleId(rec, 'pmc');
  if (citation.pmcid && pmc !== citation.pmcid) {
    issues.push({ level: 'error', code: 'pmcid-mismatch', message: `PubMed links ${pmc ?? 'no PMC record'} for this PMID, but we store ${citation.pmcid}.` });
  }
  if (!citation.pmcid && pmc) {
    issues.push({ level: 'info', code: 'pmcid-available', message: `Free full text available: ${pmc}.` });
  }
  const family = firstAuthorFamily(citation.authors);
  const pmFirst = String(rec.sortfirstauthor ?? rec.authors?.[0]?.name ?? '');
  if (family && pmFirst && !isOrganisationAuthor(citation.authors) && !squash(pmFirst).startsWith(squash(family))) {
    issues.push({ level: 'warn', code: 'pmid-author', message: `PubMed first author "${pmFirst}"; stored "${family}".` });
  }
  return { issues, matched: { pubmedTitle: rec.title, pubmedYear: year || null, pubmedDoi: pmDoi, pmc, pubtypes: rec.pubtype ?? [] } };
}

// ---------------------------------------------------------------------------
// Link classification
// ---------------------------------------------------------------------------

/** Status codes that mean "a server answered but refused a script" rather than "gone". */
const BLOCKED = new Set([202, 203, 401, 403, 405, 406, 418, 429, 451, 503]);

/**
 * Classify the outcome of following a URL.
 * probe: { status, finalUrl, chain: [{url, status, location}], error?: {code, message} }
 */
export function classifyLink(url, probe) {
  if (!probe) return { status: 'unreachable', detail: 'no response' };
  if (probe.error) {
    const dns = /ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(`${probe.error.code} ${probe.error.message}`);
    return dns
      ? { status: 'dead', detail: `DNS lookup failed (${probe.error.code ?? probe.error.message})` }
      : { status: 'unreachable', detail: `${probe.error.code ?? 'error'}: ${probe.error.message}` };
  }
  const s = probe.status;
  if (s === 404 || s === 410) return { status: 'dead', detail: `HTTP ${s}` };
  if (s >= 200 && s < 300 && !BLOCKED.has(s)) {
    const permanent = (probe.chain ?? []).some((h) => h.status === 301 || h.status === 308);
    if (permanent && !sameResource(url, probe.finalUrl)) {
      return { status: 'redirect', detail: `Permanently redirects to ${probe.finalUrl}`, canonical: probe.finalUrl };
    }
    return { status: 'ok', detail: `HTTP ${s}` };
  }
  if (BLOCKED.has(s)) return { status: 'blocked', detail: `HTTP ${s} (server refuses scripted requests; not evidence the page is gone)` };
  if (s >= 500) return { status: 'unreachable', detail: `HTTP ${s}` };
  return { status: 'unreachable', detail: `HTTP ${s}` };
}

/** True when two URLs differ only by scheme, "www.", trailing slash, or default port. */
export function sameResource(a, b) {
  try {
    const norm = (u) => {
      const x = new URL(u);
      return `${x.hostname.replace(/^www\./, '')}${x.pathname.replace(/\/+$/, '') || '/'}${x.search}`;
    };
    return norm(a) === norm(b);
  } catch {
    return a === b;
  }
}

// ---------------------------------------------------------------------------
// Evidence grading
// ---------------------------------------------------------------------------

/**
 * Study-design grade. `strength` is a coarse 0-5 scale used only to find claims
 * that rest entirely on weak designs; it is NOT a quality score (a systematic
 * review of biased trials still grades 4 here, which is why topic ratings are set
 * by a human and the checker only cross-checks them).
 */
export const DESIGNS = {
  'meta-analysis': { label: 'Meta-analysis', strength: 5, research: true },
  'systematic-review': { label: 'Systematic review', strength: 4, research: true },
  rct: { label: 'Randomized controlled trial (n ≥ 100)', strength: 3, research: true },
  'scoping-review': { label: 'Scoping / narrative review', strength: 2, research: true },
  'small-trial': { label: 'Pilot or small trial (n < 100)', strength: 2, research: true },
  observational: { label: 'Observational / uncontrolled', strength: 1, research: true },
  animal: { label: 'Animal or lab study', strength: 1, research: true },
  overview: { label: 'Agency evidence overview (secondary)', strength: null, research: false },
  standard: { label: 'Technical standard (not health evidence)', strength: null, research: false },
  opinion: { label: 'Opinion / editorial', strength: 0, research: true },
  unknown: { label: 'Unclassified', strength: null, research: false },
};

export const WEAK_MAX = 2; // strength <= 2 counts as weak evidence

function sampleSize(text) {
  const m = text.match(/\bn\s*=\s*([\d,]+)/i) || text.match(/\(([\d,]+)\s+(?:people|participants|adults|patients|practitioners)\)/i);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}

export function gradeEvidence(citation, { pubmedTypes = [], crossrefType = null, retracted = false } = {}) {
  if (retracted || citation.retraction) {
    return { design: 'retracted', label: 'Retracted (not counted as evidence)', strength: null, research: false, basis: 'retraction notice' };
  }
  const text = `${citation.type ?? ''} ${citation.title ?? ''}`.toLowerCase();
  const pt = pubmedTypes.map((t) => t.toLowerCase());
  const pick = (design, why) => ({ design, ...DESIGNS[design], basis: why });

  if (/\bstandard\b/.test(citation.type ?? '') || /\biso \d/.test(text)) return pick('standard', 'stored type');
  if (/government|fact sheet|agency|evidence overview|guideline/.test(text)) return pick('overview', 'stored type');
  if (/\b(animal|mice|mouse|rats?|in vitro|cell culture)\b/.test(citation.type?.toLowerCase() ?? '')) return pick('animal', 'stored type');
  if (/meta-analys|meta analys/.test(text) || pt.includes('meta-analysis')) return pick('meta-analysis', pt.includes('meta-analysis') ? 'PubMed publication type' : 'stored type');
  if (/scoping review|narrative review/.test(text)) return pick('scoping-review', 'stored type');
  if (/cochrane|systematic review/.test(text) || pt.includes('systematic review')) return pick('systematic-review', 'stored type');
  if (/pilot|feasibility/.test(text)) return pick('small-trial', 'stored type (pilot/feasibility)');
  if (/observational|pre[–-]post|uncontrolled|no control|case series|cohort|cross-sectional|survey/.test(text) || pt.includes('observational study')) return pick('observational', 'stored type');
  if (/randomi[sz]ed|\brct\b|crossover|cross-over|controlled trial|blinded test/.test(text) || pt.includes('randomized controlled trial')) {
    const n = sampleSize(citation.type ?? '');
    if (n !== null && n < 100) return pick('small-trial', `stored type (n = ${n})`);
    return pick('rct', n === null ? 'stored type (sample size not stated; assumed adequate)' : `stored type (n = ${n})`);
  }
  if (/opinion|editorial|commentary|letter/.test(text) || pt.some((t) => /editorial|comment|letter/.test(t))) return pick('opinion', 'stored type');
  if (pt.includes('review')) return pick('scoping-review', 'PubMed publication type (Review)');
  return { ...pick('unknown', `no recognisable design in "${citation.type}"${crossrefType ? ` (Crossref type ${crossrefType})` : ''}`) };
}

/**
 * Cross-check each topic's human rating against the designs of its sources.
 * - 'overrated': rated strong/moderate but every research source is weak -> error
 * - 'weak-only': all research sources weak, rating already preliminary/not-supported -> flag (consistent)
 * - 'thin-strong': rated strong with fewer than 2 review-level sources -> warn
 */
export function assessTopics(topics, grades) {
  return topics.map((t) => {
    const research = t.citations
      .map((id) => ({ id, g: grades[id] }))
      .filter((x) => x.g && x.g.research && x.g.strength !== null);
    const max = research.length ? Math.max(...research.map((x) => x.g.strength)) : null;
    const reviewLevel = research.filter((x) => x.g.strength >= 4).length;
    const weakOnly = max === null || max <= WEAK_MAX;
    let status = 'ok';
    let message = `Strongest source design: ${max === null ? 'none' : research.find((x) => x.g.strength === max).g.label}.`;
    if (weakOnly && (t.rating === 'strong' || t.rating === 'moderate')) {
      status = 'overrated';
      message = `Rated "${t.rating}" but supported only by weak designs (${max === null ? 'no research sources' : `best is strength ${max}`}).`;
    } else if (weakOnly) {
      status = 'weak-only';
      message = `Supported only by weak designs (${max === null ? 'no primary research' : research.map((x) => x.g.label).filter((v, i, a) => a.indexOf(v) === i).join('; ')}). Rating "${t.rating}" is consistent with that.`;
    } else if (t.rating === 'strong' && reviewLevel < 2) {
      status = 'thin-strong';
      message = `Rated "strong" with only ${reviewLevel} review-level source(s).`;
    }
    const strongestLabel = max === null ? null : research.find((x) => x.g.strength === max).g.label;
    return { slug: t.slug, title: t.title, rating: t.rating, citations: t.citations, maxStrength: max, strongestLabel, reviewLevelSources: reviewLevel, weakOnly, status, message };
  });
}

// ---------------------------------------------------------------------------
// Roll-up
// ---------------------------------------------------------------------------

/**
 * Overall verdict for one citation from its individual checks.
 * Priority: retracted > dead > mismatch > redirect > blocked/unverified > ok.
 */
export function citationVerdict(r) {
  if (r.notices?.retracted) return r.retractionAcknowledged ? 'retracted-labelled' : 'retracted';
  const links = r.links ?? [];
  if (links.some((l) => l.status === 'dead')) return 'dead';
  if ((r.issues ?? []).some((i) => i.level === 'error')) return 'mismatch';
  if (links.some((l) => l.status === 'redirect')) return 'redirect';
  if (links.some((l) => l.status === 'unreachable')) return 'unverified';
  return 'ok';
}

export function summarize(results, topicAssessments, extraLinks = []) {
  const count = (pred) => results.filter(pred).length;
  return {
    citations: results.length,
    ok: count((r) => r.verdict === 'ok'),
    redirect: count((r) => r.verdict === 'redirect'),
    dead: count((r) => r.verdict === 'dead'),
    retracted: count((r) => r.verdict === 'retracted' || r.verdict === 'retracted-labelled'),
    retractedUnlabelled: count((r) => r.verdict === 'retracted'),
    superseded: count((r) => r.notices?.superseded),
    mismatch: count((r) => r.verdict === 'mismatch'),
    unverified: count((r) => r.verdict === 'unverified'),
    concerns: count((r) => r.notices?.concern),
    corrections: count((r) => (r.notices?.notices ?? []).some((n) => n.status === 'corrected')),
    weakCitations: count((r) => r.grade?.research && r.grade.strength !== null && r.grade.strength <= WEAK_MAX),
    weakClaims: topicAssessments.filter((t) => t.weakOnly).length,
    overratedClaims: topicAssessments.filter((t) => t.status === 'overrated').length,
    extraLinks: extraLinks.length,
    extraDead: extraLinks.filter((l) => l.status === 'dead').length,
  };
}

/** Non-zero exit when anything is dead, retracted, or the citation points at the wrong paper. */
export function exitCodeFor(summary, { strict = false } = {}) {
  if (summary.dead || summary.retractedUnlabelled || summary.mismatch || summary.extraDead || summary.missingRefs) return 1;
  if (strict && (summary.overratedClaims || summary.unverified || summary.redirect)) return 1;
  return 0;
}
