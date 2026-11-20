import { expect } from '@playwright/test'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { Step as FinanceStep } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { TargetService, test } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../strengthsAndNeedsV2/sanUtils'
import { expectSanAuditEvent, navigateToFinanceIncome, onPage, SanAuditEvent } from './helpers'

test.describe("Selects 'Save and Continue' for each Criminogenic Needs question page", () => {
  test('saving a question page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(new RegExp(Step.community_current_accommodation_settled.path))
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE, {
      additionalFilter: onPage(Section.accommodation.code, Step.community_current_accommodation.code),
    })
    expectSanAuditEvent(event)
  })

  test('saving the finance income page', async ({ page, createSession, strengthsAndNeedsBuilder, auditQueue }) => {
    const { crn, handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()
    await navigateToFinanceIncome(page, handoverLink, sanAssessmentId)
    await page.getByLabel('Employment').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveURL(new RegExp(FinanceStep.finance_concerns.path))
    const event = await auditQueue.waitForAuditEvent(crn, SanAuditEvent.SAVE_QUESTION_PAGE, {
      additionalFilter: onPage(Section.finance.code, FinanceStep.finance_income.code),
    })
    expectSanAuditEvent(event)
  })
})
