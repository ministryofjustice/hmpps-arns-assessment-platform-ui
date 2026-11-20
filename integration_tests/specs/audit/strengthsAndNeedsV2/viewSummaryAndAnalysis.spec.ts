import { expect } from '@playwright/test'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { expectSanAuditEvent, markSectionComplete, onPage, SanAuditEvent, walkToFinanceSummary } from './helpers'

test.describe('Views Summary or Practitioner Analysis pages for each Criminogenic Needs section', () => {
  test('visiting the finance section summary page', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()
    await walkToFinanceSummary(page, handoverLink, sanAssessmentId)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_SECTION_SUMMARY, {
      additionalFilter: onPage(Section.finance.code, Step.finance_summary.code),
    })
    expectSanAuditEvent(event)
  })

  test('visiting the finance practitioner analysis page', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()
    await walkToFinanceSummary(page, handoverLink, sanAssessmentId)
    await markSectionComplete(page)
    await expect(page).toHaveURL(/finance-analysis/)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, {
      additionalFilter: onPage(Section.finance.code, Step.finance_analysis.code),
    })
    expectSanAuditEvent(event)
  })
})
