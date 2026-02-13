import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, postAgreementProcessStatuses, sentencePlanV1URLs } from '../sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'

test.describe('Update goal and steps page - access control', () => {
  test('redirects to plan overview when plan is not agreed', async ({ page, createSession, sentencePlanBuilder }) => {
    // create a plan with 'DRAFT' agreement status
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)

    // try to access update-goal-steps page directly
    await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

    // should be redirected to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
  })

  for (const agreedPlanStatus of postAgreementProcessStatuses) {
    test(`allows access when plan status is ${agreedPlanStatus}`, async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus(agreedPlanStatus)
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // should be on the update-goal-steps page
      await UpdateGoalAndStepsPage.verifyOnPage(page)
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`,
      )
    })
  }

  test('redirects to plan overview when goal does not exist', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).withAgreementStatus('AGREED').save()

    await navigateToSentencePlan(page, handoverLink)

    // try to access with a non-existent goal UUID
    const nonExistentUuid = '00000000-0000-0000-0000-000000000000'
    await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${nonExistentUuid}${updateGoalAndStepsPath}`)

    // should be redirected to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
  })
})
