# Awesome Components

A searchable component prompt directory for BuilderStudio.

Use this repository to find component references, screenshots, rendered HTML snapshots, and ready-to-run prompts for building components in the BuilderStudio Agentic IDE.

This library will contain over 6,000 components.

## Build with BuilderStudio

Open [BuilderStudio](https://builderstudio.dev), pick a component prompt from this repository, and ask the agent to build it inside your project.

Join the community:

- [Discord](https://discord.gg/QdWeSGCqfe)
- [Reddit](https://reddit.com/r/builderstudio)

## Browse the directory

Start here:

- [Component directory](components/README.md)
- [Component metadata JSON](data/components.json)


## Find a component from the terminal

Run the interactive finder from the repository root:

```bash
npm run find
```

Then describe what you are looking for in normal language:

```text
What are you trying to find? help me find a login component
Must include any words? Press enter to skip.
Exclude any words? Press enter to skip.
How many results? Press enter for 10.
```

You can also start with a search phrase directly:

```bash
npm run find -- "help me find a login component"
```

The finder ranks matching components from `data/components.json`. If that metadata file is missing, it falls back to scanning `components/**/prompt.md`, `README.md`, `rendered.html`, and `screenshot.png`.

After results are shown, use these prompt commands:

```text
1        show details for result 1
p 1      print the prompt.md for result 1 when it exists locally
o 1      open the prompt.md for result 1 in $EDITOR or $VISUAL
r        refine the search
q        quit
```

## Browse visually (component gallery viewer)

This fork adds a local Astro app in [`viewer/`](viewer/) for browsing the component
library as a searchable, visual gallery instead of the terminal finder above.

```bash
cd viewer
npm install
npm run dev
```

Then open the printed local URL. The gallery shows a screenshot grid with
instant client-side search (by name/author/bucket); clicking a card opens a
detail view with the rendered HTML in a sandboxed iframe and the raw
`prompt.md` (with a "Copy prompt" button) for pasting into any AI coding tool.

**Architecture note:** the `viewer/` app does not copy `components/` or
`data/` into itself. It reads `data/components.json` directly from the repo
root at build/request time (`viewer/src/lib/components.ts`), and screenshots
and `rendered.html` snapshots are served straight off disk from the
repo-root `components/` directory via a small endpoint
(`viewer/src/pages/components/[...path].ts`) rather than a symlink, so it
works the same on every OS regardless of `git clone` symlink support. This
means the viewer always reflects the current state of `components/` and
`data/components.json` with no separate sync/import step — just `git pull`
and refresh.

This viewer is a personal/local dev tool: no auth, no deployment, no writes
back to this repository. It only reads, and it's meant to run via
`npm run dev`.

## Repository structure

```text
components/
  <bucket>/
    README.md
    <author>/
      README.md
      <component>/
        <variant>/
          README.md
          prompt.md
          rendered.html
          screenshot.png
data/
  components.json
scripts/
  find-component.mjs
  import-generated-components.mjs
  validate-directory.mjs
viewer/
  # local Astro gallery app, see "Browse visually" above
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting new components.
