import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * E2E login test using Flipkart login page.
 * This uses invalid credentials to keep the test safe.
 */

test.describe('Flipkart login flow', () => {
  test('Request OTP with invalid user triggers verification unsuccessful error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.testLoginWithInvalidCredentials('9999999999');
  });
});
