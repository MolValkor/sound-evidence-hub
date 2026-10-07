// End-to-end run of the checker against a fully mocked network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHttp } from '../net.mjs';
import { exitCodeFor } from '../lib.mjs';
import { renderJson, renderMarkdown } from '../report.mjs';
import { runChecks } from '../sources.mjs';
import { fx, json, noSleep, ok, redirect, stubFetch } from './helpers.mjs';

const handle = (doi, exists = true) => ({ [`https://doi.org/api/handles/${doi}`]: json(exists ? { responseCode: 1, values: [{ type: 'URL', data: { value: `https://publisher.example/${doi}` } }] } : { responseCode: 100 }, exists ? 200 : 404) });
const landing = (doi, status = 200) => ({
  [`HEAD https://doi.org/${doi}`]: redirect(`https://publisher.example/${doi}`),
  [`GET https://doi.org/${doi}`]: redirect(`https://publisher.example/${doi}`),
  [`HEAD https://publisher.example/${doi}`]: new Response(null, { status }),
  [`GET https://publisher.example/${doi}`]: new Response(null, { status }),
});
const crossref = (doi, message) => ({
  [`https://api.crossref.org/works/${doi}`]: message ? json({ message }) : json({}, 404),
  [`https://api.crossref.org/works?filter=updates:${doi}&rows=20`]: json({ message: { items: [] } }),
});

const citations = {
  jespersen2022: {
    id: 'jespersen2022', authors: 'Jespersen KV, Pando-Naude V', year: 2022, title: 'Listening to music for insomnia in adults',
    journal: 'Cochrane', type: 'Cochrane systematic review (13 RCTs)', doi: '10.1002/14651858.CD010459.pub3', pmid: '36000763', pmcid: 'PMC9400393', access: 'abstract', finding: '',
  },
  braun: {
    id: 'braun', authors: 'Braun Janzen T, Paneduro D', year: 2019, title: 'A parallel randomized controlled trial examining the effects of rhythmic sensory stimulation on fibromyalgia symptoms',
    journal: 'PLOS ONE', type: 'Randomized trial, two active arms (n = 50)', doi: '10.1371/journal.pone.0212021', pmid: '30822311', access: 'abstract', finding: '',
  },
  agency: { id: 'agency', authors: 'Some Agency', year: 2022, title: 'Fact sheet', journal: 'Agency', type: 'Government evidence overview', url: 'https://agency.example/old', access: 'page', finding: '' },
  gone: { id: 'gone', authors: 'Nobody A', year: 2020, title: 'A paper that vanished', journal: 'J', type: 'Observational study', doi: '10.9999/gone', access: 'abstract', finding: '' },
};
const topics = [
  { slug: 'sleep', title: 'Sleep', rating: 'moderate', citations: ['jespersen2022', 'agency'] },
  { slug: 'vat', title: 'Vibroacoustic', rating: 'moderate', citations: ['braun', 'gone'] },
];

function routes() {
  return {
    [`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=sound-evidence-hub&id=36000763,30822311`]: json({ result: { uids: ['36000763', '30822311'], 36000763: fx.pubmed['36000763'], 30822311: fx.pubmed['30822311'] } }),
    ...handle('10.1002/14651858.CD010459.pub3'), ...landing('10.1002/14651858.CD010459.pub3', 403), ...crossref('10.1002/14651858.CD010459.pub3', fx.crossref_cochrane_jespersen),
    ...handle('10.1371/journal.pone.0212021'), ...landing('10.1371/journal.pone.0212021'), ...crossref('10.1371/journal.pone.0212021', fx.crossref_braunjanzen),
    ...handle('10.9999/gone', false), ...crossref('10.9999/gone', null),
    'https://doi.org/ra/10.9999/gone': json([{ DOI: '10.9999/gone', RA: 'mEDRA' }]),
    'HEAD https://agency.example/old': redirect('https://agency.example/new', 301),
    'HEAD https://agency.example/new': ok(),
    'HEAD https://news.example/story': new Response(null, { status: 404 }),
    'GET https://news.example/story': new Response(null, { status: 404 }),
  };
}

test('full run: verdicts, topic flags, report and exit code', async () => {
  const { fetchImpl } = stubFetch(routes());
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const extraLinks = [{ where: 'src/content/news/x.md', title: 'x', url: 'https://news.example/story' }];
  const run = await runChecks(http, { citations, topics, extraLinks }, { concurrency: 2 });
  const v = Object.fromEntries(run.results.map((r) => [r.id, r.verdict]));
  assert.deepEqual(v, { jespersen2022: 'ok', braun: 'retracted', agency: 'redirect', gone: 'dead' });
  const agency = run.results.find((r) => r.id === 'agency').links[0];
  assert.equal(agency.canonical, 'https://agency.example/new');
  const jes = run.results.find((r) => r.id === 'jespersen2022');
  assert.equal(jes.links.find((l) => l.kind === 'doi').landingBlocked, true, 'Wiley-style 403 is not a dead link');
  assert.equal(run.summary.dead, 1);
  assert.match(run.results.find((r) => r.id === 'gone').issues[0].message, /registered with mEDRA/);
  assert.equal(run.summary.retractedUnlabelled, 1);
  assert.equal(run.summary.extraDead, 1);
  assert.equal(run.topics.find((t) => t.slug === 'vat').status, 'overrated', 'retracted paper no longer counts as support');
  assert.equal(exitCodeFor(run.summary), 1);
  const md = renderMarkdown(run, { checkedAt: 'T' });
  assert.match(md, /`braun` — retracted/);
  assert.match(md, /10\.1371\/journal\.pone\.0230395/);
  assert.match(md, /❌ overrated/);
  assert.equal(renderJson(run, { checkedAt: 'T' }).citations.length, 4);
});

test('labelling the retraction in the registry makes it pass', async () => {
  const { fetchImpl } = stubFetch(routes());
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const labelled = {
    jespersen2022: citations.jespersen2022,
    braun: { ...citations.braun, retraction: { noticeDoi: '10.1371/journal.pone.0230395', date: '2020-03-06', note: '' } },
  };
  const run = await runChecks(http, { citations: labelled, topics: [{ slug: 's', title: 'S', rating: 'moderate', citations: ['jespersen2022', 'braun'] }] });
  assert.equal(run.results.find((r) => r.id === 'braun').verdict, 'retracted-labelled');
  assert.equal(exitCodeFor(run.summary), 0);
});

test('topics that reference unknown citation ids fail the run', async () => {
  const { fetchImpl } = stubFetch(routes());
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const run = await runChecks(http, { citations: { jespersen2022: citations.jespersen2022 }, topics: [{ slug: 's', title: 'S', rating: 'moderate', citations: ['jespersen2022', 'typo2020'] }] });
  assert.deepEqual(run.missingRefs, [{ topic: 's', id: 'typo2020' }]);
  assert.equal(exitCodeFor(run.summary), 1);
});
