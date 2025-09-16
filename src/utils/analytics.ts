import type { AmplitudeEvent } from "@navikt/nav-dekoratoren-moduler";
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

type ExtendedAmpltitudeEvent = AmplitudeEvent<"navigere", { kategori: string }>;

const analyticsLogger = getAnalyticsInstance<ExtendedAmpltitudeEvent>(
  "tms-utkast-frontend",
);

export const logEvent = async (metric: string) => {
  await analyticsLogger("navigere", { kategori: metric });
};
