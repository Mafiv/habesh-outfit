import { test, expect } from '@playwright/test'

test.describe('Home & Navigation', () => {
  test('home page loads with shop navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await page.getByRole('link', { name: /shop/i }).first().click()
    await expect(page).toHaveURL(/\/shop/)
  })

  test('search page loads', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByPlaceholder(/search products/i)).toBeVisible()
  })
})

test.describe('Auth pages', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
  })

  test('signup page renders form', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('button', { name: 'Create account', exact: true })).toBeVisible()
  })
})

test.describe('Cart', () => {
  test('empty cart shows message', async ({ page }) => {
    await page.goto('/bag')
    await expect(page.getByText(/bag is empty/i)).toBeVisible()
  })
})

test.describe('Admin', () => {
  test('admin login page renders', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText(/admin dashboard/i)).toBeVisible()
    await expect(page.getByPlaceholder(/admin api key/i)).toBeVisible()
  })
})
