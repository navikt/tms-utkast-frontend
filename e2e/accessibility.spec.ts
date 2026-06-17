import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { UtkastPage } from "./pages/utkast.page";

test.describe("Tilgjengelighet (a11y)", () => {
  test("forsiden har ingen WCAG-brudd", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();
    await utkast.expectAtLeastOneUtkast();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("feilsiden har ingen WCAG-brudd", async ({ page }) => {
    await page.goto("/minside/utkast/nb/error");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
