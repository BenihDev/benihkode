import { test, expect } from '@playwright/test';

// HabitTracker (ticket #92) adopts the shared App landing pattern set by the
// PocketBudget ticket: hero identity, tech stack, and hero-contained Support
// / Privacy Policy links. The entry is distributed but carries no `url`
// field, so the hero correctly renders no store call-to-action. Its privacy
// policy is the generated template wrapped around the app-pages document —
// the document itself has no Contact section, so a Contact Us heading on the
// page proves the template rendered it.

test('HabitTracker landing presents the App without a store call-to-action', async ({ page }) => {
  await page.goto('/apps/habittracker');

  await expect(page).toHaveTitle(/HabitTracker — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'HabitTracker', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('📊')).toBeVisible();
  await expect(page.getByText('Simple daily habit tracker with streak visualization.')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Vue', { exact: true })).toBeVisible();
  await expect(page.getByText('D3', { exact: true })).toBeVisible();

  // Distributed but no `url` field: no store CTA renders, and no secondary
  // links either (no githubUrl / npmPackage on the entry)
  const main = page.locator('#main-content');
  await expect(main.getByRole('link', { name: /Get the App/ })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'GitHub' })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'npm' })).toHaveCount(0);
});

test('Support and Privacy Policy are first-class links on the landing', async ({ page }) => {
  await page.goto('/apps/habittracker');

  // Both store-mandated links sit in the hero, not buried at the page bottom
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/habittracker/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/habittracker/privacy');

  // Follow Support: the generated template wraps the app-pages document,
  // whose Reporting a problem section renders below the template's Contact
  await supportLink.click();
  await expect(page).toHaveURL('/apps/habittracker/support');
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByText('for HabitTracker')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reporting a problem', level: 2 })).toBeVisible();

  // Follow Privacy: the generated page serves this URL. The policy document
  // carries no Contact section, so Contact Us rendering here proves the
  // template (not a hand-written page) produced the policy.
  await page.goto('/apps/habittracker');
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/habittracker/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact Us', level: 2 })).toBeVisible();
  // The policy document renders through markdown, so its apostrophe is
  // typographic — match it loosely
  await expect(page.getByRole('heading', { name: /Children.s Privacy/, level: 2 })).toBeVisible();
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/habittracker');

  await expect(page.getByText('Track your habits visually with beautiful streak charts built with D3.js.')).toBeVisible();
  await expect(page.getByText('Designed for simplicity — just open it and check off your daily habits.')).toBeVisible();
});
