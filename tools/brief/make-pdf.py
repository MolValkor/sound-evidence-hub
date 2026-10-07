#!/usr/bin/env python3
"""Render /brief/ to public/evidence-brief.pdf (one US Letter page).

Usage (from the repo root):
    npm run build && npx astro preview --port 4399 &
    python3 tools/brief/make-pdf.py [--base http://localhost:4399] [--shots DIR]

Needs: pip install playwright && playwright install chromium
Re-run after editing src/data/brief.ts, topics or citations, or after changing the
site URL in astro.config.mjs (the PDF prints the sources URL).
"""
import argparse, asyncio, pathlib, subprocess, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]

async def main(base: str, shots: str | None) -> int:
    out = ROOT / 'public' / 'evidence-brief.pdf'
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f'{base}/brief/', wait_until='networkidle')
        await page.evaluate('document.fonts.ready')
        await page.emulate_media(media='print')
        await page.pdf(path=str(out), format='Letter', print_background=True, prefer_css_page_size=True)
        if shots:
            d = pathlib.Path(shots); d.mkdir(parents=True, exist_ok=True)
            await page.set_viewport_size({'width': 816, 'height': 1056})  # Letter @ 96 dpi
            await page.screenshot(path=str(d / 'brief-print-preview.png'), full_page=True)
            await page.emulate_media(media='screen')
            for name, vp, scale, mobile in [('desktop', {'width': 1366, 'height': 900}, 1, False), ('mobile', {'width': 390, 'height': 844}, 2, True)]:
                ctx = await browser.new_context(viewport=vp, device_scale_factor=scale, is_mobile=mobile)
                pg = await ctx.new_page()
                errors = []
                pg.on('console', lambda m, e=errors: e.append(m.text) if m.type == 'error' else None)
                pg.on('pageerror', lambda x, e=errors: e.append(str(x)))
                await pg.goto(f'{base}/brief/', wait_until='networkidle')
                await pg.evaluate('document.fonts.ready')
                overflow = await pg.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
                await pg.screenshot(path=str(d / f'brief-{name}.png'), full_page=True)
                await pg.screenshot(path=str(d / f'brief-{name}-viewport.png'))
                print(f'{name}: errors={errors} horizontal_overflow={overflow}')
                await ctx.close()
        await browser.close()
    try:
        info = subprocess.run(['pdfinfo', str(out)], capture_output=True, text=True).stdout
        pages = next((l.split()[-1] for l in info.splitlines() if l.startswith('Pages:')), '?')
    except FileNotFoundError:
        pages = '?'
    print(f'wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB, pages: {pages})')
    if pages not in ('1', '?'):
        print('ERROR: brief must fit on one page; tighten print CSS in src/pages/brief/index.astro', file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:4399')
    ap.add_argument('--shots')
    a = ap.parse_args()
    sys.exit(asyncio.run(main(a.base, a.shots)))
