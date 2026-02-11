import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('READ_ONLY Access Mode', () => {
  test.describe('Plan Created Message', () => {
    test('shows plan creation date with View plan history link', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      const planCreatedMessage = page.getByText(/Plan created on/i)
      await expect(planCreatedMessage).toBeVisible()

      // The "View plan history" link should be present in the plan created message
      const viewHistoryLink = page.getByRole('link', { name: /View plan history/i })
      await expect(viewHistoryLink).toBeVisible()
    })
  })

  test.describe('Empty Plan State', () => {
    test('shows simplified no goals message without action links', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
        accessMode: 'READ_ONLY',
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Should show the no goals message
      await expect(planOverviewPage.noGoalsMessage).toBeVisible()

      // Should NOT show "create a goal" link
      await expect(planOverviewPage.createGoalLink).not.toBeVisible()
    })
  })
})
