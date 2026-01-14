import { expect, Page } from '@playwright/test'
import { login } from '../../testUtils'

// sentence plan V1 URLs for use in playwright testing suits:
const sentencePlanFormPath = '/forms/sentence-plan'
const v1Path = '/v1.0'
const oasysAccessStepPath = '/oasys'
const crnAccessStepPath = '/crn'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: sentencePlanFormPath + oasysAccessStepPath, // '/forms/sentence-plan' + '/oasys'
  CRN_ENTRY_POINT: sentencePlanFormPath + crnAccessStepPath, // '/forms/sentence-plan/crn/:crn'
  PLAN_OVERVIEW: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planStepPath, // '/forms/sentence-plan' + '/v1.0' + '/plan' + '/overview'
  GOAL_MANAGEMENT_ROOT_PATH: sentencePlanFormPath + v1Path + goalManagementJourneyPath, // '/forms/sentence-plan' + '/v1.0' + '/goal'
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
