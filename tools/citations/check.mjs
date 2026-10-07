#!/usr/bin/env node
// Citation checker for Sound Evidence.  Usage:
//   npm run check:citations                # check, write reports, exit 1 on dead/retracted/mismatch
//   npm run check:citations -- --strict    # also fail on overrated claims, redirects, unverified links
//   npm run check:citations -- --refresh   # ignore the cache (still writes fresh answers to it)
//   npm run check:citations -- --no-write  # print summary only
// Env: CROSSREF_MAILTO (Crossref polite pool), NCBI_API_KEY (optional, higher PubMed rate limit),
//      CITATION_CACHE_DIR (default .cache/citations)

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from './load-data.mjs';
import { createCache, createHttp } from './net.mjs';
import { exitCodeFor } from './lib.mjs';
import { renderJson, renderMarkdown, renderStatus } from './report.mjs';
import { runChecks } from './sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const quiet = args.has('--quiet');
const log = (m) => { if (!quiet) console.error(m); };

const cache = createCache({
  dir: path.resolve(root, process.env.CITATION_CACHE_DIR ?? '.cache/citations'),
  disabled: false,
});
const readThrough = args.has('--refresh') ? { ...cache, get: async () => undefined } : cache;
const http = createHttp({ cache: readThrough, log });

const data = await loadData(root);
log(`Checking ${Object.keys(data.citations).length} citations, ${data.topics.length} topics, ${data.extraLinks.length} other links…`);
const run = await runChecks(http, data, { log });
const checkedAt = new Date().toISOString();

if (!args.has('--no-write')) {
  await mkdir(path.join(root, 'docs'), { recursive: true });
  await writeFile(path.join(root, 'docs/citation-report.md'), renderMarkdown(run, { checkedAt }) + '\n');
  await writeFile(path.join(root, 'docs/citation-report.json'), JSON.stringify(renderJson(run, { checkedAt }), null, 2) + '\n');
  await writeFile(path.join(root, 'src/data/citation-status.json'), JSON.stringify(renderStatus(run, { checkedAt }), null, 2) + '\n');
}

const s = run.summary;
const { requests, cacheHits } = http.stats();
console.log(
  `citations: ${s.citations} | ok ${s.ok} | redirect ${s.redirect} | dead ${s.dead} | retracted ${s.retracted} | mismatch ${s.mismatch} | unverified ${s.unverified}` +
    ` | weak-only claims ${s.weakClaims} (overrated ${s.overratedClaims}) | other links ${s.extraLinks} (dead ${s.extraDead})` +
    ` | http ${requests}, cache hits ${cacheHits}`,
);
if (!args.has('--no-write')) console.log('Report: docs/citation-report.md (+ .json)');
process.exitCode = exitCodeFor(s, { strict });
