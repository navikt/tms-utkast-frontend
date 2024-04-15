import { getEnvironment } from "@src/urls";

const REDIRECT_URI = {
  development: "https://www.intern.dev.nav.no/utkast",
  production: "https://www.nav.no/utkast",
};

export const redirectUri = REDIRECT_URI[getEnvironment()];
export const loginUrl = `/utkast/oauth2/login?redirect=${redirectUri}`;
