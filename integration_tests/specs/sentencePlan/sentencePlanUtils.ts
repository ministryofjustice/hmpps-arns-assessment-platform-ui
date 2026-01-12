import { expect, Page } from '@playwright/test'
import { login } from '../../testUtils'

// sentence plan V1 URLs for use in playwright testing suits:
const sentencePlanV1 = '/forms/sentence-plan'
const oasysAccessStepPath = '/oasys'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal/:uuid'
const createGoalStepPath = '/add-goal/:areaOfNeed'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: sentencePlanV1 + oasysAccessStepPath, // '/forms/sentence-plan' + '/oasys'
  PLAN_OVERVIEW: sentencePlanV1 + planOverviewJourneyPath + planStepPath, // '/forms/sentence-plan' + '/plan' + '/overview'
  CREATE_GOAL: sentencePlanV1 + goalManagementJourneyPath + createGoalStepPath, // '/forms/sentence-plan/v1.0' + '/goal/:uuid' + '/add-goal/:areaOfNeed'
}

// Logs in via HMPPS Auth and navigates to the plan overview via the OASys entry point.
// This establishes the session with proper user context and assessment UUID.
export const loginAndNavigateToPlan = async (page: Page): Promise<void> => {
  await login(page)
  await page.goto(sentencePlanV1URLs.OASYS_ENTRY_POINT)
  await expect(page).toHaveURL(/\/plan\/overview/)
}

// returns date in DD/MM/YYYY format; can be used for mojDatePicker field
export const getDatePlusMonthsAsString = (months: number) => {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('en-GB')
}

/**
 * Extracts the assessment UUID from the page.
 * The UUID is exposed via a data attribute on the page for testing purposes.
 *
 * @param page Playwright page
 * @returns The assessment UUID
 * @throws Error if the UUID cannot be found
 */
export const getAssessmentUuid = async (page: Page): Promise<string> => {
  const uuid = await page.locator('[data-qa-assessment-uuid]').getAttribute('data-qa-assessment-uuid')
  if (!uuid) {
    throw new Error('Could not find assessment UUID on page. Ensure the page has loaded correctly.')
  }
  return uuid
}
