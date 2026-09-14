# Sound Evidence

Static educational companion site for music, sound practices, and wellbeing research.

**Not** a sales site. **Not** medical advice. Soft footer credit to [The Meta Musician](https://themetamusician.com/).

## Stack

- [Astro 4](https://astro.build/) (static output)
- Content collections under `src/content/`
- Netlify Forms newsletter signup
- Deploy-ready `netlify.toml`

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

Fonts: **Manrope** (headings), **Karla** (body). Optional script accent sparingly in the hero.

## Editorial / FTC posture

- Educational, not medical advice (banner + relevant pages)
- Prefer **adjunct** / **short-term** language
- Singing bowls = **weak** evidence
- No treat/cure; no 432/528-as-medicine claims
- Music therapy ≠ sound baths

## Deploy (Netlify)

1. Connect the repo (push is handled separately from this scaffold).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. After first deploy, confirm the `newsletter` form appears under **Forms** (form uses `netlify` + honeypot `bot-field`).

Optional: set a real `site` URL in `astro.config.mjs` for absolute canonical/OG URLs.

## Seed sources

Study and news paraphrases draw from Magos packs:

- `/workspace/forge-handoff/sound-healing-evidence.md`
- `/workspace/research/sound-healing-evidence.md`
- `/workspace/research/forge-evidence-hub-seed.md`

Always verify numbers against the original papers/pages before publishing updates.
