import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Delete Goal page', () => {
  test('visiting delete goal page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalConfirmDelete(goalUuid))

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_DELETE_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
