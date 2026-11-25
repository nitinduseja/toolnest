import { test, expect } from '@playwright/test';

test.describe('Advanced Toolnest Workflows', () => {
  test('supports workspace split view resizing and ratio persistence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/tools/rest-api-client?split=json-formatter');

    await expect(page.locator('text=SPLIT PANE:')).toBeVisible();
    await expect(page.locator('[data-testid="primary-split-pane"]')).toBeVisible();

    const separator = page.locator('[role="separator"]');
    await expect(separator).toBeVisible();
    await expect(page.locator('text=50% / 50%')).toBeVisible();

    // Apply 70/30 preset
    await page.locator('button', { hasText: '70/30' }).click();
    await expect(page.locator('text=70% / 30%')).toBeVisible();

    // Keyboard resize left by 5% -> 65/35
    await separator.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=65% / 35%')).toBeVisible();

    // Reload and verify ratio persisted
    await page.reload();
    await expect(page.locator('text=65% / 35%')).toBeVisible();

    // Open Workspaces modal
    await page.locator('button', { hasText: 'Workspaces' }).click();
    await expect(page.locator('h2', { hasText: 'Multi-Tool Workspaces' })).toBeVisible();
  });

  test('pins favorites, reorders them on Home and Favorites page, and persists order', async ({
    page,
  }) => {
    await page.goto('/tools');

    await page.locator('button[aria-label="Add JSON Formatter & Validator to favorites"]').click();
    await page.locator('button[aria-label="Add UUID Generator to favorites"]').click();

    await page.goto('/');
    const pinnedSection = page.locator('section[aria-label="Pinned Favorites"]');
    await expect(pinnedSection).toBeVisible();

    const cards = pinnedSection.locator('[data-favorite-id]');
    await expect(cards.nth(0)).toHaveAttribute('data-favorite-id', 'json-formatter');
    await expect(cards.nth(1)).toHaveAttribute('data-favorite-id', 'uuid-generator');

    // Move second card earlier
    await pinnedSection.locator('button[aria-label="Move UUID Generator earlier"]').click();
    await expect(cards.nth(0)).toHaveAttribute('data-favorite-id', 'uuid-generator');
    await expect(cards.nth(1)).toHaveAttribute('data-favorite-id', 'json-formatter');

    // Verify order persists on /favorites
    await page.goto('/favorites');
    const favCards = page.locator('[data-favorite-id]');
    await expect(favCards.nth(0)).toHaveAttribute('data-favorite-id', 'uuid-generator');
    await expect(favCards.nth(1)).toHaveAttribute('data-favorite-id', 'json-formatter');
  });

  test('audits and purges local storage keys in Privacy & Storage Inspector', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('toolnest_favorites', JSON.stringify(['json-formatter']));
      localStorage.setItem('toolnest_split_ratio', '65');
    });

    await page.goto('/settings');
    const dashboard = page.locator('section[aria-label="Local Privacy & Storage Dashboard"]');
    await expect(dashboard).toBeVisible();
    await expect(dashboard.locator('text=0 bytes sent')).toBeVisible();
    await expect(dashboard.locator('text=Pinned Favorites Order')).toBeVisible();

    await dashboard.locator('button[aria-label="Purge Pinned Favorites Order"]').click();
    await expect(dashboard.locator('text=Pinned Favorites Order')).not.toBeVisible();
  });

  test('loads all 4 Batch 3 studio tools cleanly', async ({ page }) => {
    const routes = [
      { path: '/tools/css-animation-builder', heading: 'CSS Keyframes & Animation Builder' },
      { path: '/tools/json-yaml-diff', heading: 'JSON / YAML Structural Diff & Patch' },
      { path: '/tools/meta-tag-preview', heading: 'Open Graph & SEO Meta Tag Studio' },
      { path: '/tools/webhook-tester', heading: 'Webhook Payload Generator & Signer' },
    ];

    for (const r of routes) {
      await page.goto(r.path);
      await expect(page.locator('h1', { hasText: r.heading })).toBeVisible();
    }
  });
});
