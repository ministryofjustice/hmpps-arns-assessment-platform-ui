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
  CRN_ENTRY_POINT: `${sentencePlanV1}/crn`, // '/forms/sentence-plan/crn/:crn'
  PLAN_OVERVIEW: sentencePlanV1 + planOverviewJourneyPath + planStepPath, // '/forms/sentence-plan' + '/plan' + '/overview'
  CREATE_GOAL: sentencePlanV1 + goalManagementJourneyPath + createGoalStepPath, // '/forms/sentence-plan/v1.0' + '/goal/:uuid' + '/add-goal/:areaOfNeed'
}

/** Logs in and navigates to a sentence plan by CRN. */
export const loginAndNavigateToPlanByCrn = async (page: Page, crn: string): Promise<void> => {
  await login(page)
  await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
  await expect(page).toHaveURL(/\/plan\/overview/)
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
