import { readFileSync } from "node:fs";
import path from "node:path";

// data/components.json lives at the repo root, one level above this Astro project
// (process.cwd() when running `npm run dev`/`astro build` from viewer/). We read it
// directly instead of copying it into src/content/ so the viewer stays in sync with
// the awesome-components data without a separate import step.
// Note: import.meta.url is NOT used here because `astro build` relocates bundled
// chunks to a different directory depth, which breaks source-relative URL paths.
export const REPO_ROOT = path.resolve(process.cwd(), "..");
const DATA_PATH = path.join(REPO_ROOT, "data", "components.json");

export type RawComponentEntry = {
  bucket: string;
  author: string;
  authorName: string;
  component: string;
  componentName: string;
  variant: string;
  variantName: string;
  path: string;
  promptPath: string;
  htmlPath: string;
  screenshotPath: string;
};

export type ComponentVariant = RawComponentEntry & {
  /** Stable id / URL slug: bucket/author/component/variant */
  slug: string;
  /** Served URL for the screenshot (routed through src/pages/components/[...path].ts) */
  screenshotUrl: string;
  /** Served URL for the rendered HTML snapshot */
  htmlUrl: string;
  /** Text usable for client-side search filtering */
  searchText: string;
};

function toPublicUrl(repoRelativePath: string): string {
  // repoRelativePath looks like "components/<bucket>/.../file.ext"; this is
  // served by the src/pages/components/[...path].ts endpoint (reads the file
  // straight off disk), not a symlinked public/ dir — symlinks don't survive
  // a plain `git clone` on every platform (notably Windows without Developer
  // Mode / core.symlinks), so we avoid depending on one.
  return `/${repoRelativePath}`;
}

let cache: ComponentVariant[] | null = null;

export function getAllComponents(): ComponentVariant[] {
  if (cache) return cache;

  const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8")) as RawComponentEntry[];

  cache = raw.map((entry) => {
    const slug = [entry.bucket, entry.author, entry.component, entry.variant].join("/");
    return {
      ...entry,
      slug,
      screenshotUrl: toPublicUrl(entry.screenshotPath),
      htmlUrl: toPublicUrl(entry.htmlPath),
      searchText: [
        entry.componentName,
        entry.component,
        entry.authorName,
        entry.author,
        entry.variantName,
        entry.variant,
        entry.bucket,
      ]
        .join(" ")
        .toLowerCase(),
    };
  });

  return cache;
}

export function getComponentBySlug(slug: string): ComponentVariant | undefined {
  return getAllComponents().find((c) => c.slug === slug);
}

export function getBuckets(): string[] {
  const buckets = new Set(getAllComponents().map((c) => c.bucket));
  return [...buckets].sort();
}

/** Reads prompt.md content for a variant, relative to the repo root. */
export function getPromptText(component: ComponentVariant): string {
  const promptPath = path.join(REPO_ROOT, component.promptPath);
  try {
    return readFileSync(promptPath, "utf-8");
  } catch {
    return "";
  }
}

const GITHUB_REPO = "CD-Chief/wundercorp-viewer";

export function getGithubReadmeUrl(component: ComponentVariant): string {
  return `https://github.com/${GITHUB_REPO}/blob/main/${component.path}`;
}
