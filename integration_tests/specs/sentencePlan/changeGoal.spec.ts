import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ChangeGoalPage from '../../pages/sentencePlan/changeGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoals, futureGoals } from '../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  buildPageTitle,
  getDatePlusMonthsAsString,
  navigateToSentencePlan,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Change goal journey', () => {
  test.describe('current goal workflow', () => {
    test('can access change goal page directly', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      // ensure page title is correct
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.changeGoal))

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)
      expect(changeGoalPage).toBeTruthy()
    })

    test('form is pre-populated with existing goal data', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Check the goal title is pre-populated
      const goalTitle = await changeGoalPage.getGoalTitle()
      expect(goalTitle).toBe('Current Goal 1')

      // Check can start now is selected (since it's an ACTIVE goal)
      const canStartNow = await changeGoalPage.isCanStartNowSelected()
      expect(canStartNow).toBe(true)
    })

    test('can update goal title and verify change on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Update the goal title
      await changeGoalPage.setGoalTitle('Updated test goal title')
      await changeGoalPage.saveGoal()

      // Check user is redirected to plan overview with current goals
      await expect(page).toHaveURL(/plan\/overview.*type=current/)

      // Verify the updated title appears on plan overview
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const updatedGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(updatedGoalTitle).toContain('Updated test goal title')
    })

    test('can change goal from current to future and verify on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Change to a future goal
      await changeGoalPage.selectCanStartNow(false)
      await changeGoalPage.saveGoal()

      // Check user is redirected to the future goals tab
      await expect(page).toHaveURL(/type=future/)

      // Verify the goal now appears in future goals
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Current Goal 1')
    })

    test('changing goal from current to future clears target date', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Verify the current goal shows target date
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.goalCardHasTargetDateText(0)).toBe(true)

      // Navigate to change goal
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Change to a future goal
      await changeGoalPage.selectCanStartNow(false)
      await changeGoalPage.saveGoal()

      // Verify redirected to future goals tab
      await expect(page).toHaveURL(/type=future/)

      // Verify the goal card does NOT show "Aim to achieve this by" text
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.goalCardHasTargetDateText(0)).toBe(false)
    })

    test('can change target date option', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Change target date to 6 months
      await changeGoalPage.selectTargetDateOption('6_months')
      await changeGoalPage.saveGoal()

      // Verify we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('can set custom target date', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Select custom date option
      await changeGoalPage.selectTargetDateOption('custom')

      // Calculate a date 4 months in the future
      const target4MonthsDate = getDatePlusMonthsAsString(4)

      await changeGoalPage.setCustomTargetDate(target4MonthsDate)
      await changeGoalPage.saveGoal()

      // Check we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('can add related areas of need', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Select yes for related areas
      await changeGoalPage.selectIsRelatedToOtherAreas(true)

      // Select a related area
      await changeGoalPage.selectRelatedArea('finances')

      await changeGoalPage.saveGoal()

      // Check we're redirected to plan overview
      await expect(page).toHaveURL(/plan\/overview/)
    })

    test('related areas of need checkboxes are displayed in alphabetical order', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      await changeGoalPage.selectIsRelatedToOtherAreas(true)

      // get all checkbox labels for related areas of need
      const checkboxLabels = await page.locator('[name="related_areas_of_need"]').evaluateAll(checkboxes =>
        checkboxes.map(checkbox => {
          const label = document.querySelector(`label[for="${checkbox.id}"]`)

          return label?.textContent?.trim() ?? ''
        }),
      )

      // verify the labels are in alphabetical order
      const sortedLabels = [...checkboxLabels].sort((a, b) => a.localeCompare(b))
      expect(checkboxLabels).toEqual(sortedLabels)
    })

    test('redirects to current goals tab when saving an active goal', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Keep as active goal and save
      await changeGoalPage.selectCanStartNow(true)
      await changeGoalPage.selectTargetDateOption('3_months')
      await changeGoalPage.saveGoal()

      // Verify we're redirected to current goals tab
      await expect(page).toHaveURL(/type=current/)
    })
  })

  test.describe('validation', () => {
    test('shows error when goal title is empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Clear the goal title
      await changeGoalPage.setGoalTitle('')
      await changeGoalPage.saveGoal()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.changeGoal))

      // Check validation error is shown
      const hasError = await changeGoalPage.hasValidationError('goal_title')
      expect(hasError).toBe(true)
    })

    test('shows error when related areas not selected but yes chosen', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Select yes for related areas but don't select any
      await changeGoalPage.selectIsRelatedToOtherAreas(true)
      await changeGoalPage.saveGoal()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.changeGoal))

      // Check validation error is shown
      const hasError = await changeGoalPage.hasValidationError('related_areas_of_need')
      expect(hasError).toBe(true)
    })

    test('shows target date options for active goal', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Ensure can start now is selected as it is an active goal
      await changeGoalPage.selectCanStartNow(true)

      // Check target date options are visible for active goal
      await expect(changeGoalPage.targetDate3Months).toBeVisible()
    })
  })

  test.describe('future goal workflow', () => {
    test('can change future goal to current goal and verify on plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to future goals tab and click change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Future goals' }).click()
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Check the goal is pre-populated as a future goal
      const isFuture = await changeGoalPage.isCanStartNowFutureSelected()
      expect(isFuture).toBe(true)

      // Change to current goal
      await changeGoalPage.selectCanStartNow(true)
      await changeGoalPage.selectTargetDateOption('3_months')
      await changeGoalPage.saveGoal()

      // Check we're redirected to current goals tab
      await expect(page).toHaveURL(/type=current/)

      // Verify the goal now appears in current goals
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Future Goal 1')
    })

    test('future goal does not show target date options', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to future goals tab and click change goal
      await PlanOverviewPage.verifyOnPage(page)
      await page.getByRole('link', { name: 'Future goals' }).click()
      await page.getByRole('link', { name: 'Change goal' }).click()

      const changeGoalPage = await ChangeGoalPage.verifyOnPage(page)

      // Check target date options are not visible for future goal
      await expect(changeGoalPage.targetDate3Months).not.toBeVisible()
    })
  })
})
