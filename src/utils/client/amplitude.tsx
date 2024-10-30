import { type MetricValues } from "@components/utkast/UtkastTypes.ts";

import { init, track } from "@amplitude/analytics-browser";

export const logAmplitudeEvent = (
  skjemaurl: string,
  metrics: MetricValues | null | undefined
) => {
  if (metrics) {
    track("skjema åpnet", { skjemaurl, ...metrics });
  } else {
    track("skjema åpnet", { skjemaurl });
  }
};

const initUtkastClickTracking = () => {
  const utkastWrapper = document.getElementById("utkastWrapper");
  utkastWrapper?.addEventListener("click", (event  ) => {
    const target = (event?.target as HTMLElement).closest("a");
    const targetHref = target!.href;
    logAmplitudeEvent(targetHref, null);
  });
};

export const initAmplitude = () => {
  init("default", undefined, {
    useBatch: true,
    serverUrl: "https://amplitude.nav.no/collect-auto",
    ingestionMetadata: {
      sourceName: window.location.toString(),
    },
  });
  initUtkastClickTracking()
};