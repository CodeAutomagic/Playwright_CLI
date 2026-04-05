import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly flipkartLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.flipkartLogo = page.locator('a._2QV-5S._3F3S45').first(); // Flipkart logo in header
  }

  async goto() {
    await this.navigateTo('/');
  }

  async moveToMainPage() {
    await this.goto();
    await this.verifyURL(/flipkart\.com\//);
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

