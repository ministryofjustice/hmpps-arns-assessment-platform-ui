import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import {
  expectSanAuditEvent,
  financeAnswers,
  inSection,
  markSectionComplete,
  SanAuditEvent,
  walkToFinanceSummary,
} from './helpers'

test.describe("Selects 'Mark as Complete' for each Criminogenic Needs section", () => {
  test('marking a section complete', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(financeAnswers).save()

    await walkToFinanceSummary(page, handoverLink)
    await markSectionComplete(page)
    await expect(page).toHaveURL(/finance-analysis/)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.MARK_SECTION_COMPLETE, {
      additionalFilter: inSection('finance'),
    })
    expectSanAuditEvent(event)
  })
})
