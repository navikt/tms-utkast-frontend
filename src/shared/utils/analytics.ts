import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

type NavigereEventData = { kategori: string };

const analyticsLogger = getAnalyticsInstance("tms-utkast-frontend");

export const logEvent = async (metric: string) => {
  const data: NavigereEventData = { kategori: metric };
  await analyticsLogger.custom("navigere", data);
};
