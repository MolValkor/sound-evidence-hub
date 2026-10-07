import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assessTopics, citationVerdict, classifyLink, compareCrossref, comparePubmed, detectNotices, exitCodeFor,
  firstAuthorFamily, gradeEvidence, isAcknowledgedRetraction, normalizeText, sameResource, summarize, titleSimilarity,
} from '../lib.mjs';
import { fx } from './helpers.mjs';

const jespersen = {
  id: 'jespersen2022', authors: 'Jespersen KV, Pando-Naude V, Koenig J, Jennum P, Vuust P', year: 2022,
  title: 'Listening to music for insomnia in adults', type: 'Cochrane systematic review (13 RCTs)',
  doi: '10.1002/14651858.CD010459.pub3', pmid: '36000763', pmcid: 'PMC9400393',
};

test('normalizeText strips markup, diacritics and punctuation', () => {
  assert.equal(normalizeText('Kühlmann <i>et al.</i>: “Music” &amp; pain'), 'kuhlmann et al music pain');
});

test('titleSimilarity tolerates case/punctuation and subtitles, rejects different papers', () => {
  assert.equal(titleSimilarity('Music therapy for depression', 'Music Therapy for Depression.'), 1);
  assert.ok(titleSimilarity('Effects of music on pain: a meta-analysis', 'Effects of music on pain') >= 0.85);
  assert.ok(titleSimilarity('Music therapy for depression', 'Gamma frequency entrainment attenuates amyloid load') < 0.3);
});

test('firstAuthorFamily handles particles, compound names and organisations', () => {
  assert.equal(firstAuthorFamily('de Witte M, Spruit A'), 'de Witte');
  assert.equal(firstAuthorFamily('Kühlmann AYR, de Rooij A'), 'Kühlmann');
  assert.equal(firstAuthorFamily('Braun Janzen T, Paneduro D'), 'Braun Janzen');
  assert.equal(firstAuthorFamily('Lee JH'), 'Lee');
});

test('compareCrossref passes a correct Cochrane record (live fixture)', () => {
  const { issues, matched } = compareCrossref(jespersen, fx.crossref_cochrane_jespersen);
  assert.deepEqual(issues.filter((i) => i.level === 'error'), []);
  assert.equal(matched.titleSimilarity, 1);
});

test('compareCrossref flags a DOI that belongs to a different paper', () => {
  const wrong = { ...jespersen, doi: '10.1016/S0140-6736(97)11096-0' };
  const { issues } = compareCrossref(wrong, fx.crossref_wakefield);
  const codes = issues.map((i) => i.code);
  assert.ok(codes.includes('title-mismatch'));
  assert.ok(codes.includes('year-mismatch'));
  assert.ok(codes.includes('author-mismatch'));
});

test('compareCrossref treats a one-year gap as online-first drift (warn, not error)', () => {
  const { issues } = compareCrossref({ ...jespersen, year: 2021 }, fx.crossref_cochrane_jespersen);
  assert.equal(issues.find((i) => i.code === 'year-drift')?.level, 'warn');
});

test('detectNotices finds Retraction Watch retractions via updated-by (live fixture)', () => {
  const n = detectNotices({ doi: '10.1016/S0140-6736(97)11096-0', crossref: fx.crossref_wakefield });
  assert.equal(n.retracted, true);
  assert.ok(n.notices.some((x) => x.source === 'retraction-watch' && x.status === 'retracted'));
  assert.ok(n.notices.some((x) => x.status === 'corrected'));
});

test('detectNotices finds retractions from a Crossref updates: query alone', () => {
  const n = detectNotices({ doi: '10.1371/journal.pone.0212021', crossref: {}, updates: fx.crossref_updates_braunjanzen });
  assert.equal(n.retracted, true);
  assert.equal(n.notices[0].doi.toLowerCase(), '10.1371/journal.pone.0230395');
});

test('Cochrane new_version links are versioning, not retractions', () => {
  const n = detectNotices({ doi: jespersen.doi, crossref: fx.crossref_cochrane_jespersen });
  assert.equal(n.retracted, false);
  assert.equal(n.notices.length, 0);
});

test('a newer version pointing at the cited DOI marks it superseded', () => {
  const updates = [{ DOI: '10.1002/x.pub4', 'update-to': [{ DOI: '10.1002/X.PUB3', type: 'new_version', source: 'publisher' }] }];
  const n = detectNotices({ doi: '10.1002/x.pub3', crossref: {}, updates });
  assert.equal(n.superseded, true);
  assert.equal(n.retracted, false);
});

test('citing a correction notice itself is flagged', () => {
  const n = detectNotices({ doi: '10.1/notice', crossref: { 'update-to': [{ DOI: '10.1/article', type: 'correction' }] } });
  assert.equal(n.retracted, true);
  assert.equal(n.notices[0].status, 'is-notice');
});

test('PubMed "Retracted Publication" and expression-of-concern types are detected', () => {
  assert.equal(detectNotices({ pubmedTypes: fx.pubmed['9500320'].pubtype }).retracted, true);
  assert.equal(detectNotices({ pubmedTypes: ['Journal Article', 'Expression of Concern'] }).concern, true);
});

test('acknowledged retractions are recognised only when the notice DOI matches', () => {
  const notices = detectNotices({ doi: '10.1371/journal.pone.0212021', crossref: fx.crossref_braunjanzen });
  assert.equal(isAcknowledgedRetraction({ retraction: { noticeDoi: '10.1371/journal.pone.0230395' } }, notices), true);
  assert.equal(isAcknowledgedRetraction({ retraction: { noticeDoi: '10.9999/other' } }, notices), false);
  assert.equal(isAcknowledgedRetraction({}, notices), false);
});

test('comparePubmed confirms PMID, DOI and PMCID (live fixture)', () => {
  const { issues } = comparePubmed(jespersen, fx.pubmed['36000763']);
  assert.deepEqual(issues.filter((i) => i.level !== 'info'), []);
});

test('comparePubmed catches wrong DOI, wrong PMCID and missing PMIDs', () => {
  const bad = comparePubmed({ ...jespersen, doi: '10.1/x', pmcid: 'PMC1' }, fx.pubmed['36000763']).issues.map((i) => i.code);
  assert.ok(bad.includes('pmid-doi-mismatch'));
  assert.ok(bad.includes('pmcid-mismatch'));
  assert.equal(comparePubmed(jespersen, { uid: '1', error: 'cannot get document summary' }).issues[0].code, 'pmid-missing');
});

test('classifyLink: dead, blocked, redirect, unreachable', () => {
  assert.equal(classifyLink('https://a.org/x', { status: 404, finalUrl: 'https://a.org/x', chain: [] }).status, 'dead');
  assert.equal(classifyLink('https://a.org/x', { status: 410, finalUrl: 'https://a.org/x', chain: [] }).status, 'dead');
  assert.equal(classifyLink('https://a.org/x', { status: 403, finalUrl: 'https://a.org/x', chain: [] }).status, 'blocked');
  assert.equal(classifyLink('https://a.org/x', { status: 203, finalUrl: 'https://a.org/x', chain: [] }).status, 'blocked');
  const moved = classifyLink('https://a.org/old', { status: 200, finalUrl: 'https://b.org/new', chain: [{ url: 'https://a.org/old', status: 301 }] });
  assert.deepEqual([moved.status, moved.canonical], ['redirect', 'https://b.org/new']);
  // Temporary (302) redirects and cosmetic changes are not "fix the URL" findings.
  assert.equal(classifyLink('https://a.org/x', { status: 200, finalUrl: 'https://b.org/y', chain: [{ status: 302 }] }).status, 'ok');
  assert.equal(classifyLink('http://a.org/x', { status: 200, finalUrl: 'https://www.a.org/x/', chain: [{ status: 301 }] }).status, 'ok');
  assert.equal(classifyLink('https://gone.invalid/', { error: { code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND' } }).status, 'dead');
  assert.equal(classifyLink('https://slow.org/', { error: { code: 'UND_ERR_CONNECT_TIMEOUT', message: 'timeout' } }).status, 'unreachable');
  assert.equal(classifyLink('https://a.org/', { status: 503, finalUrl: 'https://a.org/', chain: [] }).status, 'blocked');
  assert.equal(classifyLink('https://a.org/', { status: 500, finalUrl: 'https://a.org/', chain: [] }).status, 'unreachable');
});

test('sameResource ignores scheme, www and trailing slash only', () => {
  assert.equal(sameResource('http://www.a.org/x/', 'https://a.org/x'), true);
  assert.equal(sameResource('https://a.org/x', 'https://a.org/y'), false);
});

test('gradeEvidence maps stored designs and PubMed types to strength', () => {
  const g = (type, extra = {}) => gradeEvidence({ type, title: '' }, extra);
  assert.equal(g('Cochrane systematic review (13 RCTs)').design, 'systematic-review');
  assert.equal(g('Cochrane systematic review (13 RCTs)', { pubmedTypes: ['Meta-Analysis'] }).design, 'meta-analysis');
  assert.equal(g('Systematic review & meta-analysis (104 RCTs)').strength, 5);
  assert.equal(g('Scoping review (20 studies)').design, 'scoping-review');
  assert.equal(g('Crossover pilot (n = 33)').design, 'small-trial');
  assert.equal(g('Randomized crossover (n = 51)').strength, 2);
  assert.equal(g('Randomized controlled trial (n = 364)').design, 'rct');
  assert.equal(g('Observational pre–post study (no control group)').strength, 1);
  assert.equal(g('Animal study (mice)').design, 'animal');
  assert.equal(g('Technical standard').research, false);
  assert.equal(g('Government evidence overview').design, 'overview');
  assert.equal(g('Editorial').design, 'opinion');
  assert.equal(gradeEvidence({ type: 'Randomized trial (n = 50)', retraction: { noticeDoi: 'x' } }).design, 'retracted');
  assert.equal(gradeEvidence({ type: 'Meta-analysis' }, { retracted: true }).research, false);
});

test('assessTopics flags overrated, weak-only and thin "strong" claims', () => {
  const grades = {
    ma: { research: true, strength: 5, label: 'Meta-analysis' },
    sr: { research: true, strength: 4, label: 'Systematic review' },
    pilot: { research: true, strength: 2, label: 'Pilot' },
    obs: { research: true, strength: 1, label: 'Observational' },
    agency: { research: false, strength: null, label: 'Overview' },
  };
  const out = assessTopics([
    { slug: 'a', title: 'A', rating: 'moderate', citations: ['pilot', 'obs', 'agency'] },
    { slug: 'b', title: 'B', rating: 'preliminary', citations: ['obs'] },
    { slug: 'c', title: 'C', rating: 'strong', citations: ['ma', 'pilot'] },
    { slug: 'd', title: 'D', rating: 'strong', citations: ['ma', 'sr'] },
    { slug: 'e', title: 'E', rating: 'not-supported', citations: ['agency'] },
  ], grades);
  assert.deepEqual(out.map((t) => t.status), ['overrated', 'weak-only', 'thin-strong', 'ok', 'weak-only']);
  assert.equal(out[0].weakOnly, true);
  assert.equal(out[4].maxStrength, null);
});

test('verdicts, summary and exit code', () => {
  const base = { links: [{ status: 'ok' }], issues: [], notices: { retracted: false, notices: [] }, grade: { research: true, strength: 5 } };
  const rs = [
    { ...base },
    { ...base, links: [{ status: 'dead' }] },
    { ...base, notices: { retracted: true, notices: [] } },
    { ...base, notices: { retracted: true, notices: [] }, retractionAcknowledged: true },
    { ...base, issues: [{ level: 'error' }] },
    { ...base, links: [{ status: 'redirect' }] },
    { ...base, links: [{ status: 'unreachable' }] },
  ].map((r) => ({ ...r, verdict: citationVerdict(r) }));
  assert.deepEqual(rs.map((r) => r.verdict), ['ok', 'dead', 'retracted', 'retracted-labelled', 'mismatch', 'redirect', 'unverified']);
  const s = summarize(rs, []);
  assert.equal(s.retracted, 2);
  assert.equal(s.retractedUnlabelled, 1);
  assert.equal(exitCodeFor(s), 1);
  const clean = summarize([rs[0], rs[3], rs[5]], []);
  assert.equal(exitCodeFor(clean), 0, 'labelled retractions and redirects pass by default');
  assert.equal(exitCodeFor(clean, { strict: true }), 1, '--strict fails on redirects');
});
