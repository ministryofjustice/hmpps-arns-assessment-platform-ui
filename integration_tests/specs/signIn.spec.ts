import { expect, test } from '@playwright/test'
import hmppsAuth from '../mockApis/hmppsAuth'
import exampleApi from '../mockApis/exampleApi'

import { login, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'

test.describe('SignIn', () => {
  test.beforeEach(async () => {
    await exampleApi.stubExampleTime()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login(page, { name: 'A Test' })

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.usersName).toHaveText('A. Test')
  })

  test('Phase banner visible in header', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.phaseBanner).toHaveText('test')
  })

  test('User can sign out', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.signOut()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User can manage their details', async ({ page }) => {
    await login(page, { name: 'A TestUser' })

    await hmppsAuth.stubManageDetailsPage()

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.clickManageUserDetails()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your account details')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    test.skip(process.env.ENVIRONMENT === 'e2e-ui', 'Only runs when auth is wiremock')
    await login(page, { active: false })

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    test.skip(process.env.ENVIRONMENT === 'e2e-ui', 'Only runs when auth is wiremock')
    await login(page, { name: 'A TestUser', active: false })

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')

    await login(page, { name: 'Some OtherTestUser', active: true })

    const homePage = await HomePage.verifyOnPage(page)
    await expect(homePage.usersName).toHaveText('S. Othertestuser')
  })
})
