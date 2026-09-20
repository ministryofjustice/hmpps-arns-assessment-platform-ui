import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeAreaOfNeedPage from '../../../pages/sentencePlan/changeAreaOfNeedPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Change Area of Need page', () => {
  test('visiting change area of need page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
    const goalUuid = plan.goals[0].uuid

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))
    await ChangeAreaOfNeedPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CHANGE_AREA_OF_NEED)
    expectAuditEvent(event, goalUuid)
  })
})
