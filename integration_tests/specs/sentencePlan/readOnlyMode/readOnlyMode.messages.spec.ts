import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import {} from '../sentencePlanUtils'

test.describe('READ_ONLY Access Mode', () => {
  test.describe('Plan Created Message', () => {
    test('shows plan creation date with View plan history link', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder => builder.withGoals(currentGoals(1)).withAgreementStatus('AGREED'),
      })

      const agreedMessage = page.getByText(/agreed to their plan on/i)
      await expect(agreedMessage).toBeVisible()

      // The "View plan history" link should be present in the agreed message
      const viewHistoryLink = page.getByRole('link', { name: /View plan history/i })
      await expect(viewHistoryLink).toBeVisible()
    })

    test('hides update agreement link', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder => builder.withGoals(currentGoals(1)).withAgreementStatus('AGREED'),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.updateAgreementLink).not.toBeVisible()
    })
  })

  test.describe('Empty Plan State', () => {
    test('shows simplified no goals message without action links', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ session: { planAccessMode: 'READ_ONLY' } })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Should show the no goals message
      await expect(planOverviewPage.noGoalsMessage).toBeVisible()

      // Should NOT show "create a goal" link
      await expect(planOverviewPage.createGoalLink).not.toBeVisible()
    })
  })
})
