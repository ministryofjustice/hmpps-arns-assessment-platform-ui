import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/question'
import { expect, Page } from '@playwright/test'
import type { AuditMessage } from '../../../support/AuditQueueClient'
import { handlePrivacyScreenIfPresent } from '../../strengthsAndNeeds/sanUtils'

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
    expect(event.details.formVersion).toBe('v1.0')
  }
  if (expectAssessmentUuid) {
    expect(event.details.assessmentUuid).toBeDefined()
  }
}

/**
 * Finances is the shortest section, so helper targets it
 */
export const financeAnswers = [
  { question: Question.finance_income, value: [Option.employment] },
  { question: Question.finance_bank_account, value: CommonOption.yes },
  { question: Question.finance_money_management, value: Option.good },
  { question: Question.finance_money_management_good_details, value: 'Manages money well.' },
  { question: Question.finance_gambling, value: [CommonOption.no] },
  { question: Question.finance_debt, value: [CommonOption.no] },
  { question: Question.finance_changes, value: CommonOption.made_changes },
  { question: Question.finance_changes_made_changes_details, value: 'Has made changes.' },
]

/**
 * Nav from the handover to finances summary the way a practitioner would.
 */
export const walkToFinanceSummary = async (
  page: Page,
  handoverLink: string,
  sanAssessmentId: string,
): Promise<void> => {
  await page.goto(handoverLink)
  await handlePrivacyScreenIfPresent(page)
  await page.goto(`/strengths-and-needs/v1.0/edit/${sanAssessmentId}/finances/finance`)
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
