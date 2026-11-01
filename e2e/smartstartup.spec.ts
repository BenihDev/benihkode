import { test, expect } from '@playwright/test';
import { SITE_EMAIL } from '../src/consts';

test('SmartStartup app landing displays correctly', async ({ page }) => {
  // Visit the SmartStartup landing at its canonical /apps URL
  await page.goto('/apps/smartstartup');

  // Verify the page title
  await expect(page).toHaveTitle(/SmartStartup — BenihKode Portfolio/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'SmartStartup', level: 1 })).toBeVisible();

  // Verify the description renders
  await expect(page.getByText('boot optimization utility')).toBeVisible();

  // Verify the tech stack badges
  await expect(page.getByText('Avalonia', { exact: true })).toBeVisible();

  // Verify the Privacy Policy link points at the policy page
  const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/smartstartup/privacy');
});

test('SmartStartup landing is not published under /projects', async ({ page }) => {
  // Apps moved to /apps/<slug>: the old path must not render a second copy of
  // the landing. In production Vercel 301s it (see vercel.json); the dev
  // server does not serve vercel.json, so it answers with the 404 page.
  await page.goto('/projects/smartstartup');

  await expect(page).toHaveTitle(/404 — Lost in the Garden/);
  await expect(page.getByRole('heading', { name: "This Seed Hasn't Sprouted Yet" })).toBeVisible();
});

test('Portfolio index links SmartStartup at its /apps URL', async ({ page }) => {
  await page.goto('/projects');

  const cardLink = page.locator('#main-content').getByRole('link', { name: /SmartStartup/ }).first();
  await expect(cardLink).toBeVisible();
  await expect(cardLink).toHaveAttribute('href', '/apps/smartstartup');
});

test('SmartStartup privacy policy page displays correctly', async ({ page }) => {
  // Visit the hand-written privacy policy page at its canonical /apps URL
  await page.goto('/apps/smartstartup/privacy');

  // Verify the page title
  await expect(page).toHaveTitle(/Privacy Policy — SmartStartup/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();

  // Verify every policy section renders
  const sections = [
    'Information We Collect',
    'Data Storage',
    'Network Access & Telemetry',
    'Elevated Operations',
    'Third Parties',
    "Children's Privacy",
    'Your Rights',
    'Changes to This Policy',
    'Contact Us',
  ];
  for (const section of sections) {
    await expect(page.getByRole('heading', { name: section, level: 2 })).toBeVisible();
  }

  // Verify the offline guarantee highlight box
  await expect(page.getByText('runs 100% offline')).toBeVisible();

  // Verify the contact link (scoped to main: the site footer repeats it)
  const contact = page.locator('#main-content').getByRole('link', { name: SITE_EMAIL });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', `mailto:${SITE_EMAIL}`);

  // Verify the back link returns to the app landing
  const back = page.getByRole('link', { name: '← Back to SmartStartup' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/smartstartup');
});
