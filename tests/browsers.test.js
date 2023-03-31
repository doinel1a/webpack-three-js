/* eslint-disable unicorn/prefer-module */
// @ts-check
import _config from '../_config.cjs';

const { test } = require('@playwright/test');

const HOST = _config.server.host;
const PORT = _config.server.port;

test('Test browsers', async ({ page }) => {
  await page.goto(`${HOST}:${PORT}`);
  await page.pause();
});
