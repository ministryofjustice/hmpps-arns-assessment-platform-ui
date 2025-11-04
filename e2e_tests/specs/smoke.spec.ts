import { expect, test } from '@playwright/test'
import { login } from '../testUtils'
import HomePage from '../pages/homePage'
import '../setup'

test.describe('Smoke Test (E2E)', () => {
  test('Login, view home page, verify timestamp, sign out', async ({ page }) => {
    // Login
    await login(page)

    // Verify on home page
    const homePage = await HomePage.verifyOnPage(page)

    // Verify construction message
    await expect(homePage.header).toBeVisible()
    await expect(homePage.header).toHaveText('This site is under construction...')

    // Verify timestamp is displayed
    const timestamp = page.getByTestId('timestamp')
    await expect(timestamp).toBeVisible()
    await expect(timestamp).toContainText('The time is currently')

    // Sign out
    await homePage.signOut()

    // Verify back at sign-in
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in')
  })
})
