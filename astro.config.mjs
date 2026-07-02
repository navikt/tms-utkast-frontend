import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  base: "/minside/utkast",
  // Astro 7 changed the default to 'jsx', which strips spaces between inline
  // elements. Pin to HTML-aware compression to keep rendered output identical
  // to Astro 6 (no whitespace regressions in user-facing Norwegian copy).
  compressHTML: true,
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/tms-utkast-frontend",
  },
  integrations: [react()],
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
        default: "http://localhost:3000/utkast/v2/utkast",
      }),
      MIN_SIDE_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:4321/minside/",
      }),
      REDIRECT_URI: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000/minside/utkast",
      }),
    },
  },
});
