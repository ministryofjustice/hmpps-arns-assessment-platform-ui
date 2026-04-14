import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe('Update agree plan - Navigation', () => {
  test.describe('access control', () => {
    test('redirects to plan overview when agreement status is not COULD_NOT_ANSWER', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            detailsCouldNotAnswer: 'Person was not available to discuss the plan',
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(sentencePlanV1URLs.PLAN_UPDATE_AGREE)

      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('with COULD_NOT_ANSWER status', () => {
    test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('COULD_NOT_ANSWER')
        .save()
      await navigateToSentencePlan(page, handoverLink)
    })

    test('can navigate to update agree-plan from plan history', async ({ page }) => {
      // Navigate to plan history
      await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
      await expect(planHistoryPage.updateAgreementLink).toBeVisible()
      await planHistoryPage.updateAgreementLink.click()

      await UpdateAgreePlanPage.verifyOnPage(page)
    })

    test('Go back link navigates to plan overview', async ({ page }) => {
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.updateAgreementLink.click()
      const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

      await updateAgreePlanPage.goBackLink.click()

      await PlanOverviewPage.verifyOnPage(page)
    })

    test('backlink points to plan overview when navigating from plan overview', async ({ page }) => {
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.updateAgreementLink.click()
      await UpdateAgreePlanPage.verifyOnPage(page)

      const backlink = page.locator('.govuk-back-link')
      await expect(backlink).toHaveAttribute('href', /overview\?type=current/)
    })

    test('backlink points to plan history when navigating from plan history', async ({ page }) => {
      // Navigate via plan history
      await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
      const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
      await planHistoryPage.updateAgreementLink.click()
      await UpdateAgreePlanPage.verifyOnPage(page)

      const backlink = page.locator('.govuk-back-link')
      await expect(backlink).toHaveAttribute('href', /plan-history/)
    })
  })
})
