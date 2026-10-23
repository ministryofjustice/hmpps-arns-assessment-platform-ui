import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import AgreePlanPage from '../../../pages/sentencePlan/agreePlanPage'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Agree Plan Page', () => {
  test('visiting agree plan page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
    })

    await page.goto(sentencePlanV1URLs.PLAN_AGREE)
    await AgreePlanPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_AGREEMENT)
    expectAuditEvent(event)
  })
})
