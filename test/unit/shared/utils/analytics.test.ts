import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAnalyticsInstance, logger } = vi.hoisted(() => {
  const logger = Object.assign(vi.fn().mockResolvedValue(undefined), {
    custom: vi.fn().mockResolvedValue(undefined),
  });
  return { getAnalyticsInstance: vi.fn(() => logger), logger };
});

vi.mock("@navikt/nav-dekoratoren-moduler", () => ({ getAnalyticsInstance }));

import { logEvent } from "@src/shared/utils/analytics";

describe("logEvent", () => {
  beforeEach(() => {
    logger.mockClear();
    logger.custom.mockClear();
  });

  it("should create the analytics logger with the app as origin", () => {
    expect(getAnalyticsInstance).toHaveBeenCalledWith("tms-utkast-frontend");
  });

  it("should log a typed navigere event with lenketekst, destinasjon and the metric as lenkegruppe", async () => {
    await logEvent("utkast-åpnet", "Søknad om dagpenger", "https://nav.no/utkast/1");

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("navigere", {
      lenketekst: "Søknad om dagpenger",
      destinasjon: "https://nav.no/utkast/1",
      lenkegruppe: "utkast-åpnet",
    });
  });

  it("should not log through logger.custom", async () => {
    await logEvent("utkast-åpnet", "Søknad om dagpenger", "https://nav.no/utkast/1");

    expect(logger.custom).not.toHaveBeenCalled();
  });
});
