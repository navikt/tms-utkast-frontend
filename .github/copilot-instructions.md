# Copilot instructions for `navikt/tms-utkast-frontend`

## What this repository is
- Astro 5 SSR frontend for showing a user’s draft applications (`utkast`).
- App is served on `/minside/utkast` (see `astro.config.mjs`).
- Runtime is Node 24, deployed on NAIS (`nais/dev-gcp/nais.yaml`, `nais/prod-gcp/nais.yaml`).

## Tech stack and conventions
- Framework: Astro (`.astro` pages/components) + React islands (`.tsx`).
- Language: TypeScript with strict Astro config (`tsconfig.json`).
- Formatting/linting: Biome (`biome.json`) with 2-space indentation and semicolons.
- Package manager: `pnpm` (CI uses pnpm 10).
- Path alias: `@src/*` -> `src/*`.

## Key folders/files
- `src/pages/[locale]/index.astro`: localized main page.
- `src/components/utkast/Utkast.astro`: fetches and renders drafts.
- `src/middleware/index.ts`: auth/token handling and login redirect.
- `src/pages/api/internal/*`: liveness/readiness endpoints.
- `mock/server.ts`: local mock API (`/utkast/v2/utkast`).
- `.github/workflows/*.yaml`: build/deploy pipelines.

## Local development flow
1. Ensure Node 24 and pnpm 10 are available.
2. Install deps: `pnpm install`
3. Start mock API: `pnpm run mock`
4. Start app: `pnpm run dev`
5. Open app on local Astro URL (default `http://localhost:4321/minside/utkast/nb`).

Important runtime behavior:
- In development (`NODE_ENV=development`), middleware skips auth checks (`isLocal`), so local dev works without real token validation.
- Server env vars are defined in `astro.config.mjs` with local defaults:
  - `UTKAST_API_URL`
  - `MIN_SIDE_URL`
  - `REDIRECT_URI`

## Build/lint/test expectations for agents
- Build: `pnpm run build` (runs `astro check && astro build`).
- Lint/format check: `pnpm exec biome check .`
- There is currently no dedicated test script in `package.json`.

When making code changes:
- Keep edits minimal and scoped.
- Follow existing Astro + React component patterns.
- Prefer existing utilities (`src/utils/*`) over new abstractions.
- Validate with Biome + build before finalizing when dependencies can be installed.

## Errors encountered during onboarding and workarounds
1. **`pnpm: command not found`**
   - Workaround used: `corepack enable && corepack prepare pnpm@10 --activate`

2. **`ERR_PNPM_FETCH_401` from `npm.pkg.github.com` during `pnpm install`**
   - Cause: lockfile resolves some `@navikt/*` packages to GitHub Packages tarballs requiring auth.
   - Workaround: provide `NODE_AUTH_TOKEN` with access to `npm.pkg.github.com` (CI uses `secrets.READER_TOKEN`).
   - Notes: setting `@navikt:registry=https://registry.npmjs.org` alone did not bypass the lockfile tarball URLs in this repository.
