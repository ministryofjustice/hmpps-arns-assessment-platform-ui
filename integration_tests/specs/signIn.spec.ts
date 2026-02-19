import { expect, test } from '@playwright/test'
import tokenVerification from '../mockApis/tokenVerification'

import { login } from '../testUtils'
import HomePage from '../pages/homePage'
import { resetStubs } from '../mockApis/wiremock'

test.describe('SignIn', () => {
  test('Unauthenticated user directed to auth', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await page.goto('/sign-in')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.usersName).toHaveText('A. Test')
  })

  test('User can sign out', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.signOut()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User account type visible in header', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)
    await expect(homePage.accountType).toHaveText('Auth User')
  })

  test('Token verification failure redirects user to auth @serial', async ({ page }) => {
    await login(page)

    await tokenVerification.stubVerifyToken(false)

    const authRequestPromise = page.waitForRequest(request => request.url().includes('/auth/oauth/authorize'))

    const gotoPromise = page.goto('/').catch(() => {
      // Expected: ERR_TOO_MANY_REDIRECTS
    })

    const authRequest = await authRequestPromise

    expect(authRequest.url()).toContain('/auth/oauth/authorize')

    await gotoPromise
    await resetStubs()
  })
})
