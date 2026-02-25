import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToPrivacyScreen } from '../../sentencePlan/sentencePlanUtils'
import { AuditEvent, expectAuditEvent } from './helpers'

test.describe('Selects tick box and Confirm button on Privacy Screen page', () => {
  test('confirming privacy screen', async ({ page, createSession, sentencePlanBuilder, auditQueue }) => {
    const { sentencePlanId, crn, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    const privacyPage = await navigateToPrivacyScreen(page, handoverLink)
    await privacyPage.confirmAndContinue()
    await expect(page).toHaveURL(/\/plan\/overview/)

    const event = await auditQueue.waitForAuditEvent(crn, AuditEvent.CONFIRM_PRIVACY_SCREEN)
    expectAuditEvent(event, undefined, { expectAssessmentUuid: false, expectFormVersion: false })
  })
})
