import { test, expect } from '@playwright/test';

// TypingSpeed's landing (ticket #93), on the shared App landing pattern set
// by the PocketBudget ticket: the page opens with a hero that presents the
// App — icon or emoji, name, description — and the markdown body below the
// hero stays untouched.
//
// TypingSpeed is NOT store-distributed and has no release destination in its
// entry (no url, githubUrl, or npmPackage), so the hero renders no
// call-to-action and no Support / Privacy Policy links: the field-driven
// hero never implies a release that does not exist.

test('TypingSpeed landing presents the App with no call-to-action', async ({ page }) => {
  await page.goto('/apps/typingspeed');

  await expect(page).toHaveTitle(/TypingSpeed — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'TypingSpeed', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('⌨️')).toBeVisible();
  await expect(page.getByText('Minimal typing speed test with progress charts')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('TS', { exact: true })).toBeVisible();
  await expect(page.getByText('Canvas', { exact: true })).toBeVisible();

  // No release destination: the entry has no url / githubUrl / npmPackage,
  // so the hero must not render any call-to-action links
  await expect(page.locator('.app-hero .app-hero-actions a')).toHaveCount(0);
});

test('TypingSpeed is not distributed: no Support or Privacy links in the hero', async ({ page }) => {
  await page.goto('/apps/typingspeed');

  // The hero renders no Support / Privacy Policy nav for non-distributed Apps
  await expect(page.locator('.app-hero .app-hero-pages')).toHaveCount(0);
  const hero = page.locator('.app-hero');
  await expect(hero.getByRole('link', { name: 'Support' })).toHaveCount(0);
  await expect(hero.getByRole('link', { name: 'Privacy Policy' })).toHaveCount(0);
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/typingspeed');

  // The markdown body underneath the hero is untouched
  await expect(page.getByText('distraction-free typing speed test')).toBeVisible();
  await expect(page.getByText('Canvas-rendered progress charts')).toBeVisible();
});
