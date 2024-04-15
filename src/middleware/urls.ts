import { getEnvironment } from "@src/urls";

const REDIRECT_URI = {
  development: "https://www.intern.dev.nav.no/min-side/utkast",
  production: "https://www.nav.no/min-side/utkast",
};

export const redirectUri = REDIRECT_URI[getEnvironment()];
export const loginUrl = `/min-side/utkast/oauth2/login?redirect=${redirectUri}`;
