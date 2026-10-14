import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ReorderStepsPage, { threeStepGoal } from '../../../pages/sentencePlan/reorderStepsPage'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import { sentencePlanV1UrlBuilders } from '../sentencePlanUtils'

test.describe('Reorder steps page - submission', () => {

  test.beforeEach(async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([threeStepGoal]),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalReorderSteps(goalUuid))
  })

  test.describe('move actions', () => {
    test('should move a step down when clicking move down', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await reorderPage.clickMoveDown(0)

      const descriptions = await reorderPage.getAllStepDescriptions()

      expect(descriptions).toEqual([
        'Register with local council',
        'Contact housing services',
        'Attend housing appointment',
      ])
    })

    test('should move a step up when clicking move up', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)
      const lastStepIndex = threeStepGoal.steps.length - 1

      await reorderPage.clickMoveUp(lastStepIndex)

      const descriptions = await reorderPage.getAllStepDescriptions()

      expect(descriptions).toEqual([
        'Contact housing services',
        'Attend housing appointment',
        'Register with local council',
      ])
    })

    test('should support multiple consecutive moves', async ({ page }) => {
      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      // Move first step down twice: [1,2,3] >> [2,1,3]
      await reorderPage.clickMoveDown(0)

      // [2,1,3] >> [2,3,1]
      await reorderPage.clickMoveDown(1)

      const descriptions = await reorderPage.getAllStepDescriptions()

      expect(descriptions).toEqual([
        'Register with local council',
        'Attend housing appointment',
        'Contact housing services',
      ])
    })
  })

  test.describe('save and continue', () => {
    test('should persist the reordered steps after saving', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder => builder.withGoals([threeStepGoal]),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await addStepsPage.clickReorderSteps()

      const reorderPage = await ReorderStepsPage.verifyOnPage(page)

      await reorderPage.clickMoveDown(0)
      await reorderPage.clickSaveAndContinue()

      // redirects to add steps after save
      await AddStepsPage.verifyOnPage(page)

      // navigate back to reorder page to verify the new order persists
      await addStepsPage.clickReorderSteps()

      const descriptions = await reorderPage.getAllStepDescriptions()

      expect(descriptions).toEqual([
        'Register with local council',
        'Contact housing services',
        'Attend housing appointment',
      ])
    })
  })
})
