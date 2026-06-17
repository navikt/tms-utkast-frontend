import { expect, test } from "@playwright/test";
import { UtkastPage } from "./pages/utkast.page";

test.describe("Utkast-forsiden", () => {
  test("viser hovedoverskrift", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(utkast.heading).toHaveText("Utkast");
  });

  test("viser brødsmulesti til Min side", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(
      utkast.breadcrumb.getByRole("link", { name: "Min side" }),
    ).toBeVisible();
  });

  test("viser ingressteksten", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(
      page.getByText(
        "Her kan du fortsette på skjemaer du ikke har sendt til oss ennå",
      ),
    ).toBeVisible();
  });

  test("viser utkast fra api-et", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();

    await expect(
      utkast.utkastLinkByTitle("Søknad om dagpenger, permittert"),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("viser opprettet-dato og slette-tag på et utkast", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();
    await utkast.expectAtLeastOneUtkast();

    await expect(
      page.getByText(/Du startet på utkastet\s+23\.03\.2020/).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/Utkastet slettes\s+23\.04\.2020/).first(),
    ).toBeVisible();
  });

  test("hvert utkast lenker videre", async ({ page }) => {
    const utkast = new UtkastPage(page);
    await utkast.goto();
    await utkast.expectAtLeastOneUtkast();

    const firstLink = utkast.utkastLinks().first();
    await expect(firstLink).toHaveAttribute("href", /https?:\/\//);
  });
});

test.describe("Språkstøtte", () => {
  test("viser engelsk innhold på /en", async ({ page }) => {
    const utkast = new UtkastPage(page, "en");
    await utkast.goto();

    await expect(utkast.heading).toHaveText("Drafts");
    await expect(
      page.getByText(
        "Here you can continue with the forms you have not yet submitted to us",
      ),
    ).toBeVisible();
  });
});
