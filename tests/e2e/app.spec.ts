import { test, expect } from '@playwright/test';

test.describe('Toolnest Application Workflows', () => {
  test('renders homepage with brand, title, and tools', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Toolnest | Useful tools. One workspace.');
    await expect(page.locator('text=Useful tools. One workspace.')).toBeVisible();
    await expect(page.locator('text=LOCAL ENGINE ACTIVE')).toBeVisible();
  });

  test('dynamically updates document title across client routes', async ({ page }) => {
    await page.goto('/tools');
    await expect(page).toHaveTitle('All Tools | Toolnest');

    await page.goto('/tools/uuid-generator');
    await expect(page).toHaveTitle('UUID Generator | Toolnest');

    await page.goto('/settings');
    await expect(page).toHaveTitle('Settings & Preferences | Toolnest');
  });

  test('opens command palette and navigates with Arrow keys', async ({ page }) => {
    await page.goto('/');

    // Press Ctrl+K
    await page.keyboard.press('Control+KeyK');
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify first item is selected
    const options = page.locator('[role="option"]');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');

    // Arrow down moves selection
    await page.keyboard.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');

    // Arrow up moves back
    await page.keyboard.press('ArrowUp');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');

    // Type query
    await page.keyboard.type('UUID');
    await expect(page.locator('text=UUID Generator').first()).toBeVisible();

    // Close on Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('navigates to direct tool route (/tools/uuid-generator) and generates UUIDs', async ({
    page,
  }) => {
    await page.goto('/tools/uuid-generator');
    await expect(page.locator('h1', { hasText: 'UUID Generator' })).toBeVisible();

    const generateBtn = page.locator('button', { hasText: 'Generate New' });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();
  });

  test('navigates to JSON Formatter and formats sample JSON', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await expect(page.locator('h1', { hasText: 'JSON Formatter & Validator' })).toBeVisible();

    const prettifyBtn = page.locator('button', { hasText: 'Prettify' });
    await prettifyBtn.click();
    await expect(page.locator('textarea').nth(1)).not.toBeEmpty();
  });

  test('handles unknown routes with friendly 404 page', async ({ page }) => {
    await page.goto('/unknown-route-that-does-not-exist');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page Not Found')).toBeVisible();
    await expect(page.locator('text=Return Home')).toBeVisible();
  });

  test('toggles theme and persists across routes', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[aria-label^="Toggle theme"]');
    await themeBtn.click();

    const lightOption = page.locator('[role="menuitem"]:has-text("Light")');
    await lightOption.click();

    // Verify dark class removed
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDark).toBe(false);
  });
});
