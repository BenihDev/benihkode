import { test, expect } from '@playwright/test';

test('SmartStartup project page displays correctly', async ({ page }) => {
  // Visit the SmartStartup project page
  await page.goto('/projects/smartstartup');

  // Verify the page title
  await expect(page).toHaveTitle(/SmartStartup — Projects/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'SmartStartup', level: 1 })).toBeVisible();

  // Verify the description renders
  await expect(page.getByText('boot optimization utility')).toBeVisible();

  // Verify the tech stack badges
  await expect(page.getByText('Avalonia', { exact: true })).toBeVisible();

  // Verify the Privacy Policy link points at the policy page
  const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/projects/smartstartup/privacy-policy');
});

test('SmartStartup privacy policy page displays correctly', async ({ page }) => {
  // Visit the privacy policy page
  await page.goto('/projects/smartstartup/privacy-policy');

  // Verify the page title
  await expect(page).toHaveTitle(/Privacy Policy — SmartStartup/);

  // Verify the main heading
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();

  // Verify every policy section renders
  const sections = [
    'Information We Collect',
    'Data Storage',
    'Network Access & Telemetry',
    'Elevated Operations',
    'Third Parties',
    "Children's Privacy",
    'Your Rights',
    'Changes to This Policy',
    'Contact Us',
  ];
  for (const section of sections) {
    await expect(page.getByRole('heading', { name: section, level: 2 })).toBeVisible();
  }

  // Verify the offline guarantee highlight box
  await expect(page.getByText('runs 100% offline')).toBeVisible();

  // Verify the contact link (scoped to main: the site footer repeats it)
  const contact = page.locator('#main-content').getByRole('link', { name: 'hello@benihkode.web.id' });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', 'mailto:hello@benihkode.web.id');

  // Verify the back link returns to the project page
  const back = page.getByRole('link', { name: '← Back to SmartStartup' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('href', '/projects/smartstartup');
});
