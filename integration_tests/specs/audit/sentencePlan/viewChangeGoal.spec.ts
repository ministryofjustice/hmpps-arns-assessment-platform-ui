import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import ChangeGoalPage from '../../../pages/sentencePlan/changeGoalPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Change a Goal page', () => {
  test('visiting change goal page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalChange(goalUuid))
    await ChangeGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_CHANGE_GOAL)
    expectAuditEvent(event, goalUuid)
  })
})
