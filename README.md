# Sound Evidence

Static educational companion site for music, sound practices, and wellbeing research.

**Not** a sales site. **Not** medical advice. Soft footer credit to [The Meta Musician](https://themetamusician.com/).

## Stack

- [Astro 4](https://astro.build/) (static output)
- Content collections under `src/content/`
- Netlify Forms newsletter signup
- Deploy-ready `netlify.toml`

## Site URL (provisional)

`astro.config.mjs` currently sets:

```js
site: 'https://sound-evidence-hub.netlify.app'
```

That is a **placeholder Netlify-style hostname** until the real Netlify subdomain or custom domain is known. Replace it before (or right after) the first production deploy so absolute canonical and Open Graph URLs match the live origin.

`BaseLayout.astro` also falls back to the request origin when `Astro.site` is unset, so local `astro dev` / preview still produce usable canonical/OG links.

### Before deploy checklist

1. Confirm the real public URL (Netlify subdomain or custom domain).
2. Update `site` in `astro.config.mjs` to that exact origin (https, no trailing path).
3. Rebuild (`npm run build`) and verify `/` canonical + `og:url` / `og:image` absolute URLs.
4. Do **not** leave any `*.example.com` placeholder.

## Quick start

```bash
cd sound-evidence-hub
npm install
npm run dev      # http://localhost:4321
npm run build    # writes to dist/
npm run preview  # preview the production build
```

## Add content

| Collection | Path | Notes |
|------------|------|--------|
| Studies | `src/content/studies/*.md` | Frontmatter: intervention, evidenceStrength, honestLine, url, … |
| News | `src/content/news/*.md` | Institutional / press briefs |
| Experiments | `src/content/experiments/*.md` | Always label exploratory |
| Newsletters | `src/content/newsletters/*.md` | ~300–500 word issues |

Schema lives in `src/content/config.ts`. After adding files, restart `astro dev` if collections don’t refresh.

## Routes

- `/` — Home
- `/studies/` — Filterable study cards (+ `/studies/[slug]/`)
- `/news/` — News briefs
- `/experiments/` — Exploratory writeups
- `/newsletters/` — Issues + Netlify subscribe form
- `/newsletters/success/` — Form success copy
- `/about/` — Disclaimer, labels, palette

## Brand palette

| Role | Hex |
|------|-----|
| Orange | `#df4633` |
| Cream cards | `#e7e1d2` |
| Page cream | `#f1ede8` |
| Terracotta | `#ce523e` |
| Ink | `#2A221C` |
| Muted | `#6B5E54` |

Fonts (Google Fonts, loaded in `BaseLayout.astro`):

- **Manrope** — headings
- **Karla** — body
- **Great Vibes** — sparse script accent (hero italic); free substitute echoing Meta Musician’s soft script look (do **not** use proprietary Sloop Script)

## Editorial / FTC posture

- Educational, not medical advice (banner + relevant pages)
- Prefer **adjunct** / **short-term** language
- Singing bowls = **weak** evidence
- No treat/cure; no 432/528-as-medicine claims
- Music therapy ≠ sound baths
- Abstract-only cards (e.g. Landry 2014, Garcia-Argibay 2019) must stay labeled as such

## Deploy (Netlify)

1. Connect the repo (push is handled separately from this scaffold — Primark / deploy owner pushes).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set the real `site` URL in `astro.config.mjs` (see above).
5. After first deploy, confirm the `newsletter` form appears under **Forms** (form uses `netlify` + honeypot `bot-field`).

Do **not** leave `https://soundevidence.example.com` or any other `.example.com` site value.

## Seed sources

Study and news paraphrases draw from Magos packs:

- `/workspace/forge-handoff/sound-healing-evidence.md`
- `/workspace/research/sound-healing-evidence.md`
- `/workspace/research/forge-evidence-hub-seed.md`

Always verify numbers against the original papers/pages before publishing updates.
