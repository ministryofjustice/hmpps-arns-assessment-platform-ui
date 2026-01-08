import { expect, test } from '@playwright/test'
import hmppsAuth from '../mockApis/hmppsAuth'

import { login, resetStubs } from '../testUtils'

test.describe('Auth Bypass', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user can access bypassed path without redirect to sign-in', async ({ page }) => {
    // Arrange
    await hmppsAuth.stubSignInPage()

    // Act
    const response = await page.goto('/forms/form-engine-developer-guide')

    // Assert - should not be redirected to sign-in page
    expect(page.url()).not.toContain('/sign-in')
    expect(response?.status()).toBeLessThan(400)
  })

  test('Unauthenticated user can access nested bypassed path', async ({ page }) => {
    // Arrange
    await hmppsAuth.stubSignInPage()

    // Act
    const response = await page.goto('/forms/form-engine-developer-guide/form-registration')

    // Assert - should not be redirected to sign-in page
    expect(page.url()).not.toContain('/sign-in')
    expect(response?.status()).toBeLessThan(400)
  })

  test('Unauthenticated user is still redirected for non-bypassed paths', async ({ page }) => {
    // Arrange
    await hmppsAuth.stubSignInPage()

    // Act
    await page.goto('/')

    // Assert - should be redirected to sign-in page
    expect(page.url()).toContain('/sign-in')
  })

  test('Similar but non-matching path still requires auth', async ({ page }) => {
    // Arrange
    await hmppsAuth.stubSignInPage()

    // Act - path that starts similarly but doesn't match the bypass prefix
    await page.goto('/forms/form-engine-developer')

    // Assert - should be redirected to sign-in (or 404, but not the page content)
    const url = page.url()
    const isRedirectedOrBlocked = url.includes('/sign-in') || url.includes('/autherror')
    expect(isRedirectedOrBlocked).toBe(true)
  })

  test('Authenticated user can still access bypassed path with user info populated', async ({ page }) => {
    // Arrange
    await login(page, { name: 'Test User' })

    // Act
    const response = await page.goto('/forms/form-engine-developer-guide')

    // Assert - should load successfully
    expect(response?.status()).toBeLessThan(400)

    // User name should still be visible in header
    await expect(page.locator('[data-qa="header-user-name"]')).toHaveText('T. User')
  })
})
