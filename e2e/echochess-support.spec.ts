import { test, expect } from '@playwright/test';
import { SITE_EMAIL } from '../src/consts';

test('EchoChess project page links to the support page', async ({ page }) => {
  // Visit the EchoChess project page
  await page.goto('/projects/echochess');

  // Verify the Support link points at the app-owned support page
  const supportLink = page.locator('#main-content').getByRole('link', { name: 'Support' });
  await expect(supportLink).toBeVisible();
  await expect(supportLink).toHaveAttribute('href', '/projects/echochess/support');

  // Follow the link: the support page must actually be reachable
  await supportLink.click();
  await expect(page).toHaveURL('/projects/echochess/support');
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
});

test('EchoChess support page renders its FAQ', async ({ page }) => {
  // Visit the support page at its new app-owned URL
  await page.goto('/projects/echochess/support');

  // Verify the page title and description name the app
  await expect(page).toHaveTitle(/Support — EchoChess/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /EchoChess/);

  // Verify the main heading and app name render
  await expect(page.getByRole('heading', { name: 'Support', level: 1 })).toBeVisible();
  await expect(page.getByText('for EchoChess')).toBeVisible();

  // Verify the FAQ renders
  await expect(page.getByRole('heading', { name: 'Frequently asked questions', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where is my progress stored?', level: 3 })).toBeVisible();

  // Verify the contact link (scoped to main: the site footer repeats it)
  const contact = page.locator('#main-content').getByRole('link', { name: SITE_EMAIL });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', `mailto:${SITE_EMAIL}`);

  // Verify the back link returns to the project page
  const back = page.getByRole('link', { name: '← Back to EchoChess' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/projects/echochess');
});
