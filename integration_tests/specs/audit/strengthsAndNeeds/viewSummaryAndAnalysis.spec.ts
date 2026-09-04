import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import {
  expectSanAuditEvent,
  financeAnswers,
  markSectionComplete,
  onPage,
  SanAuditEvent,
  walkToFinanceSummary,
} from './helpers'

test.describe('View Summary or Practitioner Analysis pages for each Criminogenic Needs section', () => {
  test('visiting a section summary page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(financeAnswers).save()

    await walkToFinanceSummary(page, handoverLink)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_SECTION_SUMMARY, {
      additionalFilter: onPage('finance', 'finance_summary'),
    })
    expectSanAuditEvent(event)
  })

  test('visiting a practitioner analysis page', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(financeAnswers).save()

    await walkToFinanceSummary(page, handoverLink)
    await markSectionComplete(page)
    await expect(page).toHaveURL(/finance-analysis/)

    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, {
      additionalFilter: onPage('finance', 'finance_analysis'),
    })
    expectSanAuditEvent(event)
  })
})
