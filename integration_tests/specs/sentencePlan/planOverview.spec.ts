import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import { currentGoals, futureGoals, mixedGoals } from '../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import AddStepsPage from '../../pages/sentencePlan/addStepsPage'
import { buildPageTitle, navigateToSentencePlan, sentencePlanPageTitles } from './sentencePlanUtils'

test.describe('Plan Overview Page', () => {
  test.describe('Empty State', () => {
    test('shows empty message when no current goals exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // ensure page title is correct; error title is tested in agreePlan test suite
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.planOverview))

      await expect(planOverviewPage.noGoalsMessage).toBeVisible()
      await expect(planOverviewPage.noGoalsMessage).toContainText(/does not have any goals to work on now/i)
    })

    test('shows create goal link in empty state', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.createGoalLink).toBeVisible()
    })

    test('shows empty message when no future goals exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      await expect(planOverviewPage.noFutureGoalsMessage).toBeVisible()
      await expect(planOverviewPage.noFutureGoalsMessage).toContainText(/does not have any future goals/i)
    })
  })

  test.describe('Goal Display', () => {
    test('displays current goals in Goals to work on now section', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(2)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Current Goal 1')

      const secondGoalTitle = await planOverviewPage.getGoalCardTitle(1)
      expect(secondGoalTitle).toContain('Current Goal 2')
    })

    test('displays future goals in Future goals section', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(2)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Future Goal 1')
    })

    test('shows correct goal count in tab labels', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.currentGoalsTab).toContainText('2')
      await expect(planOverviewPage.futureGoalsTab).toContainText('1')
    })

    test('goal card shows title and area of need', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Find stable housing',
            status: 'ACTIVE',
            areaOfNeed: 'accommodation',
            targetDate: '2025-06-01',
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Find stable housing')

      const areaOfNeed = await planOverviewPage.getGoalCardAreaOfNeed(0)
      await expect(areaOfNeed).toContainText(/accommodation/i)
    })

    test('goal card shows No steps added when goal has no steps', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText(/no steps added/i)
    })

    test('goal card shows steps when steps exist', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal with steps',
            status: 'ACTIVE',
            areaOfNeed: 'accommodation',
            targetDate: '2025-06-01',
            steps: [
              { actor: 'probation_practitioner', description: 'Contact housing services' },
              { actor: 'person_on_probation', description: 'Attend housing appointment' },
            ],
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText('Contact housing services')
      await expect(goalCard).toContainText('Attend housing appointment')
    })
  })

  test.describe('Tab Navigation', () => {
    test('defaults to current goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await PlanOverviewPage.verifyOnPage(page)

      await expect(page).toHaveURL(/type=current/)
    })

    test('can switch to future goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()

      await expect(page).toHaveURL(/type=future/)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)
    })

    test('can switch back to current goals tab', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      await planOverviewPage.clickCurrentGoalsTab()
      await expect(page).toHaveURL(/type=current/)

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)
    })

    test('respects type=future query param on page load', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

      await navigateToSentencePlan(page, handoverLink)

      // Navigate directly to future goals tab
      await page.goto('/forms/sentence-plan/v1.0/plan/overview?type=future')
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Improve finances')
    })
  })

  test.describe('Goal Actions', () => {
    test('shows Change goal link on goal cards', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasChangeLink = await planOverviewPage.goalCardHasChangeLink(0)
      expect(hasChangeLink).toBe(true)
    })

    test('shows Add or change steps link on goal cards', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasAddStepsLink = await planOverviewPage.goalCardHasAddStepsLink(0)
      expect(hasAddStepsLink).toBe(true)
    })

    test('shows Delete link on goal cards', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasDeleteLink = await planOverviewPage.goalCardHasDeleteLink(0)
      expect(hasDeleteLink).toBe(true)
    })

    test('clicking Add or change steps navigates to add steps page and back returns to plan overview', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(page).toHaveURL(/type=current/)

      // Click "Add or change steps" on the first goal
      await planOverviewPage.clickAddOrChangeSteps(0)

      // Verify we're on the add steps page
      const addStepsPage = await AddStepsPage.verifyOnPage(page)
      await expect(page).toHaveURL(/add-steps/)

      // Click back
      await addStepsPage.clickBack()

      // Verify we're back on plan overview with correct tab
      await PlanOverviewPage.verifyOnPage(page)
      await expect(page).toHaveURL(/type=current/)
    })
  })

  test.describe('Goal Reordering', () => {
    test.describe('Button Visibility', () => {
      test('single goal shows no move buttons', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        const hasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(0)
        const hasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(0)

        expect(hasMoveUp).toBe(false)
        expect(hasMoveDown).toBe(false)
      })

      test('first goal only shows Move down button', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(2)).save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        const hasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(0)
        const hasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(0)

        expect(hasMoveUp).toBe(false)
        expect(hasMoveDown).toBe(true)
      })

      test('last goal only shows Move up button', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(2)).save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        const hasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(1)
        const hasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(1)

        expect(hasMoveUp).toBe(true)
        expect(hasMoveDown).toBe(false)
      })

      test('middle goal shows both move buttons', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(3)).save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        const hasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(1)
        const hasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(1)

        expect(hasMoveUp).toBe(true)
        expect(hasMoveDown).toBe(true)
      })
    })

    test.describe('Reordering Functionality', () => {
      test('clicking Move down swaps goal with the one below', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals([
            { title: 'Goal A', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Goal B', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Goal C', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
          ])
          .save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        // Verify initial order
        const titlesBefore = await planOverviewPage.getAllGoalTitles()
        expect(titlesBefore[0]).toContain('Goal A')
        expect(titlesBefore[1]).toContain('Goal B')
        expect(titlesBefore[2]).toContain('Goal C')

        // Move Goal A down
        await planOverviewPage.clickMoveGoalDown(0)

        // Verify page reloads and order has changed
        await PlanOverviewPage.verifyOnPage(page)
        const titlesAfter = await planOverviewPage.getAllGoalTitles()
        expect(titlesAfter[0]).toContain('Goal B')
        expect(titlesAfter[1]).toContain('Goal A')
        expect(titlesAfter[2]).toContain('Goal C')
      })

      test('clicking Move up swaps goal with the one above', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals([
            { title: 'Goal A', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Goal B', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Goal C', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
          ])
          .save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        // Move Goal C up
        await planOverviewPage.clickMoveGoalUp(2)

        // Verify order has changed
        await PlanOverviewPage.verifyOnPage(page)
        const titlesAfter = await planOverviewPage.getAllGoalTitles()
        expect(titlesAfter[0]).toContain('Goal A')
        expect(titlesAfter[1]).toContain('Goal C')
        expect(titlesAfter[2]).toContain('Goal B')
      })

      test('reordering stays on correct tab', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(2)).save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
        await planOverviewPage.clickFutureGoalsTab()
        await expect(page).toHaveURL(/type=future/)

        // Move first future goal down
        await planOverviewPage.clickMoveGoalDown(0)

        // Should stay on future tab
        await expect(page).toHaveURL(/type=future/)
      })

      test('goals only reorder within their status group', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder
          .extend(sentencePlanId)
          .withGoals([
            { title: 'Current Goal 1', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Current Goal 2', status: 'ACTIVE', areaOfNeed: 'accommodation', targetDate: '2025-06-01' },
            { title: 'Future Goal 1', status: 'FUTURE', areaOfNeed: 'accommodation', targetDate: '2025-12-01' },
            { title: 'Future Goal 2', status: 'FUTURE', areaOfNeed: 'accommodation', targetDate: '2025-12-01' },
          ])
          .save()

        await navigateToSentencePlan(page, handoverLink)

        const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

        // On current goals tab, last current goal should only have Move up (not Move down)
        // because it can't move into future goals
        const lastCurrentHasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(1)
        expect(lastCurrentHasMoveDown).toBe(false)

        // Switch to future tab and verify first future goal only has Move down
        await planOverviewPage.clickFutureGoalsTab()
        const firstFutureHasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(0)
        expect(firstFutureHasMoveUp).toBe(false)
      })
    })
  })
})
