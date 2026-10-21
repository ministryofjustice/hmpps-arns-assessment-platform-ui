import { expect } from '@playwright/test'
import { TargetService, test } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeedsV2/sanUtils'
import { expectSanAuditEvent, onPage, SanAuditEvent } from './helpers'

test.describe("Selects 'Save and Continue' for each Criminogenic Needs question page", () => {
  test('saving a question page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByLabel('Settled').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(/accommodation-community-current-accommodation-settled/)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE, {
      additionalFilter: onPage('accommodation', 'community_current_accommodation'),
    })
    expectSanAuditEvent(event)
  })
})
