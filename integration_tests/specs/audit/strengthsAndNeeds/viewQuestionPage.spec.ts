import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeeds/sanUtils'
import { expectSanAuditEvent, onPage, SanAuditEvent } from './helpers'

test.describe('Views Question pages for each Criminogenic Needs section', () => {
  test('visiting a question page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
      additionalFilter: onPage('accommodation', 'current_accommodation'),
    })
    expectSanAuditEvent(event)
  })

  test('records the section and page of each question page separately', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto('/strengths-and-needs/v1.0/finances/finance')

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
      additionalFilter: onPage('finance', 'finance'),
    })
    expectSanAuditEvent(event)
  })
})
