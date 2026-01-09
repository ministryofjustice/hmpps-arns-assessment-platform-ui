import { expect, test } from '@playwright/test'
import { resetStubs } from '../../testUtils'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import aapApi, { createAssessmentWithCurrentGoals, createAssessmentWithFutureGoals } from '../../mockApis/aapApi'
import { getDatePlusMonthsAsString, loginAndNavigateToPlan } from './sentencePlanUtils'

test.describe('Change goal journey', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('current goal workflow', () => {
    test.beforeEach(async ({ page }) => {
      await aapApi.stubSentencePlanApis(createAssessmentWithCurrentGoals(1))
      await loginAndNavigateToPlan(page)
      await page.getByRole('link', { name: 'Change goal' }).click()
    })

    test('can access chang goal page directly', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(changeGoalPage).toBeTruthy()
    })

    test('form is pre-populated with existing goal data', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // check the goal title is pre-populated
      const goalTitle = await changeGoalPage.getGoalTitle()
      expect(goalTitle).toBe('Current Goal 1')

      // check can start now is selected
      const canStartNow = await changeGoalPage.isCanStartNowSelected()
      expect(canStartNow).toBe(true)
    })

    test('can update goal title', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // update the goal title
      await changeGoalPage.setGoalTitle('Updated test goal title')
      await changeGoalPage.saveGoal()

      // check user is redirected to plan overview with current goals
      await expect(page).toHaveURL(/plan\/overview.*type=current/)
    })

    test('can change goal from current to future', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // change to a future goal
      await changeGoalPage.selectCanStartNow(false)
      await changeGoalPage.saveGoal()

      // check user is redirected to the future goals tab
      await expect(page).toHaveURL(/type=future/)
    })

    test('can change target date option', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // change target date to 6 months
      await changeGoalPage.selectTargetDateOption('6_months')
      await changeGoalPage.saveGoal()

      // Verify we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('can set custom target date', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // select custom date option
      await changeGoalPage.selectTargetDateOption('custom')

      // calculate a date 4 months in the future:
      const target4MonthsDate = getDatePlusMonthsAsString(4)

      await changeGoalPage.setCustomTargetDate(target4MonthsDate)
      await changeGoalPage.saveGoal()

      // check we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('can add related areas of need', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // select yes for related areas:
      await changeGoalPage.selectIsRelatedToOtherAreas(true)

      // select a related area:
      await changeGoalPage.selectRelatedArea('finances')

      await changeGoalPage.saveGoal()

      // check we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('redirects to current goals tab when saving an active goal', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // keep as active goal and save
      await changeGoalPage.selectCanStartNow(true)
      await changeGoalPage.selectTargetDateOption('3_months')
      await changeGoalPage.saveGoal()

      // Verify we're redirected to current goals tab
      await expect(page).toHaveURL(/type=current/)
    })
  })

  test.describe('validation', () => {
    test.beforeEach(async ({ page }) => {
      await aapApi.stubSentencePlanApis(createAssessmentWithCurrentGoals(1))
      await loginAndNavigateToPlan(page)
      await page.getByRole('link', { name: 'Change goal' }).click()
    })

    test('shows error when goal title is empty', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // clear the goal title
      await changeGoalPage.setGoalTitle('')
      await changeGoalPage.saveGoal()

      // check validation error is shown
      const hasError = await changeGoalPage.hasValidationError('goal_title')
      expect(hasError).toBe(true)
    })

    test('shows error when related areas not selected but yes chosen', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // select yes for related areas but don't select any
      await changeGoalPage.selectIsRelatedToOtherAreas(true)
      await changeGoalPage.saveGoal()

      // check validation error is shown
      const hasError = await changeGoalPage.hasValidationError('related_areas_of_need')
      expect(hasError).toBe(true)
    })

    test('shows target date options for active goal', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // ensure can start now is selected as it is an active goal
      await changeGoalPage.selectCanStartNow(true)

      // check target date options are visible for active goal
      await expect(changeGoalPage.targetDate3Months).toBeVisible()
    })
  })

  test.describe('future goal workflow', () => {
    test.beforeEach(async ({ page }) => {
      await aapApi.stubSentencePlanApis(createAssessmentWithFutureGoals(1))
      await loginAndNavigateToPlan(page)
      await page.getByRole('link', { name: 'Future goals' }).click()
      await page.getByRole('link', { name: 'Change goal' }).click()
    })

    test('can change future goal to current goal', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // check the goal is pre-populated as a future goal
      const isFuture = await changeGoalPage.isCanStartNowFutureSelected()
      expect(isFuture).toBe(true)

      // change to current goal
      await changeGoalPage.selectCanStartNow(true)
      await changeGoalPage.selectTargetDateOption('3_months')
      await changeGoalPage.saveGoal()

      // check we're redirected to current goals tab
      await expect(page).toHaveURL(/type=current/)
    })

    test('future goal does not show target date options', async ({ page }) => {
      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // check target date options are not visible for future goal
      await expect(changeGoalPage.targetDate3Months).not.toBeVisible()
    })
  })
})
