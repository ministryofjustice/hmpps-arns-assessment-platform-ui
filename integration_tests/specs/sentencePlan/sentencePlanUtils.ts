import { expect, Page } from '@playwright/test'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import { AgreementStatus } from '../../../server/forms/sentence-plan/effects'

// Statuses that indicate a plan has been through the agreement process (not draft)
// Note: UPDATED_AGREED and UPDATED_DO_NOT_AGREE are only valid as follow-up statuses
// after COULD_NOT_ANSWER, so they can't be used standalone with withAgreementStatus()
export const postAgreementProcessStatuses: AgreementStatus[] = ['AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER']

// Statuses for step to choose from in dropdown
export const stepStatusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANNOT_BE_DONE_YET', 'NO_LONGER_NEEDED']

// sentence plan V1 URLs for use in playwright testing suits:
const sentencePlanFormPath = '/sentence-plan'
const accessFormPath = '/access'
const v1Path = '/v1.0'
const oasysAccessStepPath = '/oasys'
const crnAccessStepPath = '/crn'
const privacyStepPath = '/privacy'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal'
const planHistoryPath = '/plan-history'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: `${accessFormPath}/sentence-plan${oasysAccessStepPath}`, // '/access/sentence-plan/oasys'
  CRN_ENTRY_POINT: `${accessFormPath}/sentence-plan${crnAccessStepPath}`, // '/access/sentence-plan/crn/:crn'
  PRIVACY_SCREEN: `${sentencePlanFormPath}/${privacyStepPath}`, // '/sentence-plan/privacy'
  PLAN_OVERVIEW: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planStepPath, // '/sentence-plan' + '/v1.0' + '/plan' + '/overview'
  PLAN_HISTORY: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planHistoryPath, // '/sentence-plan' + '/v1.0' + '/plan' + '/plan-history'
  GOAL_MANAGEMENT_ROOT_PATH: sentencePlanFormPath + v1Path + goalManagementJourneyPath, // '/sentence-plan' + '/v1.0' + '/goal'
}

/**
 * Handles the privacy screen if it appears, confirming and continuing.
 */
export const handlePrivacyScreenIfPresent = async (page: Page): Promise<void> => {
  if (page.url().includes('/privacy')) {
    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()
  }
}

/**
 * Navigates to a sentence plan via handover link and handles the privacy screen.
 * Use this for tests that need to get to the plan overview via OASys handover.
 */
export const navigateToSentencePlan = async (page: Page, handoverLink: string): Promise<void> => {
  await page.goto(handoverLink)
  await handlePrivacyScreenIfPresent(page)
  await expect(page).toHaveURL(/\/plan\/overview/)
}

/**
 * Navigates to a sentence plan via handover link, stopping at the privacy screen.
 * Use this for tests that need to test the privacy screen itself.
 * Returns the PrivacyScreenPage for further interactions.
 */
export const navigateToPrivacyScreen = async (page: Page, handoverLink: string): Promise<PrivacyScreenPage> => {
  await page.goto(handoverLink)
  await expect(page).toHaveURL(/\/privacy/)
  return PrivacyScreenPage.verifyOnPage(page)
}

// returns date in DD/MM/YYYY format; can be used for mojDatePicker field
export const getDatePlusMonthsAsString = (months: number) => {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('en-GB')
}

/** Returns an ISO date string for a date N days from now. Useful for goal target dates in tests. */
export const getDatePlusDaysAsISO = (days: number): string => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}
