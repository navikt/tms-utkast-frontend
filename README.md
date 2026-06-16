# tms-utkast-frontend

[![Deploy main](https://github.com/navikt/tms-utkast-frontend/actions/workflows/deploy-main.yaml/badge.svg)](https://github.com/navikt/tms-utkast-frontend/actions/workflows/deploy-main.yaml)
![Astro](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

## Formålet med repoet

Dette er frontend-flaten som viser innbyggeres påbegynte utkast på Min side på nav.no. Hovedmålgruppen er innbyggere som er logget inn via ID-porten. Når brukeren åpner utkast-siden, henter appen listen over utkast og presenterer dem som lenkekort, slik at brukeren kan fortsette på en søknad eller et skjema de har startet på. Hvis brukeren ikke har noen utkast, vises en egen tom-tilstand, og ved feil mot backend vises en feilmelding.

Appen er en server-renderet Astro-app med React-øyer, og kjører bak nav-dekoratøren på `/minside/utkast`.

## Arkitektur

```mermaid
flowchart LR
    bruker["Innbygger\n(nettleser)"]
    frontend["tms-utkast-frontend\n(Astro SSR)"]
    backend["tms-utkast\n(backend)"]
    dekorator["nav-dekoratoren"]

    bruker -->|ID-porten-innlogging| frontend
    frontend -->|TokenX OBO-token| backend
    frontend -->|henter header/footer| dekorator
```

Innkommende forespørsler valideres i Astro-middleware (`src/middleware/index.ts`) med `@navikt/oasis`. Mot `tms-utkast` veksles brukerens token til et on-behalf-of-token via TokenX før utkast hentes.

## Miljøer

| Miljø | URL |
|---|---|
| Produksjon | https://www.nav.no/minside/utkast |
| Dev (intern) | https://www.intern.dev.nav.no/minside/utkast |
| Dev (ansatt) | https://www.ansatt.dev.nav.no/minside/utkast |

## Backend-referanse

### [tms-utkast](https://github.com/navikt/tms-utkast)

Leverer innbyggerens påbegynte utkast som vises på Min side.

- **GET** `/v2/utkast`

Kallet gjøres server-side med et TokenX OBO-token (audience `<cluster>:min-side:tms-utkast`).

## Utvikling

Lokalt nås appen på http://localhost:4321/minside/utkast, med en Hono-mockserver som spiller rollen til `tms-utkast`-backenden. I lokal modus hoppes innlogging og token-veksling over.

Tilgjengelige kommandoer (bygg, test, mock og kjøring) finner du med `pnpm run` — det viser den til enhver tid oppdaterte listen over `scripts` i `package.json`. Repoet bruker Node 24 og pnpm.

## For Nav-ansatte

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub. Interne henvendelser kan rettes til [#team-minside på Slack](https://nav-it.slack.com/app_redirect?channel=team-minside).
