const isProduction = window.location.href.includes("www.intern.nav.no");
const isDevelopment = window.location.href.includes("www.intern.dev.nav.no");

export const getEnvironment = () => {
  if (isDevelopment) {
    return "development";
  }
  if (isProduction) {
    return "production";
  }
  return "local";
};

type EnvUrl = { development: string; production: string; local: string };

const MIN_SIDE_PROXY_URL = {
  local: "http://localhost:3000",
  development: "https://www.intern.dev.nav.no/tms-min-side-proxy",
  production: "https://www.nav.no/tms-min-side-proxy",
};

const BASE_URL: EnvUrl = {
  local: "http://localhost:4321",
  development: "https://www.intern.dev.nav.no/tms-utkast-frontend/",
  production: "https://www.intern.nav.no/tms-utkast-frontend/",
};
export const minSideProxyUrl = MIN_SIDE_PROXY_URL[getEnvironment()];
export const utkastApiUrl = `${minSideProxyUrl}/utkast/v2/utkast`;
export const baseUrl = BASE_URL[getEnvironment()];