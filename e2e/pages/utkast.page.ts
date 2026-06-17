import { expect, type Locator, type Page } from "@playwright/test";
import type { Language } from "../../src/language/language";

const BASE_PATH = "/minside/utkast";

export class UtkastPage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;
  readonly utkastList: Locator;

  constructor(
    private readonly page: Page,
    private readonly language: Language = "nb",
  ) {
    this.heading = page.getByRole("heading", { level: 1 });
    this.breadcrumb = page.getByRole("navigation");
    this.utkastList = page.getByRole("list").first();
  }

  async goto() {
    await this.page.goto(`${BASE_PATH}/${this.language}`);
    await expect(this.heading).toBeVisible();
  }

  utkastLinks(): Locator {
    return this.page.getByRole("link", { name: /søknad om/i });
  }

  utkastLinkByTitle(title: string): Locator {
    return this.page.getByRole("link", { name: title }).first();
  }

  async expectAtLeastOneUtkast() {
    await expect(this.utkastLinks().first()).toBeVisible({ timeout: 20_000 });
  }
}
