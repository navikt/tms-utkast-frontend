const isProduction = process.env.NAIS_CLUSTER_NAME === "prod-gcp";
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

export const getDecoratorEnvironment = () => (isProduction ? "prod" : "dev");
