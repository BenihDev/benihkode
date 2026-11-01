import { test, expect } from '@playwright/test';

// TaskMaster CLI's landing (ticket #95), on the shared App landing pattern
// set by the PocketBudget ticket: the page opens with a hero that presents
// the App — icon or emoji, name, description — and the markdown body below
// the hero stays untouched.
//
// TaskMaster CLI is a terminal App, NOT store-distributed: no Support or
// Privacy Policy links, and its call-to-action is the entry's install
// command rendered in the hero's install section rather than a store link.

const INSTALL_COMMAND = 'cargo install taskmaster-cli';

test('TaskMaster CLI landing presents the App and surfaces the install command', async ({ page }) => {
  await page.goto('/apps/taskmaster-cli');

  await expect(page).toHaveTitle(/TaskMaster CLI — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'TaskMaster CLI', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('⚡')).toBeVisible();
  await expect(page.getByText('A terminal-based task manager with priority sorting')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Rust', { exact: true })).toBeVisible();

  // The CTA is the install command, not a store link: the entry has no
  // url / githubUrl / npmPackage, so no action links render next to it
  const installSection = page.locator('.app-hero .install-section');
  await expect(installSection).toBeVisible();
  await expect(installSection.locator('.install-command')).toHaveText(INSTALL_COMMAND);
  await expect(page.locator('.app-hero .app-hero-actions a')).toHaveCount(0);
});

test('TaskMaster CLI is not distributed: no Support or Privacy links in the hero', async ({ page }) => {
  await page.goto('/apps/taskmaster-cli');

  // The hero renders no Support / Privacy Policy nav for non-distributed Apps
  await expect(page.locator('.app-hero .app-hero-pages')).toHaveCount(0);
  const hero = page.locator('.app-hero');
  await expect(hero.getByRole('link', { name: 'Support' })).toHaveCount(0);
  await expect(hero.getByRole('link', { name: 'Privacy Policy' })).toHaveCount(0);
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/taskmaster-cli');

  // The markdown body underneath the hero is untouched
  await expect(page.getByText('Built to scratch my own itch')).toBeVisible();
  await expect(page.getByText('blazing-fast terminal task manager')).toBeVisible();
});
