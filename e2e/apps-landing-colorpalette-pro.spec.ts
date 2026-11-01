import { test, expect } from '@playwright/test';

// ColorPalette Pro landing (ticket #88), following the App landing pattern
// set by the PocketBudget ticket. ColorPalette Pro is distributed (its
// frontmatter sets `distributed: true`, so Support / Privacy links render)
// but publishes no download destination yet: no url, no githubUrl, no
// npmPackage — so the hero renders no call-to-action at all. Its privacy
// page is the generated one, rendered from src/content/app-pages.

test('ColorPalette Pro landing presents the App without a call-to-action', async ({ page }) => {
  await page.goto('/apps/colorpalette-pro');

  await expect(page).toHaveTitle(/ColorPalette Pro — BenihKode Portfolio/);

  // The hero presents the App: emoji identity, name, description
  await expect(page.getByRole('heading', { name: 'ColorPalette Pro', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('🎨')).toBeVisible();
  await expect(
    page.locator('.app-hero').getByText('AI-generated color palettes with accessibility scores.')
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.locator('.app-hero .tech-stack').getByText('Svelte', { exact: true })).toBeVisible();

  // No url, no githubUrl, no npmPackage: the hero renders no CTA at all,
  // and nothing on the page implies a store listing exists
  const heroActions = page.locator('.app-hero .app-hero-actions');
  await expect(heroActions).toBeAttached();
  await expect(heroActions.getByRole('link')).toHaveCount(0);
  await expect(page.locator('#main-content').getByRole('link', { name: /Get the App/ })).toHaveCount(0);
});

test('Support and Privacy Policy are first-class hero links and resolve', async ({ page }) => {
  await page.goto('/apps/colorpalette-pro');

  // Both links sit in the hero with canonical /apps hrefs
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/colorpalette-pro/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/colorpalette-pro/privacy');

  // Follow one: the generated policy page must actually be reachable
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/colorpalette-pro/privacy');
  await expect(page).toHaveTitle(/Privacy Policy — ColorPalette Pro/);
  await expect(page.getByText('for ColorPalette Pro')).toBeVisible();
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/colorpalette-pro');

  // The markdown body underneath the hero is untouched — ColorPalette Pro's
  // entry is a single intro paragraph, with no section headings
  await expect(page.getByText('Every palette comes with WCAG contrast scores and export options')).toBeVisible();
});
