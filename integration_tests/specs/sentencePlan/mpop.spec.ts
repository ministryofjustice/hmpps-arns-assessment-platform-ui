import { expect, type Page } from '@playwright/test'
import { login } from 'testUtils'
import fs from 'fs'
import PlanHistoryPage from '../../pages/sentencePlan/planHistoryPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import { test, TargetService } from '../../support/fixtures'
import { sentencePlanV1URLs } from './sentencePlanUtils'

const returnToOasysButton = (page: Page) => page.getByRole('button', { name: 'Return to OASys' })

const navigateToMpopPrivacyScreen = async (page: Page, crn: string): Promise<PrivacyScreenPage> => {
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
  await expect(page).toHaveURL(/\/privacy/)
  return PrivacyScreenPage.verifyOnPage(page)
}

test.describe('MPoP access flow', () => {
  test.describe('Privacy screen gating', () => {
    test.use({ storageState: undefined })
    test.beforeEach(async ({ page }) => {
      await login(page)
    })

    test('redirects back to privacy screen when navigating to plan overview before confirming privacy', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToMpopPrivacyScreen(page, crn)
      await expect(page.locator('.govuk-back-link')).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Return to OASys' })).toHaveCount(0)

      await page.goto(`${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`)

      await expect(page).toHaveURL(/\/privacy/)
      await PrivacyScreenPage.verifyOnPage(page)
    })
  })

  test.describe('After confirming privacy', () => {
    test.use({ storageState: fs.existsSync('.auth/mpop.json') ? '.auth/mpop.json' : undefined })

    test('shows Sign out link on plan overview', async ({ mpopUser }) => {
      await mpopUser.page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${mpopUser.crn}`)
      await expect(mpopUser.page).toHaveURL(/\/plan\/overview/)
      await PlanOverviewPage.verifyOnPage(mpopUser.page)

      await mpopUser.page.locator('.arns-common-header__user-menu-toggle').click()
      await expect(mpopUser.page.getByRole('link', { name: 'Sign out' })).toBeVisible()
    })

    test('does not show Return to OASys button', async ({ mpopUser }) => {
      await test.step('on plan overview', async () => {
        await mpopUser.page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${mpopUser.crn}`)
        await expect(mpopUser.page).toHaveURL(/\/plan\/overview/)
        await PlanOverviewPage.verifyOnPage(mpopUser.page)

        await expect(returnToOasysButton(mpopUser.page)).toHaveCount(0)
      })

      await test.step('on plan history', async () => {
        await mpopUser.page.goto(sentencePlanV1URLs.PLAN_HISTORY)

        await PlanHistoryPage.verifyOnPage(mpopUser.page)
        await expect(returnToOasysButton(mpopUser.page)).toHaveCount(0)
      })
    })
  })
})
