import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import HomePage from '../pages/homePage'

test.describe('Home', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Home page displays construction message, current time, side nav and HTML blocks', async ({ page }) => {
    await login(page)

    const homePage = await HomePage.verifyOnPage(page)

    await expect(homePage.header).toBeVisible()
    await expect(homePage.header).toHaveText('This site is under construction...')
    await expect(homePage.sideNav).toContainText('ROSH Screening')
    await expect(homePage.formContent).toHaveText("What you'll need")

    const timestamp = page.getByTestId('timestamp')
    await expect(timestamp).toBeVisible()
    await expect(timestamp).toContainText('The time is currently')
  })
})
