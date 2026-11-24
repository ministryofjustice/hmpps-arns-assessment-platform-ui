import { test } from '../../../support/fixtures'
import ConfirmRemoveGoalPage from '../../../pages/sentencePlan/confirmRemoveGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('View Remove a Goal confirmation', () => {
  test('visiting confirm remove page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(activeGoalWithSteps())
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmRemoved(goalUuid))
    await ConfirmRemoveGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_CONFIRM_GOAL_REMOVED)
    expectAuditEvent(event, goalUuid)
  })
})
