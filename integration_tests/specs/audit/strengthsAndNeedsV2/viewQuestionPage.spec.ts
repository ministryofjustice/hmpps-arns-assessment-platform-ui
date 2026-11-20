import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { Step as FinanceStep } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { TargetService, test } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeedsV2/sanUtils'
import { expectSanAuditEvent, navigateToFinanceIncome, onPage, SanAuditEvent } from './helpers'

test.describe('Views Question pages for each Criminogenic Needs section', () => {
  test('visiting a question page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToStrengthsAndNeeds(page, handoverLink)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
      additionalFilter: onPage(Section.accommodation.code, Step.community_current_accommodation.code),
    })
    expectSanAuditEvent(event)
  })
  test('records the finance section and page separately', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    auditQueue,
  }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToFinanceIncome(page, handoverLink, sanAssessmentId)
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.VIEW_QUESTION_PAGE, {
      additionalFilter: onPage(Section.finance.code, FinanceStep.finance_income.code),
    })
    expectSanAuditEvent(event)
  })
})
