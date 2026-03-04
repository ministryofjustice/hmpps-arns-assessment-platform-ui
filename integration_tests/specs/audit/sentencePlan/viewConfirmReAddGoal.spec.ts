import { test, TargetService } from '../../../support/fixtures'
import { removedGoals } from '../../../builders/sentencePlanFactories'
import ConfirmReaddGoalPage from '../../../pages/sentencePlan/confirmReaddGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Add a goal back to plan confirmation', () => {
  test('visiting confirm re-add page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(removedGoals(1))
      .withAgreementStatus('AGREED')
      .save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalConfirmReAdd(goalUuid))
    await ConfirmReaddGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CONFIRM_RE_ADD_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
