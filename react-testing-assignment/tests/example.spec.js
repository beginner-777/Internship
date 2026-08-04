import { test, expect } from '@playwright/test';

test('primary user flow works', async ({ page }) => {
  // 1. App open karein
  await page.goto('http://localhost:5173/');

  // 2. Check karein ke body load ho chuki hai
  await expect(page.locator('body')).toBeVisible();
});