import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

export const initUtkastClickTracking = () => {
  const logger = getAmplitudeInstance("dekoratoren");
  const utkastWrapper = document.getElementById("utkastWrapper");

  utkastWrapper?.addEventListener("click", (event  ) => {
    const target = (event?.target as HTMLElement).closest("a");
    const skjemaurl = target!.href;
    const { utkastSkjemanavn, utkastSkjemakode } = target?.dataset || {};

    logger("skjema åpnet", { skjemaurl, utkastSkjemanavn, utkastSkjemakode })
        .catch(() => console.warn("Uninitialized amplitude"));
  });
};