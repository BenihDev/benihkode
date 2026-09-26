import { test, expect } from '@playwright/test';

test('SmartStartup project page displays correctly', async ({ page }) => {
  // Visit the SmartStartup project page
  await page.goto('/projects/smartstartup');

  // Verify the page title
  await expect(page).toHaveTitle(/SmartStartup — Projects/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'SmartStartup', level: 1 })).toBeVisible();

  // Verify the description renders
  await expect(page.getByText('boot optimization utility')).toBeVisible();

  // Verify the tech stack badges
  await expect(page.getByText('Avalonia', { exact: true })).toBeVisible();

  // Verify the Privacy Policy link points at the policy page
  const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/projects/smartstartup/privacy-policy');
});
