import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { expectAuditEvent } from './helpers'

test.describe('View Change a Goal page', () => {
  test('visiting change goal page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
    await ChangeGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CHANGE_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
