# Playwright CLI TypeScript E2E Framework

## Overview

This repository contains a TypeScript-based end-to-end test framework built with Playwright Test.

- Target app: Flipkart login page `https://www.flipkart.com/account/login?ret=/`
- Pattern: Page Object Model (POM)
- CI: GitHub Actions headless Chromium
- Local: headless and headed run in Chrome engine

## Folder structure

- `playwright.config.ts`: Playwright Test configuration (timeout, browsers, artifacts)
- `pages/LoginPage.ts`: Page object for the Flipkart login page, including actions and assertions
- `tests/login.spec.ts`: Test case for invalid login path
- `.github/workflows/playwright.yml`: GitHub Actions pipeline using `npm run test:chromium`
- `README.md`: this document
- `package.json`: scripts and dependency `playwright`

## Install & Setup (local)

```bash
cd /Users/tusharpatil/Documents/Workdpace/Playwright_CLI
npm install
npx playwright install
```

> If `npx playwright` asks about browsers, say yes.

## Run tests locally

- headless: `npm test`
- headed: `npm run test:headed`
- chromium only: `npm run test:chromium`
- debug mode: `npm run test:debug`

## How tests work (detailed)

### Page object (`pages/LoginPage.ts`)

- constructor sets locators
- `goto()` opens Flipkart login URL
- `closeLoginPopupIfPresent()` handles the close button on initial modal
- `loginWithCredentials(email, password)` fills fields and clicks submit
- `expectLoginError()` asserts invalid credential message appears

### Test (`tests/login.spec.ts`)

- uses `test.describe` + `test(...)`
- creates `LoginPage` instance with `page`
- calls `loginPage.goto()`
- optionally closes modal
- submits known invalid credentials
- expects an error message

## GitHub Actions (headless)

Workflow file: `.github/workflows/playwright.yml`

- triggers on push, PR, workflow_dispatch
- sets up Node 20
- installs dependencies (`npm ci`)
- installs Playwright browsers `npx playwright install --with-deps`
- runs `npm run test:chromium` in headless mode
- uploads `playwright-report` as artifact

## Advanced: Chrome headed in local

To run with visible Chrome:

```bash
npx playwright test --headed --project=chromium
```

## Cleanup

Delete old traces/reports:

```bash
rm -rf playwright-report test-results
```

## Notes

- Credentials in test are intentionally invalid. Do not add real passwords.
- If Flipkart layout changes, update selectors in `pages/LoginPage.ts`.

---

### Extra GitHub Action feature (optional)

The action can be extended to run screenshot diff or full matrix by editing `playwright.config.ts` and adding jobs in `.github/workflows/playwright.yml`.
