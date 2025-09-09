const isProduction = window.location.href.includes("www.nav.no");
const isDevelopment = window.location.href.includes("www.ansatt.dev.nav.no");

export const getEnvironment = () => {
  if (isDevelopment) {
    return "development";
  }
  if (isProduction) {
    return "production";
  }
  return "local";
};
