import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import AgreePlanPage from '../../../pages/sentencePlan/agreePlanPage'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Agree Plan Page', () => {
  test('visiting agree plan page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_AGREE)
    await AgreePlanPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_PLAN_AGREEMENT)
    expectAuditEvent(event)
  })
})
