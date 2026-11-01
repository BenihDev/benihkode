import { test, expect } from '@playwright/test';
import { SITE_EMAIL } from '../src/consts';

test('ColorPalette Pro serves the generated support page at /apps/<slug>/support', async ({ page }) => {
  // The generated route renders from the App's own document in
  // src/content/app-pages; the template owns the header and contact section
  await page.goto('/apps/colorpalette-pro/support');

  await expect(page).toHaveTitle(/Support — ColorPalette Pro/);
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByText('for ColorPalette Pro')).toBeVisible();

  // The template's contact section and the document's problem-reporting copy
  // both render; no FAQ is invented for the minimal page
  await expect(page.getByRole('heading', { name: 'Contact', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reporting a problem', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frequently asked questions', level: 2 })).toHaveCount(0);

  // Verify the contact link (scoped to main: the site footer repeats it)
  const contact = page.locator('#main-content').getByRole('link', { name: SITE_EMAIL });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', `mailto:${SITE_EMAIL}`);

  // Verify the back link returns to the app landing
  const back = page.getByRole('link', { name: 'Back to ColorPalette Pro' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/colorpalette-pro');
});

test('the ColorPalette Pro landing cross-links its support page', async ({ page }) => {
  await page.goto('/apps/colorpalette-pro');

  const supportLink = page.locator('#main-content').getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/colorpalette-pro/support');

  // Follow the link: the support page must actually be reachable
  await supportLink.click();
  await expect(page).toHaveURL('/apps/colorpalette-pro/support');
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
});

test('a hand-written page wins its URL: EchoChess serves its bespoke support page', async ({ page }) => {
  await page.goto('/apps/echochess/support');

  // The generated route steps aside when a hand-written page file exists, so
  // exactly one page is published per URL — EchoChess's own, not the template.
  await expect(page).toHaveTitle(/Support — EchoChess/);
  await expect(page.getByRole('heading', { name: 'Frequently asked questions', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where is my progress stored?', level: 3 })).toBeVisible();
  // The template's Contact section never renders here
  await expect(page.getByRole('heading', { name: 'Contact', level: 2 })).toHaveCount(0);
});
