import { expect, Page } from '@playwright/test'
import { basePath, formVersion } from '@server/forms/strengths-and-needs/versions/v2.0/constants/formVersion'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/step'
import { Section } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import FinancesPage from '../../../pages/strengthsAndNeedsV2/financesPage'
import { handlePrivacyScreenIfPresent } from '../../strengthsAndNeeds/sanUtils'
import type { AuditMessage } from '../../../support/AuditQueueClient'

export { CommonAuditEvent, SanAuditEvent } from '../auditEvents'

export const onPage = (section: string, page: string) => (message: AuditMessage) =>
  message.details.section === section && message.details.page === page

export const inSection = (section: string) => (message: AuditMessage) => message.details.section === section

/** Assert the common audit fields not already verified by waitForAuditEvent (which checks crn + eventName). */
export function expectSanAuditEvent(
  event: AuditMessage,
  { expectAssessmentUuid = true, expectFormVersion = true } = {},
) {
  expect(event.when).toBeDefined()
  expect(event.who).not.toBe('unknown')
  expect(event.subjectType).toBe('CRN')
  expect(event.correlationId).not.toBe('unknown')
  expect(event.service).toBeDefined()
  expect(event.details.form).toBe('strengths-and-needs')
  if (expectFormVersion) {
    expect(event.details.formVersion).toBe(formVersion)
  }
  if (expectAssessmentUuid) {
    expect(event.details.assessmentUuid).toBeDefined()
  }
}

/** Opens the first question page in the finance section via the OASys handover. */
export const navigateToFinanceIncome = async (
  page: Page,
  handoverLink: string,
  sanAssessmentId: string,
): Promise<void> => {
  await page.goto(handoverLink)
  await handlePrivacyScreenIfPresent(page)
  await page.goto(`${basePath}/edit/${sanAssessmentId}/current${Section.finance.path}/${Step.finance_income.path}`)
}

/**
 * Nav from the handover to the finance-income page (first step of v2 Finance),
 * then save through each step to reach the finance-summary page.
 *
 * v2 Finance page order (shortest path, no family_or_friends income):
 *   1. finance-income      → Save and continue
 *   2. finance-concerns    → answer Yes → Save and continue
 *   3. finance-money-management → Save and continue
 *   4. finance-changes     → Save and continue  (debt = no skips debt-type page)
 *   → finance-summary
 */
export const walkToFinanceSummary = async (
  page: Page,
  handoverLink: string,
  sanAssessmentId: string,
): Promise<void> => {
  await navigateToFinanceIncome(page, handoverLink, sanAssessmentId)
  const financesPage = new FinancesPage(page)

  await financesPage.questions.finance_income.option(Option.employment).check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await expect(page).toHaveURL(new RegExp(Step.finance_concerns.path))
  await financesPage.questions.finance_concerns.option(CommonOption.yes).check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await expect(page).toHaveURL(new RegExp(Step.finance_money_management.path))
  await financesPage.questions.finance_money_management.option(Option.good).check()
  await financesPage.questions.finance_debt.option(CommonOption.no).check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await expect(page).toHaveURL(new RegExp(Step.finance_changes.path))
  await financesPage.questions.finance_changes.option(CommonOption.made_changes).check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await expect(page).toHaveURL(/finance-summary/)
}

/** Fill the practitioner analysis tab of a section summary and mark it complete. */
export const markSectionComplete = async (page: Page): Promise<void> => {
  await page.getByRole('tab', { name: 'Practitioner analysis' }).click()
  await page
    .getByRole('group', { name: /strengths or protective factors/i })
    .getByLabel('No')
    .check()
  await page
    .getByRole('group', { name: /risk of serious harm/i })
    .getByLabel('No')
    .check()
  await page
    .getByRole('group', { name: /risk of reoffending/i })
    .getByLabel('No')
    .check()
  await page.getByRole('button', { name: 'Mark as complete' }).click()
}
