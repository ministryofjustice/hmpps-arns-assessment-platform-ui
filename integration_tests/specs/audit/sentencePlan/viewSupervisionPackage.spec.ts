import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Supervision Package Page', () => {
  test('visiting supervision package page', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_SUPERVISION_PACKAGE)
    expectAuditEvent(event)
  })
})
