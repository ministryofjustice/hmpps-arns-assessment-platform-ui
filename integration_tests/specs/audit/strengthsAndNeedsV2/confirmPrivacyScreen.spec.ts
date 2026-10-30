import { expect } from '@playwright/test'
import PrivacyScreenPage from 'pages/sentencePlan/privacyScreenPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { CommonAuditEvent, expectSanAuditEvent } from './helpers'

test.describe('Selects tick box and Confirm button on Privacy Screen page', () => {
  test('confirming the privacy screen', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await page.goto(handoverLink)
    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()
    await expect(page).toHaveURL(new RegExp(Step.community_current_accommodation.path))

    const event = await auditQueue.waitForAuditEvent(crn, CommonAuditEvent.CONFIRM_PRIVACY_SCREEN)
    expectSanAuditEvent(event, { expectAssessmentUuid: false, expectFormVersion: false })
  })
})
