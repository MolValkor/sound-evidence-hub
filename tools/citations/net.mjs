// Network layer: polite fetch with retries, per-host throttling, manual redirect
// following (so we can see 301 vs 302 hops) and an on-disk JSON cache.
// `fetchImpl`, `sleep` and `now` are injectable so tests never touch the network.

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const USER_AGENT =
  'sound-evidence-hub-citation-checker/1.0 (+https://github.com/MolValkor/sound-evidence-hub)';

export function createCache({ dir, maxAgeMs = 72 * 3600e3, disabled = false, now = () => Date.now() } = {}) {
  const file = (key) => path.join(dir, `${createHash('sha1').update(key).digest('hex')}.json`);
  const mem = new Map();
  return {
    async get(key, ttl = maxAgeMs) {
      if (disabled) return undefined;
      let entry = mem.get(key);
      if (!entry && dir) {
        try { entry = JSON.parse(await readFile(file(key), 'utf8')); } catch { entry = undefined; }
      }
      if (!entry || now() - entry.at > ttl) return undefined;
      return entry.value;
    },
    async set(key, value) {
      const entry = { key, at: now(), value };
      mem.set(key, entry);
      if (disabled || !dir) return;
      await mkdir(dir, { recursive: true });
      await writeFile(file(key), JSON.stringify(entry));
    },
  };
}

export function createHttp({
  fetchImpl = globalThis.fetch,
  cache = createCache({ disabled: true }),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  now = () => Date.now(),
  retries = 3,
  timeoutMs = 25000,
  hostIntervalMs = { 'eutils.ncbi.nlm.nih.gov': 400, 'api.crossref.org': 260, default: 150 },
  userAgent = USER_AGENT,
  log = () => {},
} = {}) {
  const lastHit = new Map();
  const hostQueue = new Map();
  let requests = 0;
  let cacheHits = 0;

  // Serialise requests per host and keep a minimum gap between them.
  async function throttle(url) {
    const host = new URL(url).hostname;
    const gap = hostIntervalMs[host] ?? hostIntervalMs.default ?? 0;
    const prev = hostQueue.get(host) ?? Promise.resolve();
    let release;
    const mine = new Promise((r) => (release = r));
    hostQueue.set(host, prev.then(() => mine));
    await prev;
    const wait = lastHit.has(host) ? lastHit.get(host) + gap - now() : 0;
    if (wait > 0) await sleep(wait);
    lastHit.set(host, now());
    return release;
  }

  async function once(url, { method = 'GET', headers = {} } = {}) {
    const release = await throttle(url);
    requests++;
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    try {
      return await fetchImpl(url, {
        method,
        redirect: 'manual',
        headers: { 'user-agent': userAgent, accept: '*/*', ...headers },
        signal: ctrl?.signal,
      });
    } finally {
      if (timer) clearTimeout(timer);
      release();
    }
  }

  const retryable = (status) => status === 429 || status >= 500;

  async function withRetries(fn, label) {
    let lastErr;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fn();
        if (!retryable(res.status) || attempt === retries - 1) return res;
        const ra = Number(res.headers?.get?.('retry-after'));
        const delay = Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 10000) : 500 * 3 ** attempt;
        log(`retry ${label} after HTTP ${res.status} (${delay} ms)`);
        res.body?.cancel?.().catch(() => {}); // don't await: tee'd bodies never settle
        await sleep(delay);
      } catch (err) {
        lastErr = err;
        if (/ENOTFOUND/.test(`${err?.cause?.code ?? err?.code}`) || attempt === retries - 1) throw err;
        const delay = 500 * 3 ** attempt;
        log(`retry ${label} after ${err?.cause?.code ?? err?.name} (${delay} ms)`);
        await sleep(delay);
      }
    }
    throw lastErr;
  }

  /** GET a JSON API. Returns { status, json } and caches 2xx/404 answers. */
  async function getJson(url, { ttl, headers } = {}) {
    const key = `json:${url}`;
    const hit = await cache.get(key, ttl);
    if (hit) { cacheHits++; return { ...hit, cached: true }; }
    let res = await withRetries(() => once(url, { headers: { accept: 'application/json', ...headers } }), url);
    // APIs rarely redirect, but follow a few hops if they do.
    for (let hop = 0; hop < 5 && res.status >= 300 && res.status < 400 && res.headers.get('location'); hop++) {
      const next = new URL(res.headers.get('location'), url).toString();
      res = await withRetries(() => once(next, { headers: { accept: 'application/json', ...headers } }), next);
    }
    let json = null;
    try { json = await res.json(); } catch { json = null; }
    const out = { status: res.status, json };
    if ((res.status >= 200 && res.status < 300) || res.status === 404) await cache.set(key, out);
    return { ...out, cached: false };
  }

  /**
   * Follow a URL hop by hop (HEAD first, GET if HEAD is refused) and report the chain.
   * Returns { status, finalUrl, chain, method, error? }.
   */
  async function probe(url, { ttl } = {}) {
    const key = `probe:${url}`;
    const hit = await cache.get(key, ttl);
    if (hit) { cacheHits++; return { ...hit, cached: true }; }
    let result;
    try {
      result = await follow(url, 'HEAD');
      if (result.status === 405 || result.status === 403 || result.status === 404 || result.status === 501 || result.status === 400) {
        const viaGet = await follow(url, 'GET');
        result = viaGet;
      }
    } catch (err) {
      result = { status: null, finalUrl: url, chain: [], error: { code: err?.cause?.code ?? err?.code ?? err?.name, message: String(err?.cause?.message ?? err?.message ?? err) } };
    }
    // Only cache definitive answers so a flaky moment doesn't stick for days.
    if (!result.error && result.status && !(result.status >= 500)) await cache.set(key, result);
    return { ...result, cached: false };
  }

  async function follow(url, method) {
    const chain = [];
    let current = url;
    for (let hop = 0; hop < 10; hop++) {
      const res = await withRetries(() => once(current, { method, headers: { accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8' } }), current);
      const location = res.headers.get('location');
      chain.push({ url: current, status: res.status, location: location ?? undefined });
      res.body?.cancel?.().catch(() => {}); // don't await: tee'd bodies never settle
      if (res.status >= 300 && res.status < 400 && location) {
        current = new URL(location, current).toString();
        continue;
      }
      return { status: res.status, finalUrl: current, chain, method };
    }
    return { status: 310, finalUrl: current, chain, method, error: { code: 'TOO_MANY_REDIRECTS', message: 'more than 10 redirects' } };
  }

  return { getJson, probe, stats: () => ({ requests, cacheHits }) };
}
