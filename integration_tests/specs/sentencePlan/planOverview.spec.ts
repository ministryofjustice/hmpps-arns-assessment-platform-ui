import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import { withCurrentGoals, withFutureGoals, withMixedGoals, withGoals } from '../../builders/SentencePlanBuilder'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { loginAndNavigateToPlan, getAssessmentUuid } from './sentencePlanUtils'

/**
 * Integration tests for the Plan Overview page
 *
 * Uses the "reverse flow" pattern:
 * 1. Navigate to OASys entry point (creates empty assessment)
 * 2. Extract the assessment UUID from the page
 * 3. Use SentencePlanBuilder.addTo() to add goals/steps via API
 * 4. Refresh the page to see the populated data
 */
test.describe('Plan Overview Page', () => {
  test.describe('Empty State', () => {
    test('shows empty message when no current goals exist', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.noGoalsMessage).toBeVisible()
      await expect(planOverviewPage.noGoalsMessage).toContainText(/does not have any goals to work on now/i)
    })

    test('shows create goal link in empty state', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.createGoalLink).toBeVisible()
    })

    test('shows empty message when no future goals exist', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      await expect(planOverviewPage.noFutureGoalsMessage).toBeVisible()
      await expect(planOverviewPage.noFutureGoalsMessage).toContainText(/does not have any future goals/i)
    })
  })

  test.describe('Goal Display', () => {
    test('displays current goals in Goals to work on now section', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with current goals via API
      await withCurrentGoals(2).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Current Goal 1')

      const secondGoalTitle = await planOverviewPage.getGoalCardTitle(1)
      expect(secondGoalTitle).toContain('Current Goal 2')
    })

    test('displays future goals in Future goals section', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with future goals via API
      await withFutureGoals(2).addTo(assessmentUuid, aapClient)

      // Refresh and navigate to future goals tab
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Future Goal 1')
    })

    test('shows correct goal count in tab labels', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with mixed goals via API
      await withMixedGoals().addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.currentGoalsTab).toContainText('2')
      await expect(planOverviewPage.futureGoalsTab).toContainText('1')
    })

    test('goal card shows title and area of need', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a specific goal
      await withGoals([
        {
          title: 'Find stable housing',
          status: 'ACTIVE',
          areaOfNeed: 'accommodation',
          targetDate: '2025-06-01',
        },
      ]).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Find stable housing')

      const areaOfNeed = await planOverviewPage.getGoalCardAreaOfNeed(0)
      await expect(areaOfNeed).toContainText(/accommodation/i)
    })

    test('goal card shows No steps added when goal has no steps', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a goal without steps
      await withCurrentGoals(1).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText(/no steps added/i)
    })

    test('goal card shows steps when steps exist', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a goal that has steps
      await withGoals([
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
      ]).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText('Contact housing services')
      await expect(goalCard).toContainText('Attend housing appointment')
    })
  })

  test.describe('Tab Navigation', () => {
    test('defaults to current goals tab', async ({ page }) => {
      await loginAndNavigateToPlan(page)
      await PlanOverviewPage.verifyOnPage(page)

      await expect(page).toHaveURL(/type=current/)
    })

    test('can switch to future goals tab', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with mixed goals
      await withMixedGoals().addTo(assessmentUuid, aapClient)

      // Refresh and test tab navigation
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()

      await expect(page).toHaveURL(/type=future/)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)
    })

    test('can switch back to current goals tab', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with mixed goals
      await withMixedGoals().addTo(assessmentUuid, aapClient)

      // Refresh and test tab navigation
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.clickFutureGoalsTab()
      await expect(page).toHaveURL(/type=future/)

      await planOverviewPage.clickCurrentGoalsTab()
      await expect(page).toHaveURL(/type=current/)

      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)
    })

    test('respects type=future query param on page load', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with mixed goals
      await withMixedGoals().addTo(assessmentUuid, aapClient)

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
    test('shows Change goal link on goal cards', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a goal
      await withCurrentGoals(1).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasChangeLink = await planOverviewPage.goalCardHasChangeLink(0)
      expect(hasChangeLink).toBe(true)
    })

    test('shows Add or change steps link on goal cards', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a goal
      await withCurrentGoals(1).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasAddStepsLink = await planOverviewPage.goalCardHasAddStepsLink(0)
      expect(hasAddStepsLink).toBe(true)
    })

    test('shows Delete link on goal cards', async ({ page, aapClient }) => {
      // Navigate to create empty assessment
      await loginAndNavigateToPlan(page)
      const assessmentUuid = await getAssessmentUuid(page)

      // Populate with a goal
      await withCurrentGoals(1).addTo(assessmentUuid, aapClient)

      // Refresh to see the data
      await page.reload()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasDeleteLink = await planOverviewPage.goalCardHasDeleteLink(0)
      expect(hasDeleteLink).toBe(true)
    })
  })
})
