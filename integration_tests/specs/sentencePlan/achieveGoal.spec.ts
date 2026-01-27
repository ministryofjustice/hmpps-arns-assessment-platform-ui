import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ConfirmAchievedGoalPage from '../../pages/sentencePlan/confirmAchievedGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import {
  buildPageTitle,
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Achieve goal journey', () => {
  test.describe('confirm goal as achieved', () => {
    test('can confirm goal as achieved with optional note', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      // Enter optional note about how the goal helped
      await achievePage.enterHowHelpedNote('This goal helped stabilise their housing situation')

      // Click confirm
      await achievePage.clickConfirm()

      // Should redirect to plan overview with achieved tab selected
      await expect(page).toHaveURL(/plan\/overview.*type=achieved/)

      // Verify we're on the plan overview page
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('can confirm goal as achieved without optional note', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      await achievePage.clickConfirm()

      // Should redirect to plan overview with achieved tab selected
      await expect(page).toHaveURL(/plan\/overview.*type=achieved/)
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

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      // Click cancel/do not mark as achieved
      await achievePage.clickCancel()

      // Should redirect back to update-goal-steps page
      await expect(page).toHaveURL(/\/update-goal-steps/)
    })
  })

  test.describe('page content', () => {
    test('displays page title and page heading with person name', async ({
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
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      // ensure page title is correct; there is no validation so no need in checking error page title
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.confirmAchievedGoal))

      // Check heading contains expected text
      const headerText = await achievePage.getHeaderText()
      expect(headerText).toContain('has achieved this goal')
    })

    test('displays goal summary card with goal details', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
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

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      await expect(achievePage.goalCard).toBeVisible()

      // Check goal title is displayed
      const goalTitle = await achievePage.getGoalTitle()
      expect(goalTitle).toContain('Find stable housing')
    })

    test('how helped field is optional and starts empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await PlanOverviewPage.verifyOnPage(page)

      // Navigate to confirm-achieved-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)

      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)

      // Check the how helped field starts empty
      const noteValue = await achievePage.getHowHelpedNote()
      expect(noteValue).toBe('')
    })
  })

  test.describe('achieved goals tab', () => {
    test('achieved goal appears in achieved goals tab after confirmation', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Achieve Test Goal',
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

      // Navigate to confirm-achieved-goal page and confirm
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Should be on achieved tab now
      await expect(page).toHaveURL(/type=achieved/)

      // Verify the goal appears in the achieved goals list
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Achieve Test Goal')
    })

    test('achieved goal no longer appears in current goals tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Achieve',
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

      // Navigate to confirm-achieved-goal page for first goal and confirm
      const goalUuid = plan.goals[0].uuid
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to current goals tab
      await page.goto('/forms/sentence-plan/v1.0/plan/overview?type=current')

      // Verify only 1 goal remains in current goals
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      // The remaining goal should be "Goal To Keep"
      const remainingGoalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(remainingGoalTitle).toContain('Goal To Keep')
    })
  })
})
