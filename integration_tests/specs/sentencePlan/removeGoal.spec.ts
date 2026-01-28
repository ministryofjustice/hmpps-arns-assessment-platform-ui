import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ConfirmRemoveGoalPage from '../../pages/sentencePlan/confirmRemoveGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  buildPageTitle,
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Remove goal journey', () => {
  test.describe('confirm goal removal', () => {
    test('can confirm goal removal with required note', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      // ensure page title is correct
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.confirmRemoveGoal))

      // Enter required removal note
      await removePage.enterRemovalNote('Goal is no longer relevant to their current situation')

      // Click confirm
      await removePage.clickConfirm()

      // Should redirect to plan overview with removed tab selected
      await expect(page).toHaveURL(/plan\/overview.*type=removed/)

      // Verify we're on the plan overview page
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('shows validation error when removal note is empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      // Click confirm without entering note
      await removePage.clickConfirm()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.confirmRemoveGoal))

      // Should show validation error
      const hasError = await removePage.hasValidationError()
      expect(hasError).toBe(true)

      const errorMessage = await removePage.getValidationErrorMessage()
      expect(errorMessage).toContain('Enter why you want to remove this goal')
    })

    test('can cancel and return to update goal steps page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      // Click cancel/do not remove goal
      await removePage.clickCancel()

      // Should redirect back to update-goal-steps page
      await expect(page).toHaveURL(/\/update-goal-steps/)
    })
  })

  test.describe('page content', () => {
    test('displays page heading', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      // Check heading contains expected text
      const headerText = await removePage.getHeaderText()
      expect(headerText).toContain('Confirm you want to remove this goal')
    })

    test('displays goal summary card with goal details', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Setup: create assessment with a specific goal title
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Find stable housing',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      await expect(removePage.goalCard).toBeVisible()

      // Check goal title is displayed
      const goalTitle = await removePage.getGoalTitle()
      expect(goalTitle).toContain('Find stable housing')
    })

    test('removal note field is required and starts empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-remove-goal page
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)

      // Check the removal note field starts empty
      const noteValue = await removePage.getRemovalNote()
      expect(noteValue).toBe('')
    })
  })

  test.describe('removed goals tab', () => {
    test('removed goal appears in removed goals tab after confirmation', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Setup: create assessment with an ACTIVE goal with completed steps
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Remove Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Complete task', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to confirm-remove-goal page and confirm
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('No longer needed')
      await removePage.clickConfirm()

      // Should be on removed tab now
      await expect(page).toHaveURL(/type=removed/)

      // Verify the goal appears in the removed goals list
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Remove Test Goal')
    })

    test('removed goal no longer appears in current goals tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Setup: create assessment with 2 ACTIVE goals
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Remove',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' }],
          },
          {
            title: 'Goal To Keep',
            areaOfNeed: 'finances',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      // Verify we start with 2 current goals
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      let goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      // Navigate to confirm-remove-goal page for first goal and confirm
      const goalUuid = plan.goals[0].uuid
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('No longer relevant')
      await removePage.clickConfirm()

      // Navigate to current goals tab
      await page.goto('/sentence-plan/v1.0/plan/overview?type=current')

      // Verify only 1 goal remains in current goals
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      // The remaining goal should be "Goal To Keep"
      const remainingGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(remainingGoalTitle).toContain('Goal To Keep')
    })

    test('removed goals tab only appears when there are removed goals', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      // Verify removed goals tab is not visible initially
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(planOverviewPage.removedGoalsTab).not.toBeVisible()

      // Remove the goal
      const goalUuid = plan.goals[0].uuid
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('Testing tab visibility')
      await removePage.clickConfirm()

      // Now removed goals tab should be visible
      const updatedPlanOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(updatedPlanOverviewPage.removedGoalsTab).toBeVisible()
    })

    test('removed goal card shows "View details" action instead of "Update"', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Remove the goal
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('Testing action link')
      await removePage.clickConfirm()

      // Verify on removed goals tab
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Check that the card has "View details" instead of "Update"
      const hasViewDetails = await planOverviewPage.goalCardHasViewDetailsLink(0)
      expect(hasViewDetails).toBe(true)

      const hasUpdate = await planOverviewPage.goalCardHasUpdateLink(0)
      expect(hasUpdate).toBe(false)
    })
  })

  test.describe('access control', () => {
    test('redirects to plan overview if plan is not agreed (draft)', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Business rule: Goals can only be removed (soft-delete) from agreed plans.
      // Draft plans should use the "delete" action instead (hard-delete).
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Try to navigate to confirm-remove-goal page without agreeing plan
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)

      // Should redirect to plan overview (remove is only for agreed plans)
      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })
})
