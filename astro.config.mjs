import node from "@astrojs/node";
import react from "@astrojs/react";
import mockServer from "@navikt/astro-mocks";
import navBrowserTargets, { targets } from "@navikt/browserslist-config/vite";
import { defineConfig, envField } from "astro/config";
import utkast from "./src/mocks/utkast.json" with { type: "json" };

// Astro hardcodes `build.target: "esnext"` for its build environments, so the
// fill-if-unset plugin from @navikt/browserslist-config can't apply there.
// Overwrite (not merge — Vite concatenates arrays) explicitly:
// - client: JS shipped to browsers.
// - ssr/prerender: Astro emits page CSS from the server builds, so their
//   `cssTarget` governs the CSS in dist/client. Server JS stays `esnext`.
const navBuildTargets = {
  name: "nav-build-targets",
  configEnvironment(name, config) {
    config.build ??= {};
    if (name === "client") {
      config.build.target = [...targets];
    } else if (name === "ssr" || name === "prerender") {
      config.build.cssTarget = [...targets];
    }
  },
};

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
    plugins: [navBrowserTargets(), navBuildTargets],
  },
  integrations: [react(), mockServer({ mocks: utkast })],
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
