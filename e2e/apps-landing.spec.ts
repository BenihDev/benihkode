import { test, expect } from '@playwright/test';

// The App landing pattern (established on PocketBudget, ticket #84): the page
// opens with a hero that presents the App — icon, name, description — followed
// by a store call-to-action and first-class Support / Privacy Policy links.
// The markdown body below the hero stays untouched.

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.benihkode.pocketbudget';

test('PocketBudget landing presents the App with a store call-to-action', async ({ page }) => {
  await page.goto('/apps/pocketbudget');

  await expect(page).toHaveTitle(/PocketBudget — BenihKode Portfolio/);

  // The hero presents the App: icon or emoji, name, description
  await expect(page.getByRole('heading', { name: 'PocketBudget', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('💰')).toBeVisible();
  await expect(page.getByText('Personal finance tracker with local-first SQLite storage')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('React Native', { exact: true })).toBeVisible();

  // A clear store CTA driven by the entry's url field
  const cta = page.locator('#main-content').getByRole('link', { name: /Get the App/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  await expect(cta).toHaveAttribute('target', '_blank');
});

test('Support and Privacy Policy are first-class links on the landing', async ({ page }) => {
  await page.goto('/apps/pocketbudget');

  // Both store-mandated links sit in the hero, not buried at the page bottom
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/pocketbudget/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/pocketbudget/privacy');

  // Follow one: the policy page must actually be reachable
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/pocketbudget/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/pocketbudget');

  // The upgrade moves the page's header into a hero; the markdown body
  // underneath is untouched
  await expect(page.getByRole('heading', { name: 'What It Does', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why Local-First', level: 2 })).toBeVisible();
  await expect(page.getByText('Available on the Google Play Store')).toBeVisible();
});
