import { test, expect } from '@playwright/test';

test('About page displays correctly', async ({ page }) => {
  // Visit the about page
  await page.goto('/about');

  // Verify the page title
  await expect(page).toHaveTitle(/About — BenihKode/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'The Story Behind BenihKode', level: 1 })).toBeVisible();

  // Verify subheadings
  await expect(page.getByRole('heading', { name: "What You'll Find Here", level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Philosophy', level: 2 })).toBeVisible();

  // Verify links
  const astroLink = page.getByRole('link', { name: 'Astro' });
  await expect(astroLink).toBeVisible();
  await expect(astroLink).toHaveAttribute('href', 'https://astro.build');

  const cloudflareLink = page.getByRole('link', { name: 'Cloudflare' });
  await expect(cloudflareLink).toBeVisible();
  await expect(cloudflareLink).toHaveAttribute('href', 'https://www.cloudflare.com');
});
