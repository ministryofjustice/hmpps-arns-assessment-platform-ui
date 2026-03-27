import { expect, type Page } from '@playwright/test'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import { test, TargetService } from '../../support/fixtures'
import { login } from '../../testUtils'
import { sentencePlanV1URLs } from './sentencePlanUtils'

const returnToOasysButton = (page: Page) => page.getByRole('button', { name: 'Return to OASys' })

const navigateToMpopPrivacyScreen = async (page: Page, crn: string): Promise<PrivacyScreenPage> => {
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
  await expect(page).toHaveURL(/\/privacy/)
  return PrivacyScreenPage.verifyOnPage(page)
}

test.describe('MPoP access flow', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    await login(page)
    const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).withAgreementStatus('AGREED').save()

    await navigateToMpopPrivacyScreen(page, crn)
  })

  test('does not show OASys navigation links on privacy screen', async ({ page }) => {
    await expect(page.locator('.govuk-back-link')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Return to OASys' })).toHaveCount(0)
  })

  test('redirects back to privacy screen when navigating to plan overview before confirming privacy', async ({
    page,
  }) => {
    await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

    await expect(page).toHaveURL(/\/privacy/)
    await PrivacyScreenPage.verifyOnPage(page)
  })

  test('shows Sign out link and not return to oasys button', async ({ page }) => {
    const privacyScreenPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyScreenPage.confirmAndContinue()

    await page.locator('.arns-common-header__user-menu-toggle').click()
    await expect(page.getByRole('link', { name: 'Sign out' })).toBeVisible()
    await expect(returnToOasysButton(page)).toHaveCount(0)

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    await PlanHistoryPage.verifyOnPage(page)
    await expect(returnToOasysButton(page)).toHaveCount(0)
  })
})
