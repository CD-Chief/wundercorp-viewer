import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Local dev tool: `awesome-components` data (components/, data/components.json) lives
// one directory up, at the repo root. We read it directly at build time (see
// src/lib/components.ts) rather than copying it into src/content, and we symlink
// viewer/public/components -> ../components so screenshots/rendered.html are served
// as static assets without duplicating ~700MB of files.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [".."],
      },
    },
  },
});
