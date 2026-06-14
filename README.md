# Blossom Word Game

A free daily word‑hunt puzzle game inspired by the New York Times Spelling Bee.
Create as many words as you can from the seven letters in the hive — every word
must be at least four letters long and include the center letter. A new puzzle
is generated every day.

This is a refactor of the original project, rebuilt as a modern, lightweight
single‑page app and deployed on Cloudflare.

## Tech stack

- [Vue 3](https://vuejs.org/) + `<script setup>` + TypeScript
- [Vite](https://vite.dev/) for build/dev
- [Pinia](https://pinia.vuejs.org/) for state, persisted to `localStorage`
- [Vue Router](https://router.vuejs.org/) (history mode)
- [vue-i18n](https://vue-i18n.intlify.dev/) for copy/localization
- Hand‑rolled UI components (no heavy component library)
- Deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/) static assets

## Features

- **Daily puzzle** — deterministic per calendar day so everyone gets the same hive.
- **Hive input** — click letters or use the keyboard; delete / shuffle / enter.
- **Scoring & ranks** — 4‑letter words = 1 pt, longer = 1 pt/letter, pangrams = +7.
  Tap the progress bar to see the score needed for each rank.
- **Yesterday's answers** — review the previous day's solutions.
- **Blossom Solver** (`/solver`) — enter a center + 6 outer letters to list every word.
- **Dark mode** — toggle persisted across visits.

## Project structure

```
src/
  assets/styles/   global + shared SCSS
  components/      reusable UI (hive, modal, toast, progress, word grid…)
  composables/     useToast
  locales/         i18n messages
  router/          routes + document <head> meta
  stores/          game + theme Pinia stores
  types/           shared TypeScript types
  utils/           puzzle logic + array helpers
  views/           GameView, SolverView
public/data/       allAnswers.json (precomputed puzzles, served as a static asset)
```

The puzzle list (`public/data/allAnswers.json`) is fetched on demand and cached
by the browser/CDN, so it is not bundled into the JS.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Deployment (Cloudflare)

The app is a static SPA served from Cloudflare Workers via `wrangler.jsonc`.

```bash
npm run deploy     # build + wrangler deploy
```

### Continuous deployment

Either connect the GitHub repo to Cloudflare (Workers & Pages → Create →
import the repo, build command `npm run build`, output `dist`), or use the
included GitHub Actions workflow (`.github/workflows/deploy.yml`), which needs
the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Credits

- Inspired by the [NYT Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee)
- Based on [ConorSheehan1/spelling-bee](https://github.com/ConorSheehan1/spelling-bee)
- Word list: [12 dicts](http://wordlist.aspell.net/12dicts/)
