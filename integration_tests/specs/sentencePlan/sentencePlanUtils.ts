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
const sentencePlanFormPath = '/forms/sentence-plan'
const accessFormPath = '/forms/access'
const v1Path = '/v1.0'
const oasysAccessStepPath = '/oasys'
const crnAccessStepPath = '/crn'
const privacyStepPath = '/privacy'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal'
const planHistoryPath = '/plan-history'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: `${accessFormPath}/sentence-plan${oasysAccessStepPath}`, // '/forms/access/sentence-plan/oasys'
  CRN_ENTRY_POINT: `${accessFormPath}/sentence-plan${crnAccessStepPath}`, // '/forms/access/sentence-plan/crn/:crn'
  PRIVACY_SCREEN: `${sentencePlanFormPath}/${privacyStepPath}`, // '/forms/sentence-plan/privacy'
  PLAN_OVERVIEW: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planStepPath, // '/forms/sentence-plan' + '/v1.0' + '/plan' + '/overview'
  PLAN_HISTORY: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planHistoryPath, // '/forms/sentence-plan' + '/v1.0' + '/plan' + '/plan-history'
  GOAL_MANAGEMENT_ROOT_PATH: sentencePlanFormPath + v1Path + goalManagementJourneyPath, // '/forms/sentence-plan' + '/v1.0' + '/goal'
}

// Page titles for sentence plan - matches step.title or dynamicTitle values
export const sentencePlanPageTitles = {
  // Goal management
  createGoal: 'Create a goal',
  addSteps: 'Add or change steps',
  updateGoalAndSteps: 'Update goal and steps',
  changeGoal: 'Change goal',
  confirmDeleteGoal: 'Confirm you want to delete this goal',
  confirmAchievedGoal: 'Confirm they have achieved this goal',
  confirmIfAchieved: 'Confirm if they have achieved this goal',
  confirmRemoveGoal: 'Confirm you want to remove this goal',
  confirmReAddGoal: 'Confirm you want to add this goal back into the plan',
  viewAchievedGoal: 'View achieved goal',
  viewRemovedGoal: 'View removed goal',

  // Plan overview & agree plan
  planOverview: 'Plan',
  agreePlan: 'Do they agree to this plan?',
  updateAgreePlan: 'Do they agree?',

  // Plan history
  planHistory: 'Plan history',

  // Other
  privacy: 'Remember to close any other applications before starting an appointment',
  aboutPerson: 'About',
  previousVersions: 'Previous versions',
}

export const sentencePlanServiceName = 'Sentence plan'

// constructs page title:
export const buildPageTitle = (stepTitle: string, serviceName: string = sentencePlanServiceName): string =>
  `${stepTitle} - ${serviceName}`

// constructs page error title:
export const buildErrorPageTitle = (stepTitle: string, serviceName: string = sentencePlanServiceName): string =>
  `Error: ${buildPageTitle(stepTitle, serviceName)}`

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
