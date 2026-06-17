import { expect, test } from "@playwright/test";

test.describe("Feilsiden", () => {
  test("viser en feiloverskrift", async ({ page }) => {
    await page.goto("/minside/utkast/nb/error");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Noe gikk galt!",
    );
  });

  test("viser feilmelding og lenke til Min side", async ({ page }) => {
    await page.goto("/minside/utkast/nb/error");

    await expect(
      page.getByText("Vi har for øyeblikket tekniske problemer", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Min side" })).toBeVisible();
  });
});
