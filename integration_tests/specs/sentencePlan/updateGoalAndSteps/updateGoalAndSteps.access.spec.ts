import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { postAgreementProcessStatuses, sentencePlanV1UrlBuilders } from '../sentencePlanUtils'

test.describe('Update goal and steps page - access control', () => {
  test('redirects to plan overview when plan is not agreed', async ({ page, openSentencePlan }) => {
    // create a plan with 'DRAFT' agreement status
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    // try to access update-goal-steps page directly
    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

    // should be redirected to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
  })

  for (const agreedPlanStatus of postAgreementProcessStatuses) {
    test(`allows access when plan status is ${agreedPlanStatus}`, async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoals(1))
            .withAgreementStatus(agreedPlanStatus),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

      // should be on the update-goal-steps page
      await UpdateGoalAndStepsPage.verifyOnPage(page)
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))
    })
  }

  test('redirects to plan overview when goal does not exist', async ({ page, openSentencePlan }) => {
    await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)).withAgreementStatus('AGREED'),
    })

    // try to access with a non-existent goal UUID
    const nonExistentUuid = '00000000-0000-0000-0000-000000000000'
    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(nonExistentUuid))

    // should be redirected to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
  })
})
