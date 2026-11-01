import { test, expect } from '@playwright/test';

// Gas Flow Calculator (ticket #89) adopts the shared App landing pattern set
// by the PocketBudget ticket: the page opens with the field-driven hero —
// identity, tech stack, actions, Support / Privacy Policy links. This entry
// is distributed but carries no `url` field, so the hero correctly renders no
// store call-to-action: the pattern keeps an unreleased entry from implying a
// release. Its privacy policy is the hand-written page.

test('Gas Flow Calculator landing presents the App without a store call-to-action', async ({ page }) => {
  await page.goto('/apps/gas-flow-calculator');

  await expect(page).toHaveTitle(/Gas Flow Calculator — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'Gas Flow Calculator', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('🧮')).toBeVisible();
  await expect(
    page.getByText(
      'Field-ready Flutter utility for ISO 5167 gas flow calculations, precision unit input, and mobile-first engineering workflows.',
    ),
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Flutter', { exact: true })).toBeVisible();
  await expect(page.getByText('Dart', { exact: true })).toBeVisible();
  await expect(page.getByText('Android', { exact: true })).toBeVisible();

  // Distributed but no `url` field: no store CTA renders, and no secondary
  // links either (no githubUrl / npmPackage on the entry)
  const main = page.locator('#main-content');
  await expect(main.getByRole('link', { name: /Get the App/ })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'GitHub' })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'npm' })).toHaveCount(0);
});

test('Support and Privacy Policy are first-class links on the landing', async ({ page }) => {
  await page.goto('/apps/gas-flow-calculator');

  // Both store-mandated links sit in the hero, not buried at the page bottom
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/gas-flow-calculator/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/gas-flow-calculator/privacy');

  // Follow Support: generated from the app-pages document
  await supportLink.click();
  await expect(page).toHaveURL('/apps/gas-flow-calculator/support');
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByText('for Gas Flow Calculator')).toBeVisible();

  // Follow Privacy: the hand-written page serves this URL, identified by its
  // policy-version line — the generated template has no such line
  await page.goto('/apps/gas-flow-calculator');
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/gas-flow-calculator/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  await expect(page.getByText(/Policy version 1\.1/)).toBeVisible();
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/gas-flow-calculator');

  // The hero replaces the old page header; the markdown body underneath is
  // untouched
  await expect(page.getByRole('heading', { name: 'What It Does', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Field-First Design', level: 2 })).toBeVisible();
  await expect(page.getByText('Gas Flow Calculator is supported by a project-specific privacy policy linked from this page.')).toBeVisible();
});
