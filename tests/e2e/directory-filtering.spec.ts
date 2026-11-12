import { test, expect } from '@playwright/test';

test.describe('All Tools Directory & Filtering', () => {
  test('renders tools directory with dynamic count badges', async ({ page }) => {
    await page.goto('/tools');
    await expect(page).toHaveTitle('All Tools | Toolnest');
    await expect(page.locator('h1', { hasText: 'Explore Tools' })).toBeVisible();

    const allToolsBtn = page.locator('button', { hasText: 'All Tools (' });
    await expect(allToolsBtn).toBeVisible();
    await expect(allToolsBtn).toContainText('54');
  });

  test('filters tools by feature pills and displays New badges', async ({ page }) => {
    await page.goto('/tools');

    // Filter by New in v2.8
    const newFilterBtn = page.locator('button', { hasText: 'New in v2.8' });
    await newFilterBtn.click();

    // Verify New badge is visible
    const newBadge = page.locator('span', { hasText: 'New' }).first();
    await expect(newBadge).toBeVisible();

    // Filter by Offline Ready
    const offlineFilterBtn = page.locator('button', {
      hasText: 'Offline Ready',
    });
    await offlineFilterBtn.click();
    await expect(page.locator('a[href="/tools/uuid-generator"]').first()).toBeVisible();
  });

  test('searches tools by query parameter and clears query cleanly', async ({ page }) => {
    await page.goto('/tools?q=JWT');

    // Verify matching tools rendered and query pill is visible
    await expect(page.locator('text=JWT Studio').first()).toBeVisible();
    await expect(page.locator('text=Query:').first()).toBeVisible();

    // Clear search using the query filter clear button
    const clearBtn = page.locator('button[aria-label="Clear query filter"]');
    await clearBtn.click();
    await expect(page.locator('a[href="/tools/uuid-generator"]').first()).toBeVisible();
  });
});
