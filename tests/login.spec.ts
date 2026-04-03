import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * E2E login test using Flipkart login page.
 * This uses invalid credentials to keep the test safe.
 */

test.describe('Flipkart login flow', () => {
  test('Request OTP with invalid user triggers verification unsuccessful error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. navigate to login page
    await loginPage.goto();

    // 2. close potential modal/pop-up for first visit
    await loginPage.closeLoginPopupIfPresent();

    // 3. submit unregistered mobile/email to request OTP
    await loginPage.loginWithMobileOrEmail('9999999999');

    // 4. assert verification error state appears
    await loginPage.expectVerificationError();
  });
});
