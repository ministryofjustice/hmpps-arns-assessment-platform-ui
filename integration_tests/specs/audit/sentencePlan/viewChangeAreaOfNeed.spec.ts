import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeAreaOfNeedPage from '../../../pages/sentencePlan/changeAreaOfNeedPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Change Area of Need page', () => {
  test('visiting change area of need page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalChangeArea(goalUuid))
    await ChangeAreaOfNeedPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CHANGE_AREA_OF_NEED)
    expectAuditEvent(event, goalUuid)
  })
})
