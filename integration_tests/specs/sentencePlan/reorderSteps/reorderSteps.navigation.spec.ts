import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ReorderStepsPage, { threeStepGoal } from '../../../pages/sentencePlan/reorderStepsPage'
import { sentencePlanV1UrlBuilders } from '../sentencePlanUtils'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import UpdateGoalAndStepsPage from '../../../pages/sentencePlan/updateGoalAndStepsPage'

test.describe('Reorder steps page - navigation from add steps', () => {
  test.beforeEach(async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([threeStepGoal]),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.clickReorderSteps()
  })

  test('should navigate back to add steps when clicking back link', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)

    await expect(reorderPage.backLink).toBeVisible()
    await reorderPage.clickBack()

    await AddStepsPage.verifyOnPage(page)
  })

  test('should navigate to add steps when cancelling', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)
    await reorderPage.clickCancel()

    await AddStepsPage.verifyOnPage(page)
  })

  test('should navigate to add steps after saving', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)
    await reorderPage.clickMoveDown(0)
    await reorderPage.clickSaveAndContinue()

    await AddStepsPage.verifyOnPage(page)
  })

  test('should discard unsaved changes when navigating away and returning', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)

    // move 1st step down
    await reorderPage.clickMoveDown(0)

    // navigate away without saving
    await reorderPage.clickCancel()
    const addStepsPage = await AddStepsPage.verifyOnPage(page)

    // come back to reorder page
    await addStepsPage.clickReorderSteps()

    const descriptions = await reorderPage.getAllStepDescriptions()

    // descriptions should be in the original order
    expect(descriptions).toEqual([
      'Contact housing services',
      'Register with local council',
      'Attend housing appointment',
    ])
  })
})

test.describe('Reorder steps page - navigation from update goal and steps', () => {
  test.beforeEach(async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([threeStepGoal]).withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid

    await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))
    const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)
    await updatePage.clickReorderSteps()
  })

  test('should navigate back to update goal and steps when clicking back link', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)

    await expect(reorderPage.backLink).toBeVisible()
    await reorderPage.clickBack()

    await UpdateGoalAndStepsPage.verifyOnPage(page)
  })

  test('should navigate to update goal and steps when cancelling', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)
    await reorderPage.clickCancel()

    await UpdateGoalAndStepsPage.verifyOnPage(page)
  })

  test('should navigate to update goal and steps after saving', async ({ page }) => {
    const reorderPage = await ReorderStepsPage.verifyOnPage(page)
    await reorderPage.clickMoveDown(0)
    await reorderPage.clickSaveAndContinue()

    await UpdateGoalAndStepsPage.verifyOnPage(page)
  })
})
