# Component Gallery Viewer

A local Astro app for browsing the `../components` library (from the
`awesome-components` data in this repo) as a searchable, visual gallery.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. http://localhost:4321).

## How it works

- `src/lib/components.ts` reads `../data/components.json` (repo root, one
  level up) directly at build/request time — no copy step, no separate
  content sync.
- `src/pages/components/[...path].ts` serves screenshots and `rendered.html`
  snapshots straight from `../components` (repo root) by reading them with
  `node:fs`, without duplicating the files. (An earlier version used a
  `public/components` symlink instead; that broke on machines where `git
  clone` doesn't preserve symlinks, notably Windows without Developer Mode /
  `core.symlinks=true`, so it was replaced with this endpoint.)
- `/` — gallery grid with instant client-side search (name/author/bucket)
  and bucket chips.
- `/component/[...slug]` — detail view: sandboxed iframe of `rendered.html`,
  screenshot, and `prompt.md` with a "Copy prompt" button.

This is a local dev tool only — no backend, no auth, nothing writes back to
`../components` or `../data`. `npm run build` works (prerenders all ~6,591
detail pages as static HTML) but isn't necessary for local use; it also
copies the full `components/` tree into `dist/`, which is large.
