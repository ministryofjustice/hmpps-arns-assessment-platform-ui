import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeeds/sanUtils'
import { expectSanAuditEvent, SanAuditEvent } from './helpers'

test.describe('Views View All Answers page', () => {
  test('visiting view all answers', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByRole('link', { name: 'View all answers' }).click()

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_ALL_ANSWERS)
    expectSanAuditEvent(event)
  })
})
