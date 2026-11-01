import { test, expect } from '@playwright/test';

// WeatherNow's landing (ticket #94), on the shared App landing pattern set
// by the PocketBudget ticket: the page opens with a hero that presents the
// App — icon or emoji, name, description — and the markdown body below the
// hero stays untouched.
//
// WeatherNow IS distributed (store-mandated pages), so the hero renders
// first-class Support / Privacy Policy links resolving to the canonical
// /apps/weathernow/support and /apps/weathernow/privacy pages. Its entry
// has no url field, so the hero renders no store call-to-action.

test('WeatherNow landing presents the App with no store call-to-action', async ({ page }) => {
  await page.goto('/apps/weathernow');

  await expect(page).toHaveTitle(/WeatherNow — BenihKode Portfolio/);

  // The hero presents the App: emoji, name, description
  await expect(page.getByRole('heading', { name: 'WeatherNow', level: 1 })).toBeVisible();
  await expect(page.locator('.app-hero').getByText('🌤')).toBeVisible();
  await expect(page.getByText('Hyper-local weather app with ML-powered')).toBeVisible();

  // The tech stack stays part of the presentation
  await expect(page.getByText('React', { exact: true })).toBeVisible();
  await expect(page.getByText('ML', { exact: true })).toBeVisible();

  // The entry has no url field, so the hero must not render a store CTA
  await expect(page.locator('.app-hero .app-hero-actions a')).toHaveCount(0);
});

test('Support and Privacy Policy are first-class links on the landing', async ({ page }) => {
  await page.goto('/apps/weathernow');

  // Both store-mandated links sit in the hero, not buried at the page bottom
  const hero = page.locator('.app-hero');
  const supportLink = hero.getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/apps/weathernow/support');

  const privacyLink = hero.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/apps/weathernow/privacy');

  // The policy page must actually be reachable and render WeatherNow's
  // generated policy, not another App's
  await privacyLink.click();
  await expect(page).toHaveURL('/apps/weathernow/privacy');
  await expect(page).toHaveTitle(/Privacy Policy — WeatherNow/);
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
  await expect(page.getByText('designed with privacy in mind')).toBeVisible();

  // The back link returns to the app landing (the generated template keeps
  // its arrow in an aria-hidden span, so it is not part of the link's name)
  const back = page.getByRole('link', { name: 'Back to WeatherNow' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/weathernow');
});

test('the Support page resolves from the landing', async ({ page }) => {
  await page.goto('/apps/weathernow/support');

  await expect(page).toHaveTitle(/Support — WeatherNow/);
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();

  // The generated page renders WeatherNow's support document
  await expect(page.getByRole('heading', { name: 'Reporting a problem', level: 2 })).toBeVisible();

  // And cross-links back to the landing
  const back = page.getByRole('link', { name: 'Back to WeatherNow' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/apps/weathernow');
});

test('the landing keeps the App story below the hero', async ({ page }) => {
  await page.goto('/apps/weathernow');

  // The markdown body underneath the hero is untouched
  await expect(page.getByText('goes beyond basic forecasts')).toBeVisible();
});
