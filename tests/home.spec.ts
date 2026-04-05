import { test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';

/**
 * E2E login test using Flipkart login page.
 * This uses invalid credentials to keep the test safe.
 */

test.describe('Flipkart home page flow', () => {
  test('Redirect to home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.testHomePageLoads();
  });
});
