import { test } from '../../support/fixtures'
import LoginPage from '../../pages/tieringAssessment/loginPage'
import { tieringAssessmentV1URLs } from './tieringAssessmentUtils'
import StartTieringAssessmentPage from '../../pages/tieringAssessment/static/startTieringAssessmentPage'

test.describe('Enter first page', () => {
  test('shows start tiering assessment type', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const setupPage = new StartTieringAssessmentPage(page)

    await page.goto(tieringAssessmentV1URLs.LOGIN)
    await loginPage.checkLoginPageLoaded()
    await loginPage.fillUsernameTextbox()
    await loginPage.fillPasswordTextbox()
    await loginPage.clickSigninButton()
    await setupPage.checkStartPageLoaded()
  })
})
