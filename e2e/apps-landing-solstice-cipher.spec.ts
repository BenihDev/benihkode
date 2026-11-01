import { test, expect } from '@playwright/test';

// Solstice Cipher (ticket #90) adopts the shared App landing pattern set by
// the PocketBudget ticket: hero identity, tech stack, the store CTA from the
// entry's url field with GitHub as a secondary link, and hero-contained
// Support / Privacy Policy links. Distribution runs through Google Play —
// including while the listing is in internal testing — so the CTA points at
// the Play listing exactly as the frontmatter records it (the "solsticechiper"
// id spelling is the live store id, kept verbatim on purpose). Its privacy
// policy is the hand-written page.

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.benihkode.solsticechiper';
const GITHUB_URL = 'https://github.com/fanioz/solstice-cipher';

test('Solstice Cipher landing presents the App with the Play Store call-to-action', async ({ page }) => {
  await page.goto('/apps/solstice-cipher');

  await expect(page).toHaveTitle(/Solstice Cipher — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'Solstice Cipher', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('🧩')).toBeVisible();
  await expect(
    page.getByText('A free, offline puzzle game for Android built in Godot 4 for the June Solstice Game Jam.'),
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Godot', { exact: true })).toBeVisible();
  await expect(page.getByText('GDScript', { exact: true })).toBeVisible();

  // A clear store CTA driven by the entry's url field
  const cta = page.locator('#main-content').getByRole('link', { name: /Get the App/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', PLAY_STORE_URL);
  await expect(cta).toHaveAttribute('target', '_blank');

  // GitHub sits beside the CTA as the secondary link
  const github = page.locator('#main-content').getByRole('link', { name: 'GitHub', exact: true });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute('href', GITHUB_URL);
});

test('Support and Privacy Policy are first-class links on the landing', async ({ page }) => {
  await page.goto('/apps/solstice-cipher');

  // Both store-mandated links sit in the hero, not buried at the page bottom
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/solstice-cipher/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/solstice-cipher/privacy');

  // Follow Support: generated from the app-pages document
  await supportLink.click();
  await expect(page).toHaveURL('/apps/solstice-cipher/support');
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByText('for Solstice Cipher')).toBeVisible();

  // Follow Privacy: the hand-written page serves this URL, identified by its
  // bespoke offline guarantee — the generated template has no such line
  await page.goto('/apps/solstice-cipher');
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/solstice-cipher/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  await expect(page.getByText(/no account, no login, and no tracking/)).toBeVisible();
});

test('the landing keeps the internal-testing story below the hero', async ({ page }) => {
  await page.goto('/apps/solstice-cipher');

  // The CTA points at the Play listing while the body explains how to get
  // access during internal testing — both stay true side by side
  await expect(page.getByText(/currently in Google Play/)).toBeVisible();
  await expect(page.getByText(/internal testing/)).toBeVisible();
  const groupPlayLink = page.getByRole('link', { name: 'Google Play' });
  await expect(groupPlayLink).toBeVisible();
  await expect(groupPlayLink).toHaveAttribute('href', PLAY_STORE_URL);
  await expect(page.locator('#main-content').getByRole('link', { name: 'benihkode', exact: true })).toBeVisible();

  // The web build and dev journal links survive the upgrade
  await expect(page.getByRole('link', { name: 'GitHub Pages' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'building the tutorial UI' })).toBeVisible();
});
