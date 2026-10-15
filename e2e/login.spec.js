const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('login form is displayed', async ({ page }) => {
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('valid login shows the welcome message', async ({ page }) => {
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, admin!' })).toBeVisible();
});

test('wrong password shows an error', async ({ page }) => {
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#error')).toHaveText('Invalid username or password');
});

test('empty form shows a validation error', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#error')).toHaveText('Username and password are required');
});

test('logout returns to the login form', async ({ page }) => {
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('unknown user is rejected', async ({ page }) => {
  await page.getByLabel('Username').fill('hacker');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#error')).toHaveText('Invalid username or password');
});