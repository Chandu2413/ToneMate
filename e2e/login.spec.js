import { test, expect } from '@playwright/test';

test('login and navigate to dashboard', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('input[placeholder="Username"]', 'admin');
  await page.fill('input[placeholder="Password"]', 'password');
  await page.click('button:has-text("Login")');

  // expect to navigate to dashboard
  await page.waitForURL('**/admin/dashboard');
  await expect(page.locator('text=Signed in as')).toContainText('admin');
});

test('color match evaluate flow', async ({ page }) => {
  await page.goto('/color-match');
  // pick second dress
  const options = page.locator('[role="option"]');
  await options.nth(1).click();
  // pick top color
  await page.click('input[type="color"]');
  // evaluate
  await page.click('button:has-text("Evaluate Outfit")');

  // wait for AI result
  await expect(page.locator('text=AI Evaluation').first()).toBeVisible();
});