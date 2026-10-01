import { test } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import ConfirmReaddGoalPage from '../../../pages/sentencePlan/confirmReaddGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Add a goal back to plan confirmation', () => {
  test('visiting confirm re-add page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(removedGoals(1))
          .withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmReAdd(goalUuid))
    await ConfirmReaddGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CONFIRM_RE_ADD_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
