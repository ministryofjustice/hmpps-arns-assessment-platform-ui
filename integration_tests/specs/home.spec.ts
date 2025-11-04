import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'

test.describe('Home', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Home page displays construction message and current time', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.header).toBeVisible()
    await expect(homePage.header).toHaveText('This site is under construction...')

    const timestamp = page.getByTestId('timestamp')
    await expect(timestamp).toBeVisible()
    await expect(timestamp).toContainText('The time is currently')
  })
})
