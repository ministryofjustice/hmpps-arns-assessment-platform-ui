import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import CreateGoalPage from '../../pages/sentencePlan/createGoalPage'
import AddStepsPage from '../../pages/sentencePlan/addStepsPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from './sentencePlanUtils'

test.describe('Create Goal Journey', () => {
  test.describe('Create Goal with Steps', () => {
    test('can create a goal and add steps - happy path', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickCreateGoal()
      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      // Use special characters to verify they display correctly (not as HTML entities like &#39;)
      await createGoalPage.enterGoalTitle("Find stable accommodation so I'm not homeless ('sofa surfing')")
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('date_in_3_months')

      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(page).toHaveURL(/\/add-steps/)

      await addStepsPage.enterStep(0, 'probation_practitioner', "Contact housing services about 'emergency housing'")

      await addStepsPage.clickSaveAndContinue()

      // Verify goal was created and we're back on plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)
      const updatedPlanOverview = await PlanOverviewPage.verifyOnPage(page)

      // Verify the goal and step display correctly with special characters
      const goalCard = await updatedPlanOverview.getGoalCardByIndex(0)
      const goalTitle = await updatedPlanOverview.getGoalCardTitle(0)
      expect(goalTitle).toContain("I'm not homeless ('sofa surfing')")
      await expect(goalCard).toContainText("'emergency housing'")
    })

    test('can add multiple steps to a goal', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

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

      // Verify goal was created with steps
      await expect(page).toHaveURL(/\/plan\/overview/)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText('Contact housing services')
      await expect(goalCard).toContainText('Attend housing appointment')
    })

    test('can remove a step when multiple exist', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
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
    test('can save goal without adding steps', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Future accommodation goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)

      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('future goal redirects to future goals tab', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Future goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)
      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/type=future/)

      // Verify goal appears in future goals tab
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Future goal')
    })

    test('current goal redirects to current goals tab', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Current goal')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('date_in_3_months')
      await createGoalPage.clickSaveWithoutSteps()

      await expect(page).toHaveURL(/type=current/)

      // Verify goal appears in current goals tab
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Current goal')
    })
  })

  test.describe('Goal with Related Areas', () => {
    test('can create goal with related areas of need', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
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

    test('related areas of need checkboxes are displayed in alphabetical order', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
      await page.getByRole('button', { name: 'Create goal' }).click()

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.selectIsRelated(true)

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
  })

  test.describe('Validation', () => {
    test('shows error when goal title is empty', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)

      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(false)

      await createGoalPage.clickSaveWithoutSteps()

      const fieldError = page.locator('#goal_title-error')
      await expect(fieldError).toContainText('Select or enter what goal they should try to achieve')
    })

    test('shows error when can start now is not selected', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/forms/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal')
      await createGoalPage.selectIsRelated(false)

      await createGoalPage.clickSaveWithoutSteps()

      const fieldError = page.locator('#can_start_now-error')
      await expect(fieldError).toBeVisible()
    })

    test('shows error when target date is required but not selected', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)
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
    areasOfNeed
      .map(need => {
        return { area: need.slug, goals: need.goals }
      })
      .forEach(({ area, goals }) => {
        test(`can create goal for ${area} area`, async ({ page, createSession }) => {
          const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
          await navigateToSentencePlan(page, handoverLink)
          await PlanOverviewPage.verifyOnPage(page)
          await page.goto(`/forms/sentence-plan/v1.0/goal/new/add-goal/${area}`)

          const createGoalPage = await CreateGoalPage.verifyOnPage(page)
          await expect(createGoalPage.goalTitleInput).toBeVisible()
          const goalTitles = await createGoalPage.goalTitles.textContent()
          expect(JSON.parse(goalTitles))
            .toEqual(expect.arrayContaining(goals))

          await expect(page).toHaveURL(new RegExp(`/add-goal/${area}`))
        })
      })
  })
})
