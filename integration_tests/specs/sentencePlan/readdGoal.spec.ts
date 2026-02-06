import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ConfirmReaddGoalPage from '../../pages/sentencePlan/confirmReaddGoalPage'
import ConfirmRemoveGoalPage from '../../pages/sentencePlan/confirmRemoveGoalPage'
import ViewInactiveGoalPage from '../../pages/sentencePlan/viewInactiveGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { removedGoals } from '../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  buildPageTitle,
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Re-add goal journey', () => {
  test.describe('confirm goal re-add', () => {
    test('can confirm re-adding a goal as a current goal', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      // ensure page title is correct
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.confirmReAddGoal))

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Person is now ready to work on this goal again')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('3_months')
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/plan\/overview.*type=current/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('can confirm re-adding a goal as a future goal', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Person will work on this in the future')
      await readdPage.selectCanStartNow(false)
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/plan\/overview.*type=future/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('shows validation error when re-add note is empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.selectCanStartNow(false)
      await readdPage.clickConfirm()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.confirmReAddGoal))

      expect(await readdPage.hasValidationError()).toBe(true)
      expect(await readdPage.hasReaddNoteError()).toBe(true)
    })

    test('shows validation error when can start now is not selected', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Test note')
      await readdPage.clickConfirm()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.confirmReAddGoal))

      expect(await readdPage.hasValidationError()).toBe(true)
      expect(await readdPage.hasCanStartNowError()).toBe(true)
    })

    test('can cancel and return to view inactive goal page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.clickCancel()

      await expect(page).toHaveURL(/\/view-inactive-goal/)
    })
  })

  test.describe('page content', () => {
    test('displays page heading with person name', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      const headerText = await readdPage.getHeaderText()

      expect(headerText).toContain('Confirm you want to add this goal back')
      expect(headerText).toContain('plan')
    })

    test('displays goal summary card with goal details', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Find stable housing',
            areaOfNeed: 'accommodation',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Goal was no longer relevant' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      await expect(readdPage.goalCard).toBeVisible()
      expect(await readdPage.getGoalTitle()).toContain('Find stable housing')
    })

    test('re-add note field starts empty', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      expect(await readdPage.getReaddNote()).toBe('')
    })

    test('can start now radio options are not pre-selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      expect(await readdPage.isCanStartNowYesChecked()).toBe(false)
      expect(await readdPage.isCanStartNowNoChecked()).toBe(false)
    })
  })

  test.describe('navigation from view inactive goal', () => {
    test('clicking Add to plan navigates to confirm re-add page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(removedGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)
      await viewPage.clickAddToPlan()

      await expect(page).toHaveURL(/\/confirm-readd-goal/)
      await ConfirmReaddGoalPage.verifyOnPage(page)
    })
  })

  test.describe('re-added goals', () => {
    test('re-added goal appears at the bottom of the list when there are multiple goals', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'First Goal - Should Stay First',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'NOT_STARTED' }],
          },
          {
            title: 'Second Goal - Should Stay Second',
            areaOfNeed: 'finances',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 2', status: 'NOT_STARTED' }],
          },
          {
            title: 'Re-added Goal - Should Be Last',
            areaOfNeed: 'health',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 3', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Was removed temporarily' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      // Verify initial state: 2 active goals
      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/plan/overview?type=current')

      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(2)

      // Re-add the removed goal
      const removedGoalUuid = plan.goals[2].uuid
      await page.goto(`/sentence-plan/v1.0/goal/${removedGoalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Ready to work on this again')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('3_months')
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/type=current/)

      // Verify re-added goal is at the bottom
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalTitles = await planOverviewPage.getAllGoalTitles()

      expect(goalTitles).toHaveLength(3)
      expect(goalTitles[0]).toContain('First Goal - Should Stay First')
      expect(goalTitles[1]).toContain('Second Goal - Should Stay Second')
      expect(goalTitles[2]).toContain('Re-added Goal - Should Be Last')
    })

    test('re-added goal appears in current goals tab after confirmation', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Re-add Test Goal',
            areaOfNeed: 'accommodation',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Complete task', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Was removed temporarily' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Ready to work on this again')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('3_months')
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/type=current/)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(1)
      expect(await planOverviewPage.getGoalCardTitle(0)).toContain('Re-add Test Goal')
      expect(await planOverviewPage.goalCardHasTargetDateText(0)).toBe(true)
    })

    // Verifies that after re-adding one of two removed goals, only the un-readded goal remains in the removed tab
    test('re-added goal as future goal does not display target date', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Setup: create an ACTIVE goal with a target date
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal with target date',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Verify the active goal shows target date initially
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.goalCardHasTargetDateText(0)).toBe(true)

      // Remove the goal (this should clear the target_date via markGoalAsRemoved effect)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('Temporarily removing this goal')
      await removePage.clickConfirm()

      // Now re-add as a future goal
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)
      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Will work on this later')
      await readdPage.selectCanStartNow(false)
      await readdPage.clickConfirm()

      // Verify redirected to future goals tab
      await expect(page).toHaveURL(/type=future/)

      // Verify the goal card does NOT show "Aim to achieve this by" text
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.goalCardHasTargetDateText(0)).toBe(false)
    })

    test('re-added goal no longer appears in removed goals tab', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Re-add',
            areaOfNeed: 'accommodation',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Removed' }],
          },
          {
            title: 'Goal To Keep Removed',
            areaOfNeed: 'finances',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Also removed' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.goto('/sentence-plan/v1.0/plan/overview?type=removed')

      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(2)

      const goalUuid = plan.goals[0].uuid
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Re-adding this goal')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('6_months')
      await readdPage.clickConfirm()

      await page.goto('/sentence-plan/v1.0/plan/overview?type=removed')

      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(1)
      expect(await planOverviewPage.getGoalCardTitle(0)).toContain('Goal To Keep Removed')
    })
  })

  test.describe('access control', () => {
    test('redirects to plan overview if plan is not agreed (draft)', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(removedGoals(1)).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('redirects to plan overview if goal is not REMOVED', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Active Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)
      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })
})
