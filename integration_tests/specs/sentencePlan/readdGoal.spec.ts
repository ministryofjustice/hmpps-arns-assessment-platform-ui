import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import ConfirmReaddGoalPage from '../../pages/sentencePlan/confirmReaddGoalPage'
import ViewInactiveGoalPage from '../../pages/sentencePlan/viewInactiveGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { withRemovedGoals, withGoals } from '../../builders'
import { loginAndNavigateToPlanByCrn, getDatePlusDaysAsISO } from './sentencePlanUtils'

test.describe('Re-add goal journey', () => {
  test.describe('confirm goal re-add', () => {
    test('can confirm re-adding a goal as a current goal', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Person is now ready to work on this goal again')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('date_in_3_months')
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/plan\/overview.*type=current/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('can confirm re-adding a goal as a future goal', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Person will work on this in the future')
      await readdPage.selectCanStartNow(false)
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/plan\/overview.*type=future/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('shows validation error when re-add note is empty', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.selectCanStartNow(false)
      await readdPage.clickConfirm()

      expect(await readdPage.hasValidationError()).toBe(true)
      expect(await readdPage.hasReaddNoteError()).toBe(true)
    })

    test('shows validation error when can start now is not selected', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Test note')
      await readdPage.clickConfirm()

      expect(await readdPage.hasValidationError()).toBe(true)
      expect(await readdPage.hasCanStartNowError()).toBe(true)
    })

    test('can cancel and return to view inactive goal page', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.clickCancel()

      await expect(page).toHaveURL(/\/view-inactive-goal/)
    })
  })

  test.describe('page content', () => {
    test('displays page heading with person name', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      const headerText = await readdPage.getHeaderText()

      expect(headerText).toContain('Confirm you want to add this goal back')
      expect(headerText).toContain('plan')
    })

    test('displays goal summary card with goal details', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Find stable housing',
            areaOfNeed: 'accommodation',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Goal was no longer relevant' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      await expect(readdPage.goalCard).toBeVisible()
      expect(await readdPage.getGoalTitle()).toContain('Find stable housing')
    })

    test('re-add note field starts empty', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      expect(await readdPage.getReaddNote()).toBe('')
    })

    test('can start now radio options are not pre-selected', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)

      expect(await readdPage.isCanStartNowYesChecked()).toBe(false)
      expect(await readdPage.isCanStartNowNoChecked()).toBe(false)
    })
  })

  test.describe('navigation from view inactive goal', () => {
    test('clicking Add to plan navigates to confirm re-add page', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)
      await viewPage.clickAddToPlan()

      await expect(page).toHaveURL(/\/confirm-readd-goal/)
      await ConfirmReaddGoalPage.verifyOnPage(page)
    })
  })

  test.describe('re-added goals', () => {
    test('re-added goal appears in current goals tab after confirmation', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Re-add Test Goal',
            areaOfNeed: 'accommodation',
            status: 'REMOVED',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Complete task', status: 'COMPLETED' }],
            notes: [{ type: 'REMOVED', note: 'Was removed temporarily' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Ready to work on this again')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('date_in_3_months')
      await readdPage.clickConfirm()

      await expect(page).toHaveURL(/type=current/)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(1)
      expect(await planOverviewPage.getGoalCardTitle(0)).toContain('Re-add Test Goal')
    })

    // Verifies that after re-adding one of two removed goals, only the un-readded goal remains in the removed tab
    test('re-added goal no longer appears in removed goals tab', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
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
        ],
        'AGREED',
      ).create(aapClient)

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto('/forms/sentence-plan/v1.0/plan/overview?type=removed')

      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(2)

      const goalUuid = plan.goals[0].uuid
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      const readdPage = await ConfirmReaddGoalPage.verifyOnPage(page)
      await readdPage.enterReaddNote('Re-adding this goal')
      await readdPage.selectCanStartNow(true)
      await readdPage.selectTargetDateOption('date_in_6_months')
      await readdPage.clickConfirm()

      await page.goto('/forms/sentence-plan/v1.0/plan/overview?type=removed')

      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      expect(await planOverviewPage.getGoalCount()).toBe(1)
      expect(await planOverviewPage.getGoalCardTitle(0)).toContain('Goal To Keep Removed')
    })
  })

  test.describe('access control', () => {
    test('redirects to plan overview if plan is not agreed (draft)', async ({ page, aapClient }) => {
      const plan = await withRemovedGoals(1).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      await expect(page).toHaveURL(/\/plan\/overview/)
    })

    test('redirects to plan overview if goal is not REMOVED', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Active Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'COMPLETED' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-readd-goal`)

      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })
})
