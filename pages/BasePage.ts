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

  // ======================== WAIT METHODS ========================

  /**
   * Wait for page to load
   * @param state - 'load' | 'domcontentloaded' | 'networkidle'
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for element to be stable (not moving/animating)
   * @param locator - Element to wait for
   */
  async waitForElementStable(locator: Locator) {
    await locator.evaluate(el => {
      return new Promise(resolve => {
        const observer = new MutationObserver(() => {
          clearTimeout(timeout);
          timeout = setTimeout(resolve, 500);
        });
        observer.observe(el, { attributes: true, childList: true, subtree: true });
        setTimeout(resolve, 500);
      });
    });
  }

  /**
   * Wait for function/condition to be true
   * @param condition - Function that returns boolean
   * @param timeout - Max wait time in ms
   */
  async waitForCondition(condition: () => Promise<boolean>, timeout: number = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) return;
      await this.page.waitForTimeout(100);
    }
    throw new Error('Timeout waiting for condition');
  }

  /**
   * Wait for specific text to appear on page
   * @param text - Text to wait for
   * @param timeout - Custom timeout
   */
  async waitForText(text: string, timeout: number = 10000) {
    await this.page.locator(`text=${text}`).waitFor({ timeout });
  }

  // ======================== CLICK/SELECT METHODS ========================

  /**
   * Select option from dropdown by value
   * @param selectLocator - Select element locator
   * @param value - Option value
   */
  async selectDropdown(selectLocator: Locator, value: string) {
    await selectLocator.selectOption(value);
  }

  /**
   * Select option from dropdown by label
   * @param selectLocator - Select element locator
   * @param label - Option label text
   */
  async selectDropdownByLabel(selectLocator: Locator, label: string) {
    await selectLocator.selectOption({ label });
  }

  /**
   * Check a checkbox
   * @param checkboxLocator - Checkbox locator
   */
  async checkCheckbox(checkboxLocator: Locator) {
    await checkboxLocator.check();
  }

  /**
   * Uncheck a checkbox
   * @param checkboxLocator - Checkbox locator
   */
  async uncheckCheckbox(checkboxLocator: Locator) {
    await checkboxLocator.uncheck();
  }

  /**
   * Select radio button
   * @param radioLocator - Radio button locator
   */
  async selectRadioButton(radioLocator: Locator) {
    await radioLocator.click();
  }

  /**
   * Double click element
   * @param locator - Element to double click
   */
  async doubleClickElement(locator: Locator) {
    await locator.dblclick();
  }

  /**
   * Right click element
   * @param locator - Element to right click
   */
  async rightClickElement(locator: Locator) {
    await locator.click({ button: 'right' });
  }

  /**
   * Hover over element
   * @param locator - Element to hover
   */
  async hoverElement(locator: Locator) {
    await locator.hover();
  }

  /**
   * Focus on element
   * @param locator - Element to focus
   */
  async focusElement(locator: Locator) {
    await locator.focus();
  }

  // ======================== KEYBOARD METHODS ========================

  /**
   * Press specific key
   * @param key - Key name (e.g., 'Enter', 'Tab', 'Escape')
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text character by character
   * @param text - Text to type
   * @param delay - Delay between characters in ms
   */
  async typeText(text: string, delay: number = 50) {
    await this.page.keyboard.type(text, { delay });
  }

  /**
   * Press multiple keys with modifiers
   * @param combination - Key combination (e.g., 'Control+A', 'Meta+V')
   */
  async pressKeyCombo(combination: string) {
    await this.page.keyboard.press(combination);
  }

  /**
   * Clear input field
   * @param locator - Input field to clear
   */
  async clearInput(locator: Locator) {
    await locator.clear();
  }

  /**
   * Clear and fill input with new value
   * @param locator - Input field
   * @param value - New value
   */
  async clearAndFill(locator: Locator, value: string) {
    await this.clearInput(locator);
    await this.fillInput(locator, value);
  }

  // ======================== TEXT/CONTENT METHODS ========================

  /**
   * Get element text
   * @param locator - Element to get text from
   */
  async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Get element HTML
   * @param locator - Element to get HTML from
   */
  async getElementHTML(locator: Locator): Promise<string> {
    return await locator.innerHTML() || '';
  }

  /**
   * Get attribute value
   * @param locator - Element
   * @param attributeName - Attribute name
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * Get all text content from page
   */
  async getAllPageText(): Promise<string> {
    return await this.page.textContent() || '';
  }

  /**
   * Search for text in page
   * @param text - Text to search
   */
  async isTextPresent(text: string): Promise<boolean> {
    return (await this.getAllPageText()).includes(text);
  }

  // ======================== ELEMENT STATE METHODS ========================

  /**
   * Check if element is visible
   * @param locator - Element to check
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - Element to check
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check if element is disabled
   * @param locator - Element to check
   */
  async isElementDisabled(locator: Locator): Promise<boolean> {
    return !(await this.isElementEnabled(locator));
  }

  /**
   * Check if checkbox/radio is checked
   * @param locator - Element to check
   */
  async isElementChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Check if element exists on page
   * @param locator - Element to check
   */
  async elementExists(locator: Locator): Promise<boolean> {
    return (await locator.count()) > 0;
  }

  /**
   * Get count of elements matching locator
   * @param locator - Elements to count
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // ======================== SCROLLING METHODS ========================

  /**
   * Scroll page to top
   */
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll page to bottom
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll element into view
   * @param locator - Element to scroll to
   */
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll page by pixels
   * @param x - Horizontal pixels
   * @param y - Vertical pixels
   */
  async scrollByPixels(x: number, y: number) {
    await this.page.evaluate(([px, py]) => window.scrollBy(px, py), [x, y]);
  }

  // ======================== NAVIGATION METHODS ========================

  /**
   * Go back to previous page
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward to next page
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Reload current page
   */
  async reloadPage() {
    await this.page.reload();
  }

  /**
   * Navigate to full URL
   * @param url - Full URL
   */
  async navigateToURL(url: string) {
    await this.page.goto(url);
  }

  // ======================== ASSERTION METHODS ========================

  /**
   * Assert element contains specific text
   * @param locator - Element to check
   * @param text - Expected text
   */
  async verifyElementContainsText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert element has exact text
   * @param locator - Element to check
   * @param text - Expected text
   */
  async verifyElementHasText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }

  /**
   * Assert element is disabled
   * @param locator - Element to check
   */
  async verifyElementDisabled(locator: Locator) {
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert element is enabled
   * @param locator - Element to check
   */
  async verifyElementEnabled(locator: Locator) {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert element is checked
   * @param locator - Element to check
   */
  async verifyElementChecked(locator: Locator) {
    await expect(locator).toBeChecked();
  }

  /**
   * Assert element is hidden
   * @param locator - Element to check
   */
  async verifyElementHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  /**
   * Assert page title
   * @param title - Expected title
   */
  async verifyPageTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Assert page has specific number of elements
   * @param locator - Elements to count
   * @param count - Expected count
   */
  async verifyElementCount(locator: Locator, count: number) {
    await expect(locator).toHaveCount(count);
  }

  // ======================== FORM METHODS ========================

  /**
   * Fill entire form with data object
   * @param formData - Object with selector: value pairs
   */
  async fillForm(formData: { [selector: string]: string }) {
    for (const [selector, value] of Object.entries(formData)) {
      const locator = this.page.locator(selector);
      await this.fillInput(locator, value);
    }
  }

  /**
   * Submit form
   * @param formLocator - Form element
   */
  async submitForm(formLocator: Locator) {
    await formLocator.evaluate(form => (form as HTMLFormElement).submit());
  }

  // ======================== ALERT METHODS ========================

  /**
   * Accept alert
   */
  async acceptAlert() {
    this.page.once('dialog', dialog => dialog.accept());
  }

  /**
   * Dismiss alert
   */
  async dismissAlert() {
    this.page.once('dialog', dialog => dialog.dismiss());
  }

  /**
   * Get alert message
   */
  async getAlertMessage(): Promise<string> {
    return new Promise(resolve => {
      this.page.once('dialog', dialog => {
        resolve(dialog.message());
        dialog.dismiss();
      });
    });
  }

  // ======================== DATA RETRIEVAL METHODS ========================

  /**
   * Get all values from select dropdown
   * @param selectLocator - Select element
   */
  async getAllSelectOptions(selectLocator: Locator): Promise<string[]> {
    return await selectLocator.locator('option').allTextContents();
  }

  /**
   * Get table data
   * @param tableLocator - Table element
   */
  async getTableData(tableLocator: Locator): Promise<string[][]> {
    const rows = await tableLocator.locator('tr').all();
    const data: string[][] = [];
    for (const row of rows) {
      const cells = await row.locator('td, th').allTextContents();
      data.push(cells);
    }
    return data;
  }

  /**
   * Get list of items
   * @param listItemLocator - List item element locator
   */
  async getListItems(listItemLocator: Locator): Promise<string[]> {
    return await listItemLocator.allTextContents();
  }

  // ======================== STORAGE METHODS ========================

  /**
   * Get local storage value
   * @param key - Storage key
   */
  async getLocalStorage(key: string): Promise<string | null> {
    return await this.page.evaluate(k => localStorage.getItem(k), key);
  }

  /**
   * Set local storage value
   * @param key - Storage key
   * @param value - Storage value
   */
  async setLocalStorage(key: string, value: string) {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Get session storage value
   * @param key - Storage key
   */
  async getSessionStorage(key: string): Promise<string | null> {
    return await this.page.evaluate(k => sessionStorage.getItem(k), key);
  }

  /**
   * Set session storage value
   * @param key - Storage key
   * @param value - Storage value
   */
  async setSessionStorage(key: string, value: string) {
    await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value]);
  }

  // ======================== COOKIE METHODS ========================

  /**
   * Get cookie by name
   * @param name - Cookie name
   */
  async getCookie(name: string) {
    const cookies = await this.page.context().cookies();
    return cookies.find(c => c.name === name);
  }

  /**
   * Set cookie
   * @param name - Cookie name
   * @param value - Cookie value
   */
  async setCookie(name: string, value: string) {
    await this.page.context().addCookies([{
      name,
      value,
      url: await this.getCurrentURL(),
    }]);
  }

  /**
   * Delete cookie
   * @param name - Cookie name
   */
  async deleteCookie(name: string) {
    const cookies = await this.page.context().cookies();
    const cookie = cookies.find(c => c.name === name);
    if (cookie) {
      await this.page.context().clearCookies({ name });
    }
  }

  /**
   * Clear all cookies
   */
  async clearAllCookies() {
    await this.page.context().clearCookies();
  }

  // ======================== NETWORK METHODS ========================

  /**
   * Wait for network response with status code
   * @param urlPattern - URL pattern to match
   * @param statusCode - Expected status code
   */
  async waitForResponse(urlPattern: string | RegExp, statusCode: number = 200) {
    return await this.page.waitForResponse(response => {
      const matches = typeof urlPattern === 'string' 
        ? response.url().includes(urlPattern) 
        : response.url().match(urlPattern);
      return matches && response.status() === statusCode;
    });
  }

  /**
   * Intercept and mock network request
   * @param urlPattern - URL pattern to match
   * @param responseBody - Mock response body
   */
  async mockNetworkRequest(urlPattern: string | RegExp, responseBody: any) {
    await this.page.route(urlPattern, route => {
      route.abort();
    });
  }
}
