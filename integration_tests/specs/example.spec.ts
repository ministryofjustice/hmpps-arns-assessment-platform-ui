import { expect, test } from '@playwright/test'
import exampleApi from '../mockApis/exampleApi'

import { login, resetStubs } from '../testUtils'
import ExamplePage from '../pages/examplePage'

test.describe('Example', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Time from exampleApi is visible on page', async ({ page }) => {
    await exampleApi.stubExampleTime()
    await login(page)

    const examplePage = await ExamplePage.verifyOnPage(page)

    await expect(examplePage.timestamp).toHaveText('The time is currently 2025-01-01T12:00:00Z')
    await expect(examplePage.sideNav).toContainText('ROSH Screening')
    await expect(examplePage.formContent).toHaveText("What you'll need")
  })

  test('ExampleApi failure shows error page', async ({ page }) => {
    await exampleApi.stubExampleTime(500)

    await login(page)

    // In production mode: "Something went wrong"
    // In development mode: shows actual error message (e.g., "Internal Server Error")
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('body')).toContainText(/Something went wrong|Internal Server Error|Error/)
  })
})
