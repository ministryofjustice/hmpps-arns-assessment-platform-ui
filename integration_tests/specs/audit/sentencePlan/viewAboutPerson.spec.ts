import { test } from '../../../support/fixtures'
import { sentencePlanV1URLs } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View About Page', () => {
  test('visiting about page', async ({ page, auditQueue, openSentencePlan }) => {
    const { crn } = await openSentencePlan({ session: { assessmentType: 'SAN_SP' } })

    await page.goto(sentencePlanV1URLs.ABOUT_PERSON)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_ABOUT_PERSON)
    expectAuditEvent(event)
  })
})
