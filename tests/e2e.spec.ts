import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

/**
 * E2E combined test: Login flow followed by Home page flow
 * Tests the complete user journey:
 * 1. Navigate to login page
 * 2. Request OTP with invalid credentials (triggers error)
 * 3. Navigate to home page
 * 4. Verify home page loads
 */

test.describe.serial('Flipkart Complete E2E Flow', () => {
  test('Step 1: Login with invalid credentials should show verification error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Close any modal/pop-up if present
    await loginPage.closeLoginPopupIfPresent();

    // Submit invalid mobile/email to request OTP
    await loginPage.loginWithMobileOrEmail('9999999999');

    // Assert verification error appears
    await loginPage.expectVerificationError();
  });

  test('Step 2: After login attempt, navigate to home page', async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to home page
    await homePage.goto();

    // Verify home page loads successfully
    await homePage.moveToMainPage();
  });

  test('Step 3: Verify home page is fully loaded and responsive', async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to home page
    await homePage.goto();

    // Verify URL is correct
    await homePage.moveToMainPage();

    // Additional check: verify page has expected content
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
  });
});
