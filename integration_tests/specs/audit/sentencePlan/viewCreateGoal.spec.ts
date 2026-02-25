import { expect } from '@playwright/test'
import { AuditEvent } from '@server/services/auditService'
import { test, TargetService } from '../../../support/fixtures'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders } from '../../sentencePlan/sentencePlanUtils'
import { expectAuditEvent } from './helpers'

test.describe('View Create a Goal page', () => {
  test('visiting create goal page', async ({ page, createSession, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1UrlBuilders.goalCreate('accommodation'))
    await CreateGoalPage.verifyOnPage(page)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.VIEW_CREATE_GOAL)
    expectAuditEvent(event)
    expect(event.details.areaOfNeed).toBe('accommodation')
  })
})
