import { expect, test } from "@playwright/test";

test.describe("Utkast-forsiden", () => {
  test("viser hovedoverskrift", async ({ page }) => {
    await page.goto("/minside/utkast/nb");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("viser utkast fra api-et", async ({ page }) => {
    await page.goto("/minside/utkast/nb");

    await expect(
      page
        .getByRole("link", { name: "Søknad om dagpenger, permittert" })
        .first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
