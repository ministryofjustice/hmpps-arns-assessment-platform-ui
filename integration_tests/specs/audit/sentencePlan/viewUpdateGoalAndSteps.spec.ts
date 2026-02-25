import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { activeGoalWithSteps, expectAuditEvent } from './helpers'

test.describe('View Update Goal and Steps page', () => {
  test('visiting update goal and steps page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
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
    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))
    await UpdateGoalAndStepsPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_UPDATE_GOAL_AND_STEPS)
    expectAuditEvent(event, goalUuid)
  })
})
