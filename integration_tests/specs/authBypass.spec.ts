import { expect, test } from '@playwright/test'

import { login } from '../testUtils'

test.describe('Auth Bypass', () => {
  test('Unauthenticated user can access bypassed path without redirect to sign-in', async ({ page }) => {
    // Act
    const response = await page.goto('/form-engine-developer-guide')

    // Assert - should not be redirected to sign-in page
    expect(page.url()).not.toContain('/sign-in')
    expect(response?.status()).toBeLessThan(400)
  })

  test('Unauthenticated user can access nested bypassed path', async ({ page }) => {
    // Act
    const response = await page.goto('/form-engine-developer-guide/form-registration')

    // Assert - should not be redirected to sign-in page
    expect(page.url()).not.toContain('/sign-in')
    expect(response?.status()).toBeLessThan(400)
  })

  test('Unauthenticated user is still redirected for non-bypassed paths', async ({ page }) => {
    // Act
    await page.goto('/')

    // Assert - should be redirected to OAuth provider (via /sign-in redirect)
    const url = page.url()
    const isRedirectedToAuth = url.includes('oauth/authorize') || url.includes('/sign-in')

    expect(isRedirectedToAuth).toBe(true)
  })

  test('Similar but non-matching path still requires auth', async ({ page }) => {
    // Act - path that starts similarly but doesn't match the bypass prefix
    await page.goto('/form-engine-developer')

    // Assert - should be redirected to OAuth provider (via /sign-in redirect)
    const url = page.url()
    const isRedirectedToAuth = url.includes('oauth/authorize') || url.includes('/sign-in')

    expect(isRedirectedToAuth).toBe(true)
  })

  test('Authenticated user can still access bypassed path with user info populated', async ({ page }) => {
    // Arrange
    await login(page)

    // Act
    const response = await page.goto('/form-engine-developer-guide')

    // Assert
    expect(response?.status()).toBeLessThan(400)
    expect(page.url()).toContain('/form-engine-developer-guide')

    await expect(page.locator('[data-qa="header-user-name"]')).toHaveText('A. Test')
  })
})
