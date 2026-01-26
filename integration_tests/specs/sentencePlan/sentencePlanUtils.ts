import { expect, Page } from '@playwright/test'
import { login } from '../../testUtils'
import { AgreementStatus } from '../../../server/forms/sentence-plan/effects'

// Statuses that indicate a plan has been through the agreement process (not draft)
export const postAgreementProcessStatuses: AgreementStatus[] = ['AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER']

// Statuses for step to choose from in dropdown
export const stepStatusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANNOT_BE_DONE_YET', 'NO_LONGER_NEEDED']

// sentence plan V1 URLs for use in playwright testing suits:
const sentencePlanFormPath = '/sentence-plan'
const accessFormPath = '/access'
const v1Path = '/v1.0'
const oasysAccessStepPath = '/oasys'
const crnAccessStepPath = '/crn'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: `${accessFormPath}/sentence-plan${oasysAccessStepPath}`, // '/access/sentence-plan/oasys'
  CRN_ENTRY_POINT: `${accessFormPath}/sentence-plan${crnAccessStepPath}`, // '/access/sentence-plan/crn/:crn'
  PLAN_OVERVIEW: sentencePlanFormPath + v1Path + planOverviewJourneyPath + planStepPath, // '/sentence-plan' + '/v1.0' + '/plan' + '/overview'
  GOAL_MANAGEMENT_ROOT_PATH: sentencePlanFormPath + v1Path + goalManagementJourneyPath, // '/sentence-plan' + '/v1.0' + '/goal'
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
