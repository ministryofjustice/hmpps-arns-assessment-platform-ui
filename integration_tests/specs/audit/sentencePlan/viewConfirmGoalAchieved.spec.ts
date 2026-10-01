import { test } from '../../../support/fixtures'
import ConfirmAchievedGoalPage from '../../../pages/sentencePlan/confirmAchievedGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('View Mark Goal as achieved confirmation', () => {
  test('visiting confirm achieved page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmAchieved(goalUuid))
    await ConfirmAchievedGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CONFIRM_GOAL_ACHIEVED)
    expectAuditEvent(event, goalUuid)
  })
})
