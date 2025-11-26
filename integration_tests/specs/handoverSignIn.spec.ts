import { expect, test } from '@playwright/test'
import handover from '../mockApis/handover'

import { loginHandover, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'

test.describe('Handover SignIn', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to handover sign in', async ({ page }) => {
    await handover.stubSignInPage()
    await page.goto('/sign-in/handover')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User can sign in via handover with name', async ({ page }) => {
    await loginHandover(page, { name: 'John Smith' })

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.usersName).toHaveText('J. Smith')
  })

  test('User can sign in via handover without name (fallback to username)', async ({ page }) => {
    await loginHandover(page, {})

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.usersName).toHaveText('H. User1')
  })

  test('Handover user has correct auth source', async ({ page }) => {
    await loginHandover(page, { name: 'Test User' })

    await page.goto('/')

    const homePage = await HomePage.verifyOnPage(page)
    await expect(homePage.usersName).toHaveText('T. User')
  })

  test('Handover user with roles', async ({ page }) => {
    await loginHandover(page, {
      name: 'Admin User',
      roles: ['ROLE_AAP__FRONTEND_RW'],
    })

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.usersName).toHaveText('A. User')
  })
})
