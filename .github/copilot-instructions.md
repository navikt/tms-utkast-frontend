# Copilot instructions — tms-utkast-frontend

Server-rendered Astro app (React/Aksel islands) that shows an innbygger's started drafts ("utkast") on Min side, behind the nav-dekoratør at `/minside/utkast`. Data comes from the `tms-utkast` backend via a TokenX OBO token.

## Commands

Node 24 + pnpm 10. Installing `@navikt/*` packages pulls from GitHub Packages (see `.npmrc`), so `pnpm install` needs `NODE_AUTH_TOKEN` set to a token with `read:packages`.

- `pnpm dev` — dev server at http://localhost:4321/minside/utkast. `@navikt/astro-mocks` serves `src/mocks/utkast.json` as the backend, and auth/token-exchange is skipped in local mode. There is no separate mock command; the mock runs inside `astro dev`.
- `pnpm build` — `astro check` (typecheck) **then** `astro build`. Use this to verify types.
- `pnpm test` — Vitest unit/component tests (jsdom). `pnpm test:watch`, `pnpm test:coverage`.
  - Single file: `pnpm test src/utkast/utkastFetch.test.ts`
  - Single case: `pnpm vitest run -t "should send a bearer authorization header"`
- `pnpm test:e2e` — Playwright (`e2e/`), auto-starts the dev server on 4321. Includes axe-core accessibility checks.
- Lint/format: Biome. `npx @biomejs/biome check --write <paths>`. Husky + lint-staged auto-formats staged files on commit. `lineWidth` is 120 and `organizeImports` is on, so imports get reordered.

CI (`.github/workflows/deploy-main.yaml`) runs `test:coverage` → Playwright e2e → `build` before deploy.

## Architecture

- **Rendering**: `output: "server"` with `@astrojs/node` (standalone). React components are islands — static by default, hydrated with `client:load`. `base` is `/minside/utkast`. The `Utkast` component is a **server island** (`server:defer`) with a `Loader` fallback.
- **i18n routing**: locales `nb` (default), `nn`, `en` with `prefixDefaultLocale: true`. Routable pages live under `src/pages/[locale]/`.
- **Auth & data flow**: `src/middleware.ts` authenticates every request via `@navikt/astro-auth` (ID-porten, validated with `@navikt/oasis`). `getOboToken` (`src/shared/utils/token.ts`) exchanges the user token for an OBO token via TokenX (audience `<NAIS_CLUSTER_NAME>:min-side:tms-utkast`); locally it returns a fake token. Drafts are fetched **server-side** in `Utkast.astro` from `GET /v2/utkast`.
- **Env vars**: declared in `astro.config.mjs` (`UTKAST_API_URL`, `MIN_SIDE_URL`) and read via `import { X } from "astro:env/server"`. `astro:env/server` only works in `.astro` files — read it there and pass values as props into `.ts`/`.tsx`.

## Conventions

- **Vertical slice architecture** (see `.github/skills/vertical-slice-architecture/SKILL.md`). Each feature is a self-contained folder under `src/<feature>/` (e.g. `src/utkast/`) co-locating: the `.astro` component, `<feature>Types.ts`, `<feature>Text.ts`, `<feature>Fetch.ts`/`<feature>Utils.ts`, a co-located `.module.css`, and sub-variants as subfolders (`ingen/` empty state, `fallback/` error, `link-card/`). Only cross-cutting infrastructure goes in `src/shared/` (`assets/`, `language/`, `utils/`, `loader/`, `page-header/`). A feature must not import from another feature — share via `src/shared/`.
- **i18n text**: objects keyed `{ nb, nn, en }`. Feature-specific strings live in the feature's `<feature>Text.ts`; page/shell strings in `src/shared/language/text.ts`.
- **CSS**: co-located CSS Modules (`*.module.css`). Page-level style modules are prefixed with `_` (e.g. `src/pages/[locale]/_index.module.css`) so they aren't treated as routes.
- **Mock backend**: add local endpoints to `src/mocks/utkast.json` as `{ "path": "...", "response": ... }` objects; the path must match what the code requests (e.g. `/utkast/v2/utkast`).
- **UI**: use `@navikt/ds-react` (Aksel) components and `space-`-prefixed spacing tokens — never Tailwind spacing. Details in `.github/instructions/astro-aksel.instructions.md` and `accessibility.instructions.md`.
- Do not log PII (fnr, name, address) in any layer.

## Skills som alltid skal brukes

- **Commits**: Bruk alltid `/conventional-commit`-skillen ved commits og commit-meldinger.
- **Pull requests**: Bruk alltid `/pull-request`-skillen ved oppretting eller oppdatering av pull requests.

## Repo-specific instruction files

These apply automatically by glob and contain the authoritative detail — consult them when touching matching files:
`.github/instructions/astro-aksel.instructions.md`, `accessibility.instructions.md`, `testing.instructions.md`, `testing-typescript.instructions.md`, `github-actions.instructions.md`, `docker.instructions.md`.
