import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

/**
 * E2E combined test: Login flow followed by Home page flow
 * Tests the complete user journey by calling page object scenario methods
 */

test.describe.serial('Flipkart Complete E2E Flow', () => {
  test('Step 1: Login with invalid credentials should show verification error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.testLoginWithInvalidCredentials('9999999999');
  });

  test('Step 2: Navigate to home page after login attempt', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.testHomePageLoads();
  });

  test('Step 3: Verify complete flow from login to home', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // Step 1: Attempt login
    await loginPage.testLoginWithInvalidCredentials('9999999999');

    // Step 2: Navigate to home
    await homePage.testHomePageLoads();
  });
});
