import { test } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('View Update Goal and Steps page', () => {
  test('visiting update goal and steps page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))
    await UpdateGoalAndStepsPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_UPDATE_GOAL_AND_STEPS)
    expectAuditEvent(event, goalUuid)
  })
})
