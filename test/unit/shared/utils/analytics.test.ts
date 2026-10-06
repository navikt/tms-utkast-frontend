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

  it("should log a navigere event with the metric as kategori through logger.custom", async () => {
    await logEvent("utkast-åpnet");

    expect(logger.custom).toHaveBeenCalledTimes(1);
    expect(logger.custom).toHaveBeenCalledWith("navigere", { kategori: "utkast-åpnet" });
  });

  it("should not log through the typed taxonomy logger", async () => {
    await logEvent("utkast-åpnet");

    expect(logger).not.toHaveBeenCalled();
  });
});
