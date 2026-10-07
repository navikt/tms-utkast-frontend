import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

const analyticsLogger = getAnalyticsInstance("tms-utkast-frontend");

export const logEvent = async (metric: string, lenketekst: string, destinasjon: string) => {
  await analyticsLogger("navigere", { lenketekst, destinasjon, lenkegruppe: metric });
};
