# tms-utkast-frontend

Astro 7 SSR app that shows a person's started drafts ("utkast") on Min side (`nav.no/minside/utkast`), in nb, nn and en. React 19, Aksel 8 (`--ax-*` tokens), TypeScript 5, pnpm 10, Node 24.

## Commands

- Install: `pnpm install`. The `@navikt` packages need a GitHub token with `read:packages` in `~/.npmrc`; if install fails on auth, stop and ask.
- Dev: `pnpm run dev`, served at `http://localhost:4321/minside/utkast`. `@navikt/astro-mocks` answers the backend call inside it: each entry in `src/mocks/utkast.json` is a route at the origin root, and its `path` must equal the path of the `env.schema` default that fetches it (`/utkast/v2/utkast`).
- Before you say a change is done: `pnpm run verify` (`astro check`, then Vitest). Vitest only runs `test/unit/**/*.test.{ts,tsx}`: put unit tests there, in the folder that mirrors the source file's, and import from `src/` with the `@src/*` alias.
- When a page, visible text or `src/mocks/utkast.json` changed: `pnpm run test:e2e`. The Playwright specs in `test/integration` assert on visible text, the mock data and accessibility (axe). Playwright starts the dev server itself, or reuses one already running on port 4321. Needs `pnpm exec playwright install chromium` once.
- Biome runs in the lefthook pre-commit hook on staged JS, TS, JSON and Astro files (formats, sorts imports, applies safe lint fixes). For CSS, run `pnpm exec biome check --write <file>` yourself. Never run it on `nais/*/nais.yaml` (it rewrites `{{ image }}`) or on the whole repo: `biome check .` is not clean on main.

## Rules

- Use the `astro` skill before editing `.astro`, `.tsx`, `.ts` or `.css` files. If `/astro` or `/commit` is missing, tell the developer to trust this folder in Copilot CLI and start a new session.
- Ask first before changing authentication (`src/middleware.ts`, `@navikt/astro-auth`), TokenX token exchange and its local bypass (`src/shared/utils/token.ts`, `isLocal` in `src/shared/utils/environment.ts`, `Astro.locals.token`), `astro.config.mjs`, `nais/` or `.github/workflows/` (a push to `main` runs `deploy-main.yaml` for dev and prod), or anything that logs personal data, and before adding a dependency.
- A new env value is the exception: add an `env.schema` entry in `astro.config.mjs` with a `default` that works in dev, and a value in both `nais/dev-gcp/nais.yaml` and `nais/prod-gcp/nais.yaml`; a cluster without one silently uses the default. Read it from `astro:env/server` as the pages do.
- Localized pages are in `src/pages/[locale]/`. A feature is one folder under `src/` (today only `src/utkast/`) with its components, types, text, utils and CSS modules. Features do not import from each other; shared code goes in `src/shared/`.
- New visible text goes in nb, nn and en as `text.key[language]`, in the feature's `<feature>Text.ts` or `src/shared/language/text.ts`. Leave old hardcoded strings alone.
