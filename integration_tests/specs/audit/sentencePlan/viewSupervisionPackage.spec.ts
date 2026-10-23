import { test } from '../../../support/fixtures'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { SentencePlanAuditEvent, expectAuditEvent } from './helpers'

test.describe('View Supervision Package Page', () => {
  test('visiting supervision package page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan()

    await page.goto(sentencePlanV1URLs.SUPERVISION_PACKAGE)

    const event = await auditQueue.waitForAuditEvent(crn, SentencePlanAuditEvent.VIEW_SUPERVISION_PACKAGE)
    expectAuditEvent(event)
  })
})
