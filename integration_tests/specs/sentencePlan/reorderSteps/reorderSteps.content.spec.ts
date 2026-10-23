import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ReorderStepsPage, { targetDate, threeStepGoal } from '../../../pages/sentencePlan/reorderStepsPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import {
  buildPageTitle,
  checkAccessibility,
  sentencePlanPageTitles,
  sentencePlanV1UrlBuilders,
} from '../sentencePlanUtils'

test.describe('Reorder steps page - content', () => {

  test.beforeEach(async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([threeStepGoal]),
    })
    const goalUuid = plan.goals[0].uuid
    await page.goto(sentencePlanV1UrlBuilders.goalReorderSteps(goalUuid))
  })

  test.describe('page heading and title', () => {
    test('should display the correct heading and page title', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await expect(reorderPage.pageHeading).toHaveText('Reorder steps')
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.reorderSteps))
    })
  })

  test.describe('goal context inset', () => {
    test('should display the area of need and goal title', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await expect(reorderPage.goalContextInset).toContainText('Area of need: accommodation')
      await expect(reorderPage.goalContextInset).toContainText('Goal: Find stable accommodation')
    })

    test('should display related areas when goal has related areas', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                ...threeStepGoal,
                relatedAreasOfNeed: ['finances', 'employment-and-education'],
              },
            ]),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalReorderSteps(goalUuid))
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await expect(reorderPage.goalContextInset).toContainText('Also relates to: employment and education, finances')
    })
  })

  test.describe('step list', () => {
    test('should display all column headers', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await expect(reorderPage.columnHeaders).toContainText('Who will do this')
      await expect(reorderPage.columnHeaders).toContainText('Steps')
      await expect(reorderPage.columnHeaders).toContainText('Status')
    })

    test('should display step descriptions in the correct order', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)
      const descriptions = await reorderPage.getAllStepDescriptions()

      expect(descriptions).toEqual([
        'Contact housing services',
        'Register with local council',
        'Attend housing appointment',
      ])
    })
  })

  test.describe('move buttons', () => {
    test('should not show move up button on the first step/move down button on the last step + show both on middle steps', async ({
      page,
    }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)
      const firstStepIndex = 0
      const lastStepIndex = threeStepGoal.steps.length - 1
      const middleStepIndex = 1

      expect(await reorderPage.hasMoveUpButton(firstStepIndex)).toBe(false)
      expect(await reorderPage.hasMoveDownButton(firstStepIndex)).toBe(true)

      expect(await reorderPage.hasMoveUpButton(lastStepIndex)).toBe(true)
      expect(await reorderPage.hasMoveDownButton(lastStepIndex)).toBe(false)

      expect(await reorderPage.hasMoveUpButton(middleStepIndex)).toBe(true)
      expect(await reorderPage.hasMoveDownButton(middleStepIndex)).toBe(true)
    })
  })

  test.describe('action buttons', () => {
    test('should display save and continue and cancel buttons', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await expect(reorderPage.saveAndContinueButton).toBeVisible()
      await expect(reorderPage.cancelButton).toBeVisible()
    })
  })

  test.describe('accessibility', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await ReorderStepsPage.verifyOnPage(page)
      await checkAccessibility(page)
    })
  })

  test.describe('guard - goal has to have minimum 2 steps to access reorder steps page', () => {
    test('should redirect to plan overview when goal has only 1 step', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal with one step',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate,
                steps: [{ actor: 'probation_practitioner', description: 'Only step', status: 'NOT_STARTED' }],
              },
            ]),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalReorderSteps(goalUuid))

      await PlanOverviewPage.verifyOnPage(page)
    })

    test('should redirect to plan overview when goal has no steps', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal with no steps',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate,
                steps: [],
              },
            ]),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalReorderSteps(goalUuid))

      await PlanOverviewPage.verifyOnPage(page)
    })
  })
})
