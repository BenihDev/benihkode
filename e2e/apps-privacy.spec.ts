import { test, expect } from '@playwright/test';
import { SITE_EMAIL } from '../src/consts';

test('ColorPalette Pro serves the generated privacy policy at /apps/<slug>/privacy', async ({ page }) => {
  // The generated route renders from the App's own document in
  // src/content/app-pages; the template owns the header and contact section
  await page.goto('/apps/colorpalette-pro/privacy');

  await expect(page).toHaveTitle(/Privacy Policy — ColorPalette Pro/);
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  await expect(page.getByText('for ColorPalette Pro')).toBeVisible();

  for (const section of [
    'Introduction',
    'Information Collection and Use',
    'Data Storage',
    'Third-Party Services',
    // The document is markdown, so Astro's smartypants renders the apostrophe
    // typographically (unlike the hand-written .astro pages).
    'Children\u2019s Privacy',
    'Changes to This Privacy Policy',
  ]) {
    await expect(page.getByRole('heading', { name: section, level: 2 })).toBeVisible();
  }

  // Verify the contact link (scoped to main: the site footer repeats it)
  const contact = page.locator('#main-content').getByRole('link', { name: SITE_EMAIL });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', `mailto:${SITE_EMAIL}`);

  // Verify the back link returns to the app landing
  const back = page.getByRole('link', { name: 'Back to ColorPalette Pro' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/colorpalette-pro');
});

test('the ColorPalette Pro landing cross-links its privacy policy', async ({ page }) => {
  await page.goto('/apps/colorpalette-pro');

  const privacyLink = page.locator('#main-content').getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/colorpalette-pro/privacy');

  // Follow the link: the policy page must actually be reachable
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/colorpalette-pro/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
});

test('a hand-written page wins its URL: EchoChess serves its bespoke policy', async ({ page }) => {
  await page.goto('/apps/echochess/privacy');

  // The generated route steps aside when a hand-written page file exists, so
  // exactly one page is published per URL — EchoChess's own, not the template.
  await expect(page).toHaveTitle(/Privacy Policy — EchoChess/);
  await expect(page.getByText('EchoChess collects nothing')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Information Collection and Use', level: 2 })).toHaveCount(0);
});
