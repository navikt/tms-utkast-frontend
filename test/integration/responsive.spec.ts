import { expect, test } from "@playwright/test";
import { UtkastPage } from "./pages/utkast.page";

test.describe("Responsivt design", () => {
  test("viser utkast på mobil viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(utkast.heading).toBeVisible();
    await utkast.expectAtLeastOneUtkast();
  });

  test("viser utkast på desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(utkast.heading).toBeVisible();
    await utkast.expectAtLeastOneUtkast();
  });
});
