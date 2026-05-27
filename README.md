# Honeywell Copilot Case Study Deck

Reveal.js-based HTML slide deck with a reproducible, programmatic build path.

## What this repo contains

- `index.html`: Generated presentation shell that loads reveal.js.
- `data/slides.json`: Structured source of truth for slide content.
- `scripts/build-deck.mjs`: Node script that compiles `slides.json` into HTML sections.
- `src/template.html`: Minimal reveal.js template used by the build script.
- `assets/current-way-diagram.svg`: Minimal system diagram for fragmented workflow.
- `docs/slide-plan.md`: Detailed plan (slides, visuals, and sequencing).

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the deck:

   ```bash
   npm run build
   ```

3. Preview locally:

   ```bash
   npm run serve
   ```

4. Open `http://localhost:4173`.

## Publish online (GitHub Pages)

- The included GitHub Action (`.github/workflows/deploy.yml`) builds and deploys the deck to Pages on push to `main`.
- Enable Pages in repository settings (source: GitHub Actions).

## Why this structure

- You can edit content in `data/slides.json` without touching layout code.
- The deck is always regenerable and reviewable in git diffs.
- The same data structure can later feed a PowerPoint exporter script if needed.
