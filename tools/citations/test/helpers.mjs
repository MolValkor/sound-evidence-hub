import { readFileSync } from 'node:fs';

export const fx = JSON.parse(readFileSync(new URL('./fixtures/live-samples.json', import.meta.url), 'utf8'));

/** Build a fetch stub from a route table: { 'METHOD url' | url: Response | (req) => Response }. */
export function stubFetch(routes) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    const method = init.method ?? 'GET';
    calls.push(`${method} ${url}`);
    const handler = routes[`${method} ${url}`] ?? routes[url] ?? routes['*'];
    if (!handler) return new Response('not found', { status: 404 });
    const res = typeof handler === 'function' ? await handler({ url, method, n: calls.filter((c) => c === `${method} ${url}`).length }) : handler;
    if (res instanceof Error) throw res;
    return typeof res === 'object' && !(res instanceof Response) ? json(res) : res.clone();
  };
  return { fetchImpl, calls };
}

export const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
export const redirect = (location, status = 302) => new Response(null, { status, headers: { location } });
export const ok = (status = 200) => new Response('ok', { status });
export const noSleep = async () => {};
