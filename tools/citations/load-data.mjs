// Load the TypeScript data registries (citations, topics) and the URLs/DOIs in the
// Markdown content collections, without needing Astro or a TS runtime.

import { build } from 'esbuild';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function importTs(file) {
  const out = await build({ entryPoints: [file], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
  const code = out.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

/** Minimal frontmatter reader: only the flat `key: "value"` / `key: value` lines we need. */
export function readFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = v;
  }
  return data;
}

export async function loadContentLinks(root) {
  const items = [];
  for (const collection of ['studies', 'news']) {
    const dir = path.join(root, 'src/content', collection);
    let files = [];
    try { files = (await readdir(dir)).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files.sort()) {
      const fm = readFrontmatter(await readFile(path.join(dir, f), 'utf8'));
      const where = `src/content/${collection}/${f}`;
      if (fm.url) items.push({ where, title: fm.title ?? f, url: fm.url });
      if (fm.doi && !(fm.url ?? '').includes(fm.doi)) items.push({ where, title: fm.title ?? f, doi: fm.doi });
    }
  }
  return items;
}

export async function loadData(root) {
  const [{ citations }, { topics }] = await Promise.all([
    importTs(path.join(root, 'src/data/citations.ts')),
    importTs(path.join(root, 'src/data/topics.ts')),
  ]);
  const extraLinks = await loadContentLinks(root);
  return { citations, topics, extraLinks };
}

export { pathToFileURL };
