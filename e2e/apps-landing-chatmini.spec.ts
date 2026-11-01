import { test, expect } from '@playwright/test';

// ChatMini (ticket #91) adopts the shared App landing pattern set by the
// PocketBudget ticket as the one App that is NOT store-distributed: the hero
// presents identity and tech stack, but with no url, githubUrl, or
// npmPackage on the entry it renders no call-to-action at all, and without
// the distributed marker it renders no Support or Privacy Policy links —
// store-mandated pages do not exist for this App.

test('ChatMini landing presents the App with no call-to-action', async ({ page }) => {
  await page.goto('/apps/chatmini');

  await expect(page).toHaveTitle(/ChatMini — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'ChatMini', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('💬')).toBeVisible();
  await expect(page.getByText('Lightweight WebSocket chat with E2E encryption.')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Node', { exact: true })).toBeVisible();
  await expect(page.getByText('WS', { exact: true })).toBeVisible();

  // No store, GitHub, or npm destination on the entry: no action links may
  // render, so the landing never implies a release
  const main = page.locator('#main-content');
  await expect(main.getByRole('link', { name: /Get the App/ })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'GitHub' })).toHaveCount(0);
  await expect(main.getByRole('link', { name: 'npm' })).toHaveCount(0);
});

test('ChatMini landing renders no Support or Privacy Policy links', async ({ page }) => {
  await page.goto('/apps/chatmini');

  // Not distributed: the store-mandated link pair is absent from the hero
  const hero = page.locator('.app-hero');
  await expect(hero.getByRole('link', { name: 'Support' })).toHaveCount(0);
  await expect(hero.getByRole('link', { name: 'Privacy Policy' })).toHaveCount(0);
  await expect(hero.locator('.app-hero-pages')).toHaveCount(0);

  // And the routing side holds: the generated pages only exist for
  // distributed Apps, so both URLs miss. The dev server does not serve
  // vercel.json, so it answers with the 404 page.
  await page.goto('/apps/chatmini/support');
  await expect(page).toHaveTitle(/404 — Lost in the Garden/);
  await page.goto('/apps/chatmini/privacy');
  await expect(page).toHaveTitle(/404 — Lost in the Garden/);
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/chatmini');

  await expect(page.getByText('A minimal, end-to-end encrypted chat application built on WebSockets.')).toBeVisible();
  await expect(page.getByText('Privacy-first, with no data stored on servers.')).toBeVisible();
});
