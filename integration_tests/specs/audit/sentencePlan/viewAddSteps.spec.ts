import { test } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import { sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Add or Change Steps', () => {
  test('visiting add steps page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn, plan } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoals(1)),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    await AddStepsPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_ADD_STEPS)
    expectAuditEvent(event, goalUuid)
  })
})
