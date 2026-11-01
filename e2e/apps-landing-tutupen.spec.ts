import { test, expect } from '@playwright/test';

// TutuPen landing (ticket #86), following the App landing pattern set by
// the PocketBudget ticket. TutuPen is distributed (frontmatter sets
// `distributed: true`) but ships from its repository, not a store: its
// frontmatter has githubUrl and no url, so the hero's action is the GitHub
// link and there is no "Get the App" call-to-action. It renders its real
// icon image and serves a hand-written privacy page.

const GITHUB_URL = 'https://github.com/fanioz/tutupen';

test('TutuPen landing presents the App with its icon and GitHub action', async ({ page }) => {
  await page.goto('/apps/tutupen');

  await expect(page).toHaveTitle(/Tutupen — BenihKode Portfolio/);

  // The hero presents the App with its real icon image, not an emoji fallback
  await expect(page.getByRole('heading', { name: 'Tutupen', level: 1 })).toBeVisible();
  const icon = page.locator('.app-hero img.project-icon');
  await expect(icon).toBeVisible();
  await expect(icon).toHaveAttribute('src', '/icons/tutupen.png');
  await expect(icon).toHaveAttribute('alt', 'Tutupen app icon');
  await expect(page.locator('.app-hero .project-emoji')).toHaveCount(0);

  await expect(
    page.locator('.app-hero').getByText('A silent janitor for your browser')
  ).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('Chrome Extension', { exact: true })).toBeVisible();

  // Distributed from its repository: GitHub is the hero action, and with no
  // url field there is no store CTA
  const github = page.locator('.app-hero .app-hero-actions').getByRole('link', { name: 'GitHub' });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute('href', GITHUB_URL);
  await expect(github).toHaveAttribute('target', '_blank');
  await expect(page.locator('#main-content').getByRole('link', { name: /Get the App/ })).toHaveCount(0);
});

test('Support and Privacy Policy are first-class hero links and resolve', async ({ page }) => {
  await page.goto('/apps/tutupen');

  // Both links sit in the hero with canonical /apps hrefs
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/tutupen/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/tutupen/privacy');

  // Follow one: the hand-written policy page must actually be reachable
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/tutupen/privacy');
  await expect(page).toHaveTitle(/Privacy Policy — Tutupen/);
});

test('the TutuPen privacy page is the hand-written one, not the template', async ({ page }) => {
  // Hand-written precedence: the bespoke page serves the URL, so its own copy
  // is present and the generated template's section headings are absent
  await page.goto('/apps/tutupen/privacy');

  await expect(page.getByText('Tutupen has no server and never transmits your data anywhere.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Information Collection and Use', level: 2 })).toHaveCount(0);

  // The policy links back to the landing
  const back = page.getByRole('link', { name: 'Back to Tutupen' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/tutupen');
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/tutupen');

  // The markdown body underneath the hero is untouched
  await expect(page.getByRole('heading', { name: 'What It Does', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tech Stack', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why Silent + Restorable', level: 2 })).toBeVisible();
  await expect(page.getByText('The janitor cleans; you stay in control.')).toBeVisible();
});
