import { expect, Locator, Page } from '@playwright/test';

/**
 * BasePage: Base class for all page objects
 * Contains common methods and properties used across all pages
 * Reduces code duplication and centralizes page interactions
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL relative to baseURL
   * @param path - Path relative to baseURL (e.g., '/', '/account/login')
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a locator to be visible
   * @param locator - The locator to wait for
   * @param timeout - Custom timeout in ms (default 15000)
   */
  async waitForLocator(locator: Locator, timeout: number = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Fill an input field
   * @param locator - The input field locator
   * @param value - Value to fill
   */
  async fillInput(locator: Locator, value: string) {
    await this.waitForLocator(locator);
    await locator.fill(value);
  }

  /**
   * Click a button/element
   * @param locator - The element to click
   */
  async clickElement(locator: Locator) {
    await this.waitForLocator(locator);
    await locator.click();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Assert page URL matches pattern
   * @param urlPattern - Regex pattern to match
   */
  async verifyURL(urlPattern: RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * Assert element is visible
   * @param locator - Element to check
   * @param timeout - Custom timeout
   */
  async verifyElementVisibility(locator: Locator, timeout: number = 5000) {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Close any popup/modal if present
   * @param closeButtonLocator - Locator for close button
   */
  async closePopupIfPresent(closeButtonLocator: Locator) {
    if (await closeButtonLocator.count() > 0) {
      await closeButtonLocator.click();
    }
  }

  /**
   * Take screenshot
   * @param filename - Name for screenshot file
   */
  async takeScreenshot(filename: string) {
    await this.page.screenshot({ path: `./test-results/${filename}.png` });
  }
}
