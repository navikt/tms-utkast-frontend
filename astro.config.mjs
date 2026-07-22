import node from "@astrojs/node";
import react from "@astrojs/react";
import mockServer from "@navikt/astro-mocks";
import { defineConfig, envField } from "astro/config";
import utkastMocks from "./mock/utkast.json" with { type: "json" };

// https://astro.build/config
export default defineConfig({
  base: "/minside/utkast",
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/tms-utkast-frontend",
  },
  vite: {
    build: {
      sourcemap: true,
    },
  },
  integrations: [react(), mockServer({ mocks: utkastMocks })],
  logger: {
    entrypoint: "@navikt/astro-logger",
  },
  i18n: {
    defaultLocale: "nb",
    locales: ["nb", "nn", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      UTKAST_API_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:4321/utkast/v2/utkast",
      }),
      MIN_SIDE_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:4321/minside/",
      }),
    },
  },
});
