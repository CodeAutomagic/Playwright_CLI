import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly identifierInput: Locator;
  readonly requestOtpButton: Locator;
  readonly errorMessage: Locator;
  readonly closePopupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.identifierInput = page.locator('form:has-text("Enter Email/Mobile number") input[type="text"]');
    this.requestOtpButton = page.locator('form:has-text("Enter Email/Mobile number") button:has-text("Request OTP")');
    this.errorMessage = page.locator('text=/Verification unsuccessful|Maximum attempts reached|Please enter a valid/', { hasText: 'Verification unsuccessful' });
    this.closePopupButton = page.locator('button._2KpZ6l._2doB4z, button._2KpZ6l._2HKlqd._3AWRsL');
  }

  async goto() {
    await this.page.goto('/account/login?ret=/');
    await this.page.waitForLoadState('networkidle');
  }

  async closeLoginPopupIfPresent() {
    if (await this.closePopupButton.count() > 0) {
      await this.closePopupButton.click();
    }
  }

  async loginWithMobileOrEmail(identifier: string) {
    await this.identifierInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.identifierInput.fill(identifier);

    await this.requestOtpButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.requestOtpButton.click();
  }

  async expectVerificationError() {
    await expect(this.page.locator('text=Verification unsuccessful')).toBeVisible({ timeout: 15000 });
  }
}

