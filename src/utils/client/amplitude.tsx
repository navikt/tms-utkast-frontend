import { type MetricValues } from "@components/utkast/UtkastTypes.ts";

import { init, track } from "@amplitude/analytics-browser";

const initUtkastClickTracking = () => {
  const utkastWrapper = document.getElementById("utkastWrapper");

  utkastWrapper?.addEventListener("click", (event  ) => {
    const target = (event?.target as HTMLElement).closest("a");
    const skjemaurl = target!.href;
    const { utkastSkjemanavn, utkastSkjemakode } = target?.dataset || {};
    track("skjema åpnet", { skjemaurl, utkastSkjemanavn, utkastSkjemakode });
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