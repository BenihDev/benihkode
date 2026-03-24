import { test, expect } from '@playwright/test';

test('404 page displays correctly', async ({ page }) => {
  // Visit a non-existent URL
  const response = await page.goto('/this-page-does-not-exist');

  // Verify the page title
  await expect(page).toHaveTitle(/404 — Lost in the Garden/);

  // Verify the status code if possible (some SPA or static site generators might not return 404 in dev server, so we check content)
  // await expect(response?.status()).toBe(404);

  // Verify the "4🌱4" element is present
  const errorCodeText = await page.locator('.error-code').textContent();
  expect(errorCodeText?.replace(/\s+/g, '')).toBe('4🌱4');

  // Verify the message "This Seed Hasn't Sprouted Yet" is visible
  await expect(page.getByRole('heading', { name: "This Seed Hasn't Sprouted Yet" })).toBeVisible();

  // Verify the back to home link is present and points to `/`
  const backLink = page.getByRole('link', { name: '← Back to the Garden' });
  await expect(backLink).toBeVisible();
  await expect(backLink).toHaveAttribute('href', '/');
});
