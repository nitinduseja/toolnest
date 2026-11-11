import { test, expect } from '@playwright/test';

test.describe('Interactive Tool Workflows', () => {
  test('navigates to SVG Patterns, switches presets, and toggles formats', async ({ page }) => {
    await page.goto('/tools/svg-patterns');
    await expect(
      page.locator('h1', { hasText: 'SVG Pattern & Background Generator' })
    ).toBeVisible();

    const canvas = page.locator('[data-testid="pattern-canvas"]');
    await expect(canvas).toBeVisible();

    // Select preset
    const presetBtn = page.locator('button', { hasText: 'Honeycomb Hive' });
    await presetBtn.click();

    // Select format and verify snippet
    const tailwindBtn = page.locator('button', { hasText: 'TAILWIND' });
    await tailwindBtn.click();
    await expect(page.locator('pre code')).toBeVisible();
  });

  test('navigates to JWT Studio, updates algorithm, and verifies HMAC signature', async ({
    page,
  }) => {
    await page.goto('/tools/jwt-studio');
    await expect(page.locator('h1', { hasText: 'JWT Studio & Signature Debugger' })).toBeVisible();

    // Token breakdown sections visible
    await expect(page.locator('text=HEADER: Algorithm & Type')).toBeVisible();
    await expect(page.locator('text=PAYLOAD: Data Claims')).toBeVisible();

    // Switch algorithm to HS512
    const hs512Btn = page.locator('button', { hasText: 'HS512' });
    await hs512Btn.click();

    // Click quick expiry button
    const expiryBtn = page.locator('button', { hasText: '+24h' });
    await expiryBtn.click();

    // Verify signature status
    await expect(page.locator('text=Signature Verified')).toBeVisible();
  });

  test('navigates to Security Headers, inspects audit score, and switches server snippets', async ({
    page,
  }) => {
    await page.goto('/tools/security-headers');
    await expect(page.locator('h1', { hasText: 'Security Headers & CSP Builder' })).toBeVisible();

    // Check security score
    await expect(page.locator('text=Security Score:')).toBeVisible();

    // Switch to Apache snippet
    const apacheBtn = page.locator('button', { hasText: 'APACHE' });
    await apacheBtn.click();
    await expect(page.locator('pre code')).toContainText('Header');

    // Switch to Netlify snippet
    const netlifyBtn = page.locator('button', { hasText: 'NETLIFY' });
    await netlifyBtn.click();
    await expect(page.locator('pre code')).toContainText('/*');
  });

  test('navigates to Docker Run to Compose and verifies YAML generation', async ({ page }) => {
    await page.goto('/tools/docker-compose-converter');
    await expect(page.locator('h1', { hasText: 'Docker Run to Compose Converter' })).toBeVisible();

    // Verify converted output code contains docker-compose service definition
    await expect(page.locator('pre code')).toContainText('services:');
  });
});
