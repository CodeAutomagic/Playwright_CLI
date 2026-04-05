import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly flipkartLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.flipkartLogo = page.locator('a._2QV-5S._3F3S45').first(); // Flipkart logo in header
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async moveToMainPage() {
    await this.goto();
    await expect(this.page).toHaveURL(/flipkart\.com\//);
  }

  /**
   * Complete home page test scenario
   * Encapsulates: goto -> verify page loaded
   */
  async testHomePageLoads() {
    await this.goto();
    await this.moveToMainPage();
  }
}

