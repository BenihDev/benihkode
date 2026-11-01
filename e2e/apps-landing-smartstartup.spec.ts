import { test, expect } from '@playwright/test';

// SmartStartup landing (ticket #87), following the App landing pattern set
// by the PocketBudget ticket. SmartStartup is distributed through the
// Microsoft Store: its frontmatter url is the store listing, so the hero
// renders "Get the App" pointing there. It serves a hand-written privacy
// page; its deeper privacy-page coverage lives in e2e/smartstartup.spec.ts.

const MICROSOFT_STORE_URL = 'https://apps.microsoft.com/detail/9P0QNS4L0GG8';

test('SmartStartup landing presents the App with a Microsoft Store call-to-action', async ({ page }) => {
  await page.goto('/apps/smartstartup');

  await expect(page).toHaveTitle(/SmartStartup — BenihKode Portfolio/);

  // The hero presents the App: emoji identity, name, description
  await expect(page.getByRole('heading', { name: 'SmartStartup', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('⚡')).toBeVisible();
  await expect(
    page.locator('.app-hero').getByText('Windows 11 boot optimization utility')
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Avalonia', { exact: true })).toBeVisible();

  // A clear store CTA driven by the entry's url field: the Microsoft Store
  // listing. No repository or npm package is published, so nothing else
  // renders in the hero actions.
  const cta = page.locator('.app-hero .app-hero-actions').getByRole('link', { name: /Get the App/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', MICROSOFT_STORE_URL);
  await expect(cta).toHaveAttribute('target', '_blank');
  await expect(page.locator('.app-hero .app-hero-actions').getByRole('link')).toHaveCount(1);
});

test('Support and Privacy Policy are first-class hero links and resolve', async ({ page }) => {
  await page.goto('/apps/smartstartup');

  // Both links sit in the hero with canonical /apps hrefs
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/smartstartup/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/smartstartup/privacy');

  // Follow one: the hand-written policy page must actually be reachable
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/smartstartup/privacy');
  await expect(page).toHaveTitle(/Privacy Policy — SmartStartup/);
});

test('the SmartStartup privacy page is the hand-written one, not the template', async ({ page }) => {
  // Hand-written precedence: the bespoke page serves the URL, so its own copy
  // is present and the generated template's section headings are absent
  await page.goto('/apps/smartstartup/privacy');

  await expect(page.getByText('It runs 100% offline: it collects no telemetry, contacts no server,')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Introduction', level: 2 })).toHaveCount(0);

  // The policy links back to the landing
  const back = page.getByRole('link', { name: 'Back to SmartStartup' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/smartstartup');
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/smartstartup');

  // The markdown body underneath the hero is untouched
  await expect(page.getByRole('heading', { name: 'What It Does', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why Local-First', level: 2 })).toBeVisible();
  await expect(page.getByText('Uninstalling the app removes everything.')).toBeVisible();
});
