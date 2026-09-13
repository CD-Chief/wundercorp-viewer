import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Local dev tool: `awesome-components` data (components/, data/components.json) lives
// one directory up, at the repo root. We read it directly at build/request time (see
// src/lib/components.ts and src/pages/components/[...path].ts) rather than copying it
// into src/content or symlinking it into public/ — a symlink doesn't survive a plain
// `git clone` on every platform (notably Windows without Developer Mode / core.symlinks).
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
