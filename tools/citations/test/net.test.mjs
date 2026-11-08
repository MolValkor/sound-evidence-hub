import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createCache, createHttp } from '../net.mjs';
import { json, noSleep, ok, redirect, stubFetch } from './helpers.mjs';

test('getJson retries 503 and 429 then succeeds', async () => {
  const { fetchImpl, calls } = stubFetch({
    'https://api.example/x': ({ n }) => (n === 1 ? new Response('', { status: 503 }) : n === 2 ? new Response('', { status: 429, headers: { 'retry-after': '1' } }) : json({ ok: true })),
  });
  const slept = [];
  const http = createHttp({ fetchImpl, sleep: async (ms) => slept.push(ms), hostIntervalMs: {} });
  const r = await http.getJson('https://api.example/x');
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { ok: true });
  assert.equal(calls.length, 3);
  assert.deepEqual(slept, [500, 1000], 'exponential backoff, then honours Retry-After');
});

test('getJson gives up after the retry budget', async () => {
  const { fetchImpl, calls } = stubFetch({ '*': () => new Response('', { status: 500 }) });
  const http = createHttp({ fetchImpl, sleep: noSleep, retries: 3, hostIntervalMs: {} });
  const r = await http.getJson('https://api.example/down');
  assert.equal(r.status, 500);
  assert.equal(calls.length, 3);
});

test('probe follows redirects hop by hop and records the chain', async () => {
  const { fetchImpl } = stubFetch({
    'HEAD https://old.example/a': redirect('https://new.example/a', 301),
    'HEAD https://new.example/a': redirect('/a/', 302),
    'HEAD https://new.example/a/': ok(),
  });
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const p = await http.probe('https://old.example/a');
  assert.equal(p.status, 200);
  assert.equal(p.finalUrl, 'https://new.example/a/');
  assert.deepEqual(p.chain.map((h) => h.status), [301, 302, 200]);
});

test('probe falls back to GET when HEAD is refused', async () => {
  const { fetchImpl, calls } = stubFetch({
    'HEAD https://site.example/p': new Response(null, { status: 405 }),
    'GET https://site.example/p': ok(),
  });
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const p = await http.probe('https://site.example/p');
  assert.equal(p.status, 200);
  assert.equal(p.method, 'GET');
  assert.deepEqual(calls, ['HEAD https://site.example/p', 'GET https://site.example/p']);
});

test('probe keeps HTTP 403 when GET is also forbidden, and reports 404 when the page is gone', async () => {
  const forbidden = stubFetch({
    'HEAD https://site.example/p': new Response(null, { status: 403 }),
    'GET https://site.example/p': new Response('no', { status: 403 }),
  });
  const http403 = createHttp({ fetchImpl: forbidden.fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const blocked = await http403.probe('https://site.example/p');
  assert.equal(blocked.status, 403);
  assert.equal(blocked.error, undefined);
  assert.deepEqual(forbidden.calls, ['HEAD https://site.example/p', 'GET https://site.example/p']);

  const missing = stubFetch({
    'HEAD https://site.example/missing': new Response(null, { status: 405 }),
    'GET https://site.example/missing': new Response('missing', { status: 404 }),
  });
  const http404 = createHttp({ fetchImpl: missing.fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const dead = await http404.probe('https://site.example/missing');
  assert.equal(dead.status, 404);
  assert.equal(dead.method, 'GET');
});

test('probe reports network errors instead of throwing', async () => {
  const err = Object.assign(new TypeError('fetch failed'), { cause: { code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND gone.example' } });
  const { fetchImpl } = stubFetch({ '*': () => err });
  const http = createHttp({ fetchImpl, sleep: noSleep, hostIntervalMs: {} });
  const p = await http.probe('https://gone.example/');
  assert.equal(p.status, null);
  assert.equal(p.error.code, 'ENOTFOUND');
  assert.notEqual(p.status, 404);
});

test('disk cache serves repeat requests and expires by TTL; 5xx is never cached', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'cite-cache-'));
  let clock = 1_000_000;
  const now = () => clock;
  const { fetchImpl, calls } = stubFetch({
    'https://api.example/a': json({ v: 1 }),
    'https://api.example/b': new Response('', { status: 502 }),
  });
  const mk = () => createHttp({ fetchImpl, sleep: noSleep, now, retries: 1, hostIntervalMs: {}, cache: createCache({ dir, now, maxAgeMs: 1000 }) });
  await mk().getJson('https://api.example/a');
  const second = await mk().getJson('https://api.example/a'); // new client, same disk cache
  assert.equal(second.cached, true);
  assert.equal(calls.filter((c) => c.endsWith('/a')).length, 1);
  clock += 5000;
  assert.equal((await mk().getJson('https://api.example/a')).cached, false, 'expired entry refetched');
  await mk().getJson('https://api.example/b');
  await mk().getJson('https://api.example/b');
  assert.equal(calls.filter((c) => c.endsWith('/b')).length, 2);
});

test('requests to one host are spaced out', async () => {
  let clock = 0;
  const waits = [];
  const { fetchImpl } = stubFetch({ '*': json({}) });
  const http = createHttp({ fetchImpl, now: () => clock, sleep: async (ms) => { waits.push(ms); clock += ms; }, hostIntervalMs: { 'api.example': 250 } });
  await Promise.all([http.getJson('https://api.example/1'), http.getJson('https://api.example/2'), http.getJson('https://api.example/3')]);
  assert.deepEqual(waits, [250, 250]);
});
