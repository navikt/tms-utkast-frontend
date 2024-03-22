import { getEnvironment } from "@src/urls";

const REDIRECT_URI = {
  development: "https://www.intern.dev.nav.no/tms-utkast-frontend",
  production: "https://www.intern.nav.no/tms-utkast-frontend",
};

export const redirectUri = REDIRECT_URI[getEnvironment()];
export const loginUrl = `/tms-utkast-frontend/oauth2/login?redirect=${redirectUri}`;
