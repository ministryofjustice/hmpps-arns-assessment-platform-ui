import { Page } from '@playwright/test'

// sentence plan V1 URLs for use in playwright testing suits:
const sentencePlanV1 = '/forms/sentence-plan/v1.0'
const oasysAccessStepPath = '/oasys'
const planOverviewJourneyPath = '/plan'
const planStepPath = '/overview'
const goalManagementJourneyPath = '/goal/:uuid'
const createGoalStepPath = '/add-goal/:areaOfNeed'

export const sentencePlanV1URLs = {
  OASYS_ENTRY_POINT: sentencePlanV1 + oasysAccessStepPath, // '/forms/sentence-plan/v1.0' + '/oasys'
  PLAN_OVERVIEW: sentencePlanV1 + planOverviewJourneyPath + planStepPath, // '/forms/sentence-plan/v1.0' + '/plan' + '/overview'
  CREATE_GOAL: sentencePlanV1 + goalManagementJourneyPath + createGoalStepPath, // '/forms/sentence-plan/v1.0' + '/goal/:uuid' + '/add-goal/:areaOfNeed'
}

// TODO: add create assessment util function (currently these are stubs)

// TODO: move to createGoal utils file:
export const createTestGoal = async (page: Page) => {
  await page.goto(sentencePlanV1URLs.CREATE_GOAL)
  await page.locator('#goal_title-autocomplete').fill('Test goal for accommodation')
  await page.locator('input[id="is_related_to_other_areas-2"][value="no"]').check()
  await page.locator('input[id="can_start_now"][value="yes"]').check()
  await page.locator('input[id="target_date_option-2"][value="date_in_6_months"]').check()
  await page.getByRole('button', { name: 'Save without steps' }).click()
  await page.goto(sentencePlanV1URLs.PLAN_OVERVIEW)
}
// TODO: merge/add login(OASys function by Nic) for sentence plan utils
