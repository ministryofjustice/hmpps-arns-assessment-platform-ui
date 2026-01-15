import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import ViewInactiveGoalPage from '../../pages/sentencePlan/viewInactiveGoalPage'
import ConfirmAchievedGoalPage from '../../pages/sentencePlan/confirmAchievedGoalPage'
import ConfirmRemoveGoalPage from '../../pages/sentencePlan/confirmRemoveGoalPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { withGoals, withCurrentGoalsWithCompletedSteps } from '../../builders'
import { loginAndNavigateToPlanByCrn, getDatePlusDaysAsISO } from './sentencePlanUtils'

test.describe('View inactive goal page', () => {
  test.describe('view achieved goal', () => {
    test('displays achieved goal details with correct status text', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Find stable housing',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact housing services', status: 'COMPLETED' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.enterHowHelpedNote('Secured stable housing')
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify page heading and goal title
      const headerText = await viewPage.getHeaderText()
      expect(headerText).toContain('View goal details')

      const goalHeading = await viewPage.getGoalHeading()
      expect(goalHeading).toContain('Find stable accommodation')

      // Verify status text shows "Marked as achieved"
      const statusText = await viewPage.getStatusText()
      expect(statusText).toContain('Marked as achieved on')

      // Verify area of need is displayed in caption
      const captionText = await viewPage.getCaptionText()
      expect(captionText).toContain('Accommodation')
    })

    test('achieved goal does not show "Add to plan" button', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Add to plan button should not be visible for achieved goals
      const isButtonVisible = await viewPage.isAddToPlanButtonVisible()
      expect(isButtonVisible).toBe(false)
    })

    test('back link navigates to achieved goals tab', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Click back link
      await viewPage.clickBackLink()

      // Should navigate to achieved goals tab
      await expect(page).toHaveURL(/type=achieved/)
      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('view removed goal', () => {
    test('displays removed goal details with correct status text', async ({ page, aapClient }) => {
      // Setup: create goal and mark as removed
      const plan = await withGoals(
        [
          {
            title: 'Reduce drug use',
            areaOfNeed: 'drug_misuse',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Attend support group', status: 'NOT_STARTED' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as removed
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('No longer relevant to current situation')
      await removePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify page heading and goal title
      const headerText = await viewPage.getHeaderText()
      expect(headerText).toContain('View goal details')

      const goalHeading = await viewPage.getGoalHeading()
      expect(goalHeading).toContain('Reduce drug use')

      // Verify status text shows "Removed on"
      const statusText = await viewPage.getStatusText()
      expect(statusText).toContain('Removed on')
    })

    test('removed goal shows "Add to plan" button', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as removed
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('Testing button visibility')
      await removePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Add to plan button should be visible for removed goals
      const isButtonVisible = await viewPage.isAddToPlanButtonVisible()
      expect(isButtonVisible).toBe(true)
    })

    test('back link navigates to removed goals tab', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as removed
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-remove-goal`)
      const removePage = await ConfirmRemoveGoalPage.verifyOnPage(page)
      await removePage.enterRemovalNote('Testing back link')
      await removePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Click back link
      await viewPage.clickBackLink()

      // Should navigate to removed goals tab
      await expect(page).toHaveURL(/type=removed/)
      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('steps table', () => {
    test('displays all steps with correct details', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Test Goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'First step', status: 'COMPLETED' },
              { actor: 'person_on_probation', description: 'Second step', status: 'IN_PROGRESS' },
              { actor: 'probation_practitioner', description: 'Third step', status: 'NOT_STARTED' },
            ],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify steps table is visible
      const isTableVisible = await viewPage.isStepsTableVisible()
      expect(isTableVisible).toBe(true)

      // Verify step count
      const stepCount = await viewPage.getStepCount()
      expect(stepCount).toBe(3)

      // Verify step descriptions
      const firstStepDescription = await viewPage.getStepDescription(0)
      expect(firstStepDescription).toContain('First step')

      const secondStepDescription = await viewPage.getStepDescription(1)
      expect(secondStepDescription).toContain('Second step')

      const thirdStepDescription = await viewPage.getStepDescription(2)
      expect(thirdStepDescription).toContain('Third step')
    })
  })

  test.describe('notes section', () => {
    test('displays "View all notes" section', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved with a note
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.enterHowHelpedNote('This helped them find stable housing')
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify notes section is visible
      const isNotesVisible = await viewPage.isViewAllNotesVisible()
      expect(isNotesVisible).toBe(true)

      // Expand notes and verify count
      const noteCount = await viewPage.getNoteCount()
      expect(noteCount).toBeGreaterThanOrEqual(1)

      // Verify note content
      const noteText = await viewPage.getNoteText(0)
      expect(noteText).toContain('This helped them find stable housing')
    })

    test('shows message when goal has no notes', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved without a note
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Expand notes section
      await viewPage.expandViewAllNotes()

      // Verify empty notes message is shown
      const notesSection = viewPage.viewAllNotesDetails
      await expect(notesSection).toContainText('There are no notes on this goal yet')
    })
  })

  test.describe('related areas of need', () => {
    test('displays related areas when present', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Find stable housing',
            areaOfNeed: 'accommodation',
            relatedAreasOfNeed: ['Finances'],
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Contact services', status: 'COMPLETED' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify caption includes related areas
      const captionText = await viewPage.getCaptionText()
      expect(captionText.toLowerCase()).toContain('and')
      expect(captionText.toLowerCase()).toContain('finance')
    })

    test('does not show "(and ...)" when no related areas', async ({ page, aapClient }) => {
      const plan = await withGoals(
        [
          {
            title: 'Simple goal',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step 1', status: 'COMPLETED' }],
          },
        ],
        'AGREED',
      ).create(aapClient)
      const goalUuid = plan.goals[0].uuid

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Mark goal as achieved
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/confirm-achieved-goal`)
      const achievePage = await ConfirmAchievedGoalPage.verifyOnPage(page)
      await achievePage.clickConfirm()

      // Navigate to view-inactive-goal page
      await page.goto(`/forms/sentence-plan/v1.0/goal/${goalUuid}/view-inactive-goal`)

      const viewPage = await ViewInactiveGoalPage.verifyOnPage(page)

      // Verify caption does not include "(and ...)"
      const captionText = await viewPage.getCaptionText()
      expect(captionText.toLowerCase()).not.toContain('and')
    })
  })

  test.describe('access control', () => {
    test('redirects to plan overview if goal not found', async ({ page, aapClient }) => {
      const plan = await withCurrentGoalsWithCompletedSteps(1, 'AGREED').create(aapClient)
      const invalidGoalUuid = '00000000-0000-0000-0000-000000000000'

      await loginAndNavigateToPlanByCrn(page, plan.crn)

      // Try to navigate with invalid goal UUID
      await page.goto(`/forms/sentence-plan/v1.0/goal/${invalidGoalUuid}/view-inactive-goal`)

      // Should redirect to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)
    })
  })
})
