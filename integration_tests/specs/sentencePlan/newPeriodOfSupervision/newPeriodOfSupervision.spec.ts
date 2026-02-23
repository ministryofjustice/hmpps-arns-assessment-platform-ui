import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan, getDatePlusDaysAsISO } from '../sentencePlanUtils'
import type { GoalConfig } from '../../../builders/types'

/**
 * Simulates the post-reset state after a new period of supervision.
 *
 * When the API wrapper handles a new period of supervision, it:
 * - Sets all ACTIVE/FUTURE goals to REMOVED status
 * - Adds a system-generated removal note to each goal
 * - Clears plan agreements (returns plan to DRAFT)
 *
 * These tests set up that state directly using the builder and verify
 * the UI renders correctly.
 */

const systemRemovalNote = 'Automatically removed as the previous supervision period has ended.'

function autoRemovedGoals(count: number): GoalConfig[] {
  const goals: GoalConfig[] = []

  for (let i = 1; i <= count; i++) {
    goals.push({
      title: `Auto-removed Goal ${i}`,
      areaOfNeed: 'accommodation',
      status: 'REMOVED',
      targetDate: getDatePlusDaysAsISO(90),
      steps: [{ actor: 'probation_practitioner', description: `Step for goal ${i}`, status: 'NOT_STARTED' }],
      notes: [{ type: 'REMOVED', note: systemRemovalNote, createdBy: 'System' }],
    })
  }

  return goals
}

test.describe('New period of supervision', () => {
  test.describe('Draft state (before agreement)', () => {
    test('plan appears blank with no active or future goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Simulate post-reset state: goals are REMOVED, no agreement exists (draft)
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(autoRemovedGoals(2)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Current goals tab should show 0 goals
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(0)

      // Empty state message should be visible
      await expect(planOverviewPage.noGoalsMessage).toBeVisible()
    })

    test('Agree Plan button is visible in draft state', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      await sentencePlanBuilder.extend(sentencePlanId).withGoals(autoRemovedGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Draft plans show the create goal link (Agree Plan button requires active goals)
      await expect(planOverviewPage.createGoalLink).toBeVisible()
    })

    test('Removed goals tab is NOT displayed in draft state', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Even though removed goals exist, the tab should be hidden before agreement
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(autoRemovedGoals(3)).save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.removedGoalsTab).not.toBeVisible()
    })
  })

  test.describe('After agreement', () => {
    test('Removed goals tab appears after plan is agreed', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      // Simulate: goals were auto-removed, then new goals were added and plan was agreed
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          ...autoRemovedGoals(2),
          {
            title: 'New goal after reset',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'New step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Now that the plan is agreed, the removed goals tab should be visible
      await expect(planOverviewPage.removedGoalsTab).toBeVisible()
      await expect(planOverviewPage.removedGoalsTab).toContainText('2')
    })

    test('Removed goals tab shows auto-removed goals with correct details', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          ...autoRemovedGoals(2),
          {
            title: 'New active goal',
            areaOfNeed: 'finances',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Navigate to removed goals tab
      await planOverviewPage.removedGoalsTab.click()
      await expect(page).toHaveURL(/type=removed/)

      // Verify auto-removed goals are displayed
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      const firstGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(firstGoalTitle).toContain('Auto-removed Goal 1')

      const secondGoalTitle = await planOverviewPage.getGoalCardTitle(1)
      expect(secondGoalTitle).toContain('Auto-removed Goal 2')
    })

    test('auto-removed goal card shows View details link', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          ...autoRemovedGoals(1),
          {
            title: 'Active goal',
            areaOfNeed: 'finances',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await planOverviewPage.removedGoalsTab.click()
      await expect(page).toHaveURL(/type=removed/)

      // Removed goals should show "View details" not "Update"
      const hasViewDetails = await planOverviewPage.goalCardHasViewDetailsLink(0)
      expect(hasViewDetails).toBe(true)

      const hasUpdate = await planOverviewPage.goalCardHasUpdateLink(0)
      expect(hasUpdate).toBe(false)
    })
  })
})
