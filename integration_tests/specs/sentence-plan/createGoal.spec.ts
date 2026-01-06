import { expect, test } from '@playwright/test'
import { loginAndNavigateToPlan, resetStubs } from '../../testUtils'
import aapApi from '../../mockApis/aapApi'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import AddStepsPage from '../../pages/sentencePlan/addStepsPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'

/**
 * Integration tests for the Create Goal journey
 *
 * Tests the full flow of creating a goal with and without steps,
 * including validation and conditional field behaviour.
 */
test.describe('Create Goal Journey', () => {
  test.beforeEach(async () => {
    // Set up all API stubs BEFORE any navigation
    await aapApi.stubSentencePlanApis()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('Create Goal with Steps', () => {
    test('can create a goal and add steps - happy path', async ({ page }) => {
      // Login via HMPPS Auth and navigate to plan overview
      // TODO: This is a temporary workaround until the handover/OASys stub is properly configured
      await loginAndNavigateToPlan(page)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Click create goal
      await planOverviewPage.clickCreateGoal()
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      // Fill in goal details
      await createGoalPage.enterGoalTitle('Find stable accommodation')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('date_in_3_months')

      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/add-steps/)

      await addStepsPage.enterStep(0, 'probation_practitioner', 'Contact housing services')

      await addStepsPage.clickSaveAndContinue()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('can add multiple steps to a goal', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)

      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Find stable accommodation')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('date_in_6_months')
      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await addStepsPage.enterStep(0, 'probation_practitioner', 'Contact housing services')

      await addStepsPage.clickAddStep()

      await addStepsPage.enterStep(1, 'person_on_probation', 'Attend housing appointment')

      await addStepsPage.clickSaveAndContinue()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('can remove a step when multiple exist', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)
      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await addStepsPage.enterStep(0, 'probation_practitioner', 'First step')
      await addStepsPage.clickAddStep()
      await addStepsPage.enterStep(1, 'person_on_probation', 'Second step')

      await addStepsPage.clickRemoveStep(0)

      await addStepsPage.clickSaveAndContinue()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })

  test.describe('Create Goal without Steps', () => {
    test('can save goal without adding steps', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Future accommodation goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)

      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('future goal redirects to future goals tab', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Future goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)
      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/type=future/)
    })

    test('current goal redirects to current goals tab', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Current goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('date_in_3_months')
      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/type=current/)
    })
  })

  test.describe('Goal with Related Areas', () => {
    test('can create goal with related areas of need', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Housing and employment goal')

      await createGoalPage.selectIsRelated(true)

      await createGoalPage.selectRelatedArea('employment-and-education')
      await createGoalPage.selectRelatedArea('finances')

      await createGoalPage.selectCanStartNow(false)
      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })

  test.describe('Validation', () => {
    test('shows error when goal title is empty', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)

      await createGoalPage.clickSaveWithoutSteps()

      const fieldError = page.locator('#goal_title-error')
      await expect(fieldError).toContainText('Select or enter what goal they should try to achieve')
    })

    test('shows error when can start now is not selected', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal')
      await createGoalPage.selectIsRelated(false)

      await createGoalPage.clickSaveWithoutSteps()

      const fieldError = page.locator('#can_start_now-error')
      await expect(fieldError).toBeVisible()
    })

    test('shows error when target date is required but not selected', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)

      await createGoalPage.clickSaveWithoutSteps()

      const fieldError = page.locator('#target_date_option-error')
      await expect(fieldError).toBeVisible()
    })
  })

  test.describe('Different Areas of Need', () => {
    const areasOfNeed = [
      'accommodation',
      'employment-and-education',
      'finances',
      'drug-use',
      'alcohol-use',
      'health-and-wellbeing',
      'personal-relationships-and-community',
      'thinking-behaviours-and-attitudes',
    ]

    for (const area of areasOfNeed) {
      test(`can create goal for ${area} area`, async ({ page }) => {
        await loginAndNavigateToPlan(page)
        await PlanOverviewPage.verifyOnPage(page)
        await page.goto(`/forms/sentence-plan/v1.0/goal/new/add-goal/${area}`)

        const createGoalPage = await CreateGoalPage.verifyOnPage(page)
        await expect(createGoalPage.goalTitleInput).toBeVisible()

        await expect(page).toHaveURL(new RegExp(`/add-goal/${area}`))
      })
    }
  })
})
