import { test, TargetService } from '../../../support/fixtures'
import SelectAreaOfNeedPage from '../../../pages/sentencePlan/selectAreaOfNeedPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('View Select Area of Need page', () => {
  test('visiting select area of need page', async ({ page, createSession, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalSelectAreaOfNeed())
    await SelectAreaOfNeedPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_SELECT_AREA_OF_NEED)
    expectAuditEvent(event)
  })
})
