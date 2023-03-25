/* eslint-disable unicorn/prefer-module */
// @ts-check
const { test } = require('@playwright/test');

const HOST = 'http://localhost';
const PORT = 3000;

test('Test browsers', async ({ page }) => {
  await page.goto(`${HOST}:${PORT}`);
  await page.pause();
});
