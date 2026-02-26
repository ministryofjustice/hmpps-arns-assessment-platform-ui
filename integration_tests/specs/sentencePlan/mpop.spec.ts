import { expect, type Page } from '@playwright/test'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import { test, TargetService } from '../../support/fixtures'
import { login } from '../../testUtils'
import { sentencePlanV1URLs } from './sentencePlanUtils'

const returnToOasysButton = (page: Page) => page.getByRole('button', { name: 'Return to OASys' })

const navigateToMpopPrivacyScreen = async (page: Page, crn: string): Promise<PrivacyScreenPage> => {
  await login(page)
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
  await expect(page).toHaveURL(/\/privacy/)
  return PrivacyScreenPage.verifyOnPage(page)
}

const navigateToPlanOverviewViaMpop = async (page: Page, crn: string): Promise<void> => {
  const privacyScreenPage = await navigateToMpopPrivacyScreen(page, crn)
  await privacyScreenPage.confirmAndContinue()

  await expect(page).toHaveURL(/\/plan\/overview/)
  await PlanOverviewPage.verifyOnPage(page)
}

test.describe('MPoP access flow', () => {
  test.describe('Privacy screen gating', () => {
    test('does not show OASys navigation links on privacy screen', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToMpopPrivacyScreen(page, crn)

      await expect(page.locator('.govuk-back-link')).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Return to OASys' })).toHaveCount(0)
    })

    test('redirects back to privacy screen when navigating to plan overview before confirming privacy', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToMpopPrivacyScreen(page, crn)
      await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

      await expect(page).toHaveURL(/\/privacy/)
      await PrivacyScreenPage.verifyOnPage(page)
    })
  })

  test.describe('After confirming privacy', () => {
    test('shows Sign out link on plan overview', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await page.locator('.arns-common-header__user-menu-toggle').click()
      await expect(page.getByRole('link', { name: 'Sign out' })).toBeVisible()
    })

    test('does not show Return to OASys button on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPlanOverviewViaMpop(page, crn)

      await expect(returnToOasysButton(page)).toHaveCount(0)
    })

    test('does not show Return to OASys button on plan history', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withAgreementStatus('AGREED').save()

      await navigateToPlanOverviewViaMpop(page, crn)
      await page.goto(sentencePlanV1URLs.PLAN_HISTORY)

      await PlanHistoryPage.verifyOnPage(page)
      await expect(returnToOasysButton(page)).toHaveCount(0)
    })
  })
})
