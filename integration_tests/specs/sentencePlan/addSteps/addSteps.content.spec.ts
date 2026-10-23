import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import CreateGoalPage from '../../../pages/sentencePlan/createGoalPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import ReorderStepsPage from '../../../pages/sentencePlan/reorderStepsPage'
import SelectAreaOfNeedPage from '../../../pages/sentencePlan/selectAreaOfNeedPage'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals, futureGoals } from '../../../builders/sentencePlanFactories'
import {
  buildPageTitle,
  checkAccessibility,
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanPageTitles,
  sentencePlanV1UrlBuilders,
} from '../sentencePlanUtils'

test.describe('Add or update steps page', () => {
  test.describe('page heading', () => {
    test('shows "Add steps" heading when creating a new goal', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      await page.goto('/sentence-plan/v1.0/goal/new/add-goal/accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal heading')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('3_months')
      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.pageHeading).toHaveText('Add steps')
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.addSteps))
    })

    test('shows "Add or update steps" heading when editing an existing goal', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Existing goal',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Existing step', status: 'NOT_STARTED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.pageHeading).toHaveText('Add or update steps')
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.addOrUpdateSteps))
    })

    test('shows "Add steps" heading when editing an existing goal with no steps', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Existing goal with no steps',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.pageHeading).toHaveText('Add steps')
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.addSteps))
    })
  })

  test.describe('goal context inset text', () => {
    test('displays the area of need in the inset in lower case when goal has no related areas', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoals(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await expect(addStepsPage.goalContextInset).toContainText('Area of need: accommodation')
      await expect(addStepsPage.goalContextInset.locator('strong').first()).toHaveText('accommodation')

      // Should NOT show "Also relates to" when there are no related areas
      await expect(addStepsPage.goalContextInset).not.toContainText('Also relates to')
    })

    test('displays related areas in the inset in alphabetical order when goal has related areas', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal with related areas',
                areaOfNeed: 'accommodation',
                relatedAreasOfNeed: ['finances', 'employment-and-education'],
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      // Area of need should be visible and in lower case
      await expect(addStepsPage.goalContextInset).toContainText('Area of need: accommodation')

      // Related areas should be in alphabetical order: employment and education; finances
      await expect(addStepsPage.goalContextInset).toContainText('Also relates to: employment and education, finances')
    })

    test('displays the goal title in the inset', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Find suitable housing',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'NOT_STARTED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await expect(addStepsPage.goalContextInset).toContainText('Goal: Find suitable housing')
    })

    test('displays the goal context inset on the "Add steps" page during goal creation', async ({
      page,
      createSession,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickCreateGoal()

      const selectAreaOfNeedPage = await SelectAreaOfNeedPage.verifyOnPage(page)
      await selectAreaOfNeedPage.selectAreaAndContinue('accommodation')

      const createGoalPage = await CreateGoalPage.verifyOnPage(page)
      await createGoalPage.enterGoalTitle('Test goal during creation')
      await createGoalPage.selectIsRelated(false)
      await createGoalPage.selectCanStartNow(true)
      await createGoalPage.selectTargetDateOption('3_months')
      await createGoalPage.clickAddSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await expect(addStepsPage.goalContextInset).toContainText('Area of need: accommodation')
      await expect(addStepsPage.goalContextInset).toContainText('Goal: Test goal during creation')
    })

    test('displays the area of need in the inset for a future goal', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(futureGoals(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      await expect(addStepsPage.goalContextInset).toContainText('Area of need: finances')
      await expect(addStepsPage.goalContextInset.locator('strong').first()).toHaveText('finances')
    })

    test('inset text is accessible', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoals(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

      await AddStepsPage.verifyOnPage(page)
      await checkAccessibility(page)
    })
  })

  test.describe('inset text on update flow', () => {
    test('inset is displayed when navigating from update goal and steps page', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Current Goal 1',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Existing step', status: 'NOT_STARTED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })

      // Navigate via update goal -> add or change steps link
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.clickUpdateGoal(0)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
      await updatePage.clickAddOrChangeSteps()

      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      // Inset should still display the goal context on the "Add or update steps" page
      await expect(addStepsPage.goalContextInset).toContainText('Area of need: accommodation')
      await expect(addStepsPage.goalContextInset).toContainText('Goal: Current Goal 1')
    })
  })

  test.describe('reorder steps button', () => {
    test.beforeEach(async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal With Two Steps',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [
                  { actor: 'probation_practitioner', description: 'First step', status: 'NOT_STARTED' },
                  { actor: 'person_on_probation', description: 'Second step', status: 'NOT_STARTED' },
                ],
              },
            ]),
      })
      const goalUuid = plan.goals[0].uuid
      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    })
    test('should display reorder steps button when goal has more than one step and hide it after removing a step', async ({
      page,
    }) => {
      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(addStepsPage.reorderStepsButton).toBeVisible()

      await addStepsPage.clickRemoveStep(1)
      await expect(addStepsPage.reorderStepsButton).toBeHidden()
    })

    test('should show newly added step on reorder page', async ({ page }) => {
      const addStepsPage = await AddStepsPage.verifyOnPage(page)

      // add a 3rd step
      await addStepsPage.clickAddStep()
      await addStepsPage.enterStep(2, 'probation_practitioner', 'Third step')

      // click reorder steps
      await addStepsPage.clickReorderSteps()
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      // verify all 3 steps are shown
      expect(await reorderPage.getStepCount()).toBe(3)
      expect(await reorderPage.getStepDescription(2)).toBe('Third step')
    })
  })
})
