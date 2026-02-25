import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import ConfirmRemoveGoalPage from '../../../pages/sentencePlan/confirmRemoveGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('View Remove a Goal confirmation', () => {
  test('visiting confirm remove page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(activeGoalWithSteps())
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmRemoved(goalUuid))
    await ConfirmRemoveGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CONFIRM_GOAL_REMOVED)
    expectAuditEvent(event, goalUuid)
  })
})
