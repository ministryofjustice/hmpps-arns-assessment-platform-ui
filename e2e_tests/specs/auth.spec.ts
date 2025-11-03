import { expect, test } from '@playwright/test'
import { login } from '../testUtils'
import HomePage from '../pages/homePage'
import '../setup'

test.describe('Auth (E2E)', () => {
  test('Unauthenticated user is redirected to auth', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })

  test('User can sign in and sign out', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)
    await expect(homePage.usersName).toBeVisible()
    await homePage.signOut()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })
})
