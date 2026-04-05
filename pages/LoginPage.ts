import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly identifierInput: Locator;
  readonly requestOtpButton: Locator;
  readonly errorMessage: Locator;
  readonly closePopupButton: Locator;

  constructor(page: Page) {
    super(page);
    this.identifierInput = page.locator('form:has-text("Enter Email/Mobile number") input[type="text"]');
    this.requestOtpButton = page.locator('form:has-text("Enter Email/Mobile number") button:has-text("Request OTP")');
    this.errorMessage = page.locator('text=/Verification unsuccessful|Maximum attempts reached|Please enter a valid/', { hasText: 'Verification unsuccessful' });
    this.closePopupButton = page.locator('button._2KpZ6l._2doB4z, button._2KpZ6l._2HKlqd._3AWRsL');
  }

  async goto() {
    await this.navigateTo('/account/login');
  }

  async closeLoginPopupIfPresent() {
    await this.closePopupIfPresent(this.closePopupButton);
  }

  async loginWithMobileOrEmail(identifier: string) {
    await this.fillInput(this.identifierInput, identifier);
    await this.clickElement(this.requestOtpButton);
  }

  async expectVerificationError() {
    await this.verifyElementVisibility(this.page.locator('text=Verification unsuccessful'), 15000);
  }

  /**
   * Complete login test scenario with invalid credentials
   * Encapsulates: goto -> close modal -> submit -> assert error
   */
  async testLoginWithInvalidCredentials(identifier: string) {
    await this.goto();
    await this.closeLoginPopupIfPresent();
    await this.loginWithMobileOrEmail(identifier);
    await this.expectVerificationError();
  }
}

