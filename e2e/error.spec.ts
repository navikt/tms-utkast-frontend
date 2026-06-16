import { expect, test } from "@playwright/test";

test.describe("Feilsiden", () => {
  test("viser en feiloverskrift", async ({ page }) => {
    await page.goto("/minside/utkast/nb/error");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
