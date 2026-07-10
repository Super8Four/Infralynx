import { expect, test } from '@playwright/test';

test('opens the IPAM dashboard and reaches the API', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Prefixes' })).toBeVisible();
  await expect(
    page.getByText(/infralynx-api 0\.1\.0 is healthy/i),
  ).toBeVisible();
});
