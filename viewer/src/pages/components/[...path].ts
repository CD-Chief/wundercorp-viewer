import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getAllComponents, REPO_ROOT } from "../../lib/components";

// Serves screenshot.png / rendered.html straight from the repo-root
// components/ directory by reading them with node:fs, rather than via a
// symlinked public/ dir. A symlink doesn't survive a plain `git clone` on
// every platform (notably Windows without Developer Mode / core.symlinks),
// so this works identically everywhere `npm run dev` does.

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".html": "text/html; charset=utf-8",
};

export function getStaticPaths() {
  const relPaths = new Set<string>();
  for (const c of getAllComponents()) {
    // c.screenshotPath / c.htmlPath look like "components/<bucket>/.../file.ext"
    relPaths.add(c.screenshotPath.replace(/^components\//, ""));
    relPaths.add(c.htmlPath.replace(/^components\//, ""));
  }
  return [...relPaths].map((relPath) => ({
    params: { path: relPath },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const relPath = params.path;
  if (!relPath) return new Response("Not found", { status: 404 });

  const filePath = path.join(REPO_ROOT, "components", relPath);

  // Guard against escaping the components/ directory via "..".
  if (!filePath.startsWith(path.join(REPO_ROOT, "components") + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext];
  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const body = readFileSync(filePath);
    return new Response(body, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
