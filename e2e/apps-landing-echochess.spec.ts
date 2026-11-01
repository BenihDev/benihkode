import { test, expect } from '@playwright/test';

// EchoChess landing (ticket #85), following the App landing pattern set by
// the PocketBudget ticket. EchoChess is in development: its frontmatter has
// no url and no githubUrl, so the hero must present the App WITHOUT any
// release-implying call-to-action, while the Support and Privacy Policy
// links (both hand-written pages) stay first-class inside the hero.

test('EchoChess landing presents the App without a store call-to-action', async ({ page }) => {
  await page.goto('/apps/echochess');

  await expect(page).toHaveTitle(/EchoChess — BenihKode Portfolio/);

  // The hero presents the App: emoji identity, name, description
  await expect(page.getByRole('heading', { name: 'EchoChess', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('♞')).toBeVisible();
  await expect(
    page.locator('.app-hero').getByText('Offline chess sparring studio for iPhone')
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('SwiftUI', { exact: true })).toBeVisible();

  // In development, no store URL and no repository yet: the hero actions
  // render no CTA at all, so the page never implies a release
  const heroActions = page.locator('.app-hero .app-hero-actions');
  await expect(heroActions).toBeAttached();
  await expect(heroActions.getByRole('link')).toHaveCount(0);
  await expect(page.locator('#main-content').getByRole('link', { name: /Get the App/ })).toHaveCount(0);
});

test('Support and Privacy Policy are first-class hero links and resolve', async ({ page }) => {
  await page.goto('/apps/echochess');

  // Both links sit in the hero with canonical /apps hrefs
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/echochess/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/echochess/privacy');

  // The support page is hand-written and must actually resolve
  await supportLink.click();
  await expect(page).toHaveURL('/apps/echochess/support');
  await expect(page).toHaveTitle(/Support — EchoChess/);
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frequently asked questions', level: 2 })).toBeVisible();
});

test('the landing keeps the in-development banner and the App story below the hero', async ({ page }) => {
  await page.goto('/apps/echochess');

  // The App is not released: the body must keep saying so, plainly
  await expect(page.getByText('In development.')).toBeVisible();
  await expect(page.getByText('EchoChess is not on the App Store yet.')).toBeVisible();

  // The markdown body underneath the hero is untouched
  await expect(page.getByRole('heading', { name: 'What It Does', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why', level: 2 })).toBeVisible();
  await expect(page.getByText('EchoChess will be a one-time purchase on the App Store when it ships.')).toBeVisible();
});
