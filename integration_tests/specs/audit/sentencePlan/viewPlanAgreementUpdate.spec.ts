import { test } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Update Agreement Page', () => {
  test('visiting update agreement page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({
      plan: builder =>
        builder.withGoals(currentGoalsWithCompletedSteps(1))
          .withAgreementStatus('COULD_NOT_ANSWER'),
    })

    await page.goto(sentencePlanV1URLs.PLAN_UPDATE_AGREE)
    await UpdateAgreePlanPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_PLAN_AGREEMENT_UPDATE)
    expectAuditEvent(event)
  })
})
