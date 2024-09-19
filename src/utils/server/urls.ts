const isDevelopment = process.env.NAIS_CLUSTER_NAME === "dev-gcp";
export const isLocal = process.env.NODE_ENV === "development";

export const getEnvironment = () => {
  if (isDevelopment) {
    return "development";
  }

  if (isLocal) {
    return "local";
  }

  return "production";
};


type EnvUrl = { development: string; production: string; local: string };

const UTKAST_API_URL = {
  local: "http://localhost:3000/utkast/v2/utkast",
  development: "http://tms-utkast/v2/utkast",
  production: "http://tms-utkast/v2/utkast",
};

const BASE_URL: EnvUrl = {
  local: "http://localhost:4321/minside",
  development: "https://www.ansatt.dev.nav.no/minside/",
  production: "https://www.nav.no/minside/",
};

export const utkastApiUrl = UTKAST_API_URL[getEnvironment()];
export const baseUrl = BASE_URL[getEnvironment()];