import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import ConfirmIfAchievedPage from '../../pages/sentencePlan/confirmIfAchievedPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import { getDatePlusDaysAsISO, navigateToSentencePlan, sentencePlanV1URLs } from './sentencePlanUtils'

const confirmIfAchievedPath = '/confirm-if-achieved'
const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=future`
const planOverviewPageAchievedGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=achieved`
const updateGoalAndStepsPath = `/update-goal-steps`
const allStepsCompletedMessage = 'All steps have been completed. Check if this goal can now be marked as achieved.'

test.describe('Confirm if achieved page', () => {
  test.describe('access control', () => {
    test('redirects to plan overview when plan is not agreed (draft)', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Try to access confirm-if-achieved page directly
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      // Should be redirected to plan overview
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('allows access when plan status is AGREED', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
    })

    test('allows access when plan status is COULD_NOT_ANSWER', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('COULD_NOT_ANSWER')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
    })

    test('allows access when plan status is DO_NOT_AGREE', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('DO_NOT_AGREE')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Try to access confirm-if-achieved page directly
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      // Should be on the confirm-if-achieved page
      await ConfirmIfAchievedPage.verifyOnPage(page)
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
    })
  })

  test.describe('validation', () => {
    test('shows inline error when no option is selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Submit without selecting an option
      await confirmPage.clickSaveAndContinue()

      // Should show inline validation error near the radio buttons
      expect(confirmPage.hasInlineError())
      const errorText = await confirmPage.getInlineErrorText()
      expect(errorText).toContain('Select if they have achieved this goal')

      // Should still be on the same page
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
    })
  })

  test.describe('selecting Yes', () => {
    test('can confirm goal as achieved with optional note', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select Yes
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()

      // Enter optional note
      await confirmPage.enterHowHelpedNote('This helped them secure stable accommodation')

      // Submit
      await confirmPage.clickSaveAndContinue()

      // Should redirect to achieved tab
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)
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

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select Yes without entering a note
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      await confirmPage.clickSaveAndContinue()

      // Should still redirect to achieved tab (note is optional)
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)
    })

    test('how helped textarea appears when Yes is selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Initially the textarea should be hidden
      await expect(confirmPage.howHelpedTextarea).toBeHidden()

      // Select Yes
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()

      // Textarea should now be visible
      await expect(confirmPage.howHelpedTextarea).toBeVisible()
    })
  })

  test.describe('selecting No', () => {
    test('redirects to current tab for ACTIVE goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Active Goal With Completed Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Completed step', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await confirmPage.clickSaveAndContinue()

      // Should redirect to current goals tab (not achieved, since goal is ACTIVE)
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('redirects to future tab for FUTURE goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Future Goal With Completed Steps',
            areaOfNeed: 'finances',
            status: 'FUTURE',
            steps: [{ actor: 'person_on_probation', description: 'Completed step', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await confirmPage.clickSaveAndContinue()

      // Should redirect to future goals tab (goal is FUTURE)
      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })

    test('goal remains unchanged when No is selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal Should Remain Active',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step one', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await confirmPage.clickSaveAndContinue()

      // Verify we're on current tab
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)

      // Goal should still be in current goals
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Goal Should Remain Active')
    })
  })

  test.describe('page content', () => {
    test('displays all steps completed message', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await expect(confirmPage.allStepsCompletedMessage).toBeVisible()
      await expect(confirmPage.allStepsCompletedMessage).toContainText(allStepsCompletedMessage)
    })

    test('displays goal summary card with goal details', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Test Goal Title',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Test step description', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Goal card should be visible
      await expect(confirmPage.goalCard).toBeVisible()

      // Goal title should be displayed
      const goalTitle = await confirmPage.getGoalTitle()
      expect(goalTitle).toContain('Test Goal Title')
    })

    test('displays goal card with steps', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Multiple Steps',
            areaOfNeed: 'employment-and-education',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'First completed step', status: 'COMPLETED' },
              { actor: 'person_on_probation', description: 'Second completed step', status: 'COMPLETED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`/sentence-plan/v1.0/goal/${goalUuid}/confirm-if-achieved`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Goal card should show steps
      await expect(confirmPage.goalCard).toContainText('First completed step')
      await expect(confirmPage.goalCard).toContainText('Second completed step')
    })

    test('displays radio button options', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Radio options should be visible
      await expect(confirmPage.yesRadio).toBeVisible()
      await expect(confirmPage.noRadio).toBeVisible()

      // Check the labels
      const yesLabel = page.locator('label[for="has_achieved_goal"]')
      await expect(yesLabel).toContainText('Yes, mark it as achieved')

      const noLabel = page.locator('label[for="has_achieved_goal-2"]')
      await expect(noLabel).toContainText('No, go to')
    })

    test('has correct fieldset legend', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await expect(confirmPage.hasAchievedGoalFieldset).toContainText('achieved this goal?')
    })
  })

  test.describe('conditional how helped textarea', () => {
    test('textarea is hidden when No is selected', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()

      // Textarea should remain hidden
      await expect(confirmPage.howHelpedTextarea).toBeHidden()
    })

    test('textarea becomes hidden when switching from Yes to No', async ({
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

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select Yes - textarea should appear
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      expect(confirmPage.isHowHelpedTextareaVisible())

      // Enter some text
      await confirmPage.enterHowHelpedNote('Some note')

      // Switch to No - textarea should hide
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await expect(confirmPage.howHelpedTextarea).toBeHidden()
    })

    test('how helped textarea has correct label', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select Yes to show the textarea
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()

      // Check the label contains the expected text
      const textareaLabel = page.locator('label[for="how_helped"]')
      await expect(textareaLabel).toContainText('achieving this goal has helped')
      await expect(textareaLabel).toContainText('(optional)')
    })
  })

  test.describe('achieved goals integration', () => {
    test('goal appears in achieved tab after confirming Yes', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Be Achieved',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Complete this', status: 'COMPLETED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      await confirmPage.clickSaveAndContinue()

      // Should be on achieved tab
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)

      // Goal should be visible in achieved tab
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Goal To Be Achieved')
    })

    test('goal no longer appears in current tab after confirming Yes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal To Move',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'COMPLETED' }],
          },
          {
            title: 'Goal To Stay',
            areaOfNeed: 'finances',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'person_on_probation', description: 'Other step', status: 'NOT_STARTED' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()

      await navigateToSentencePlan(page, handoverLink)

      // Verify we start with 2 current goals
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      let goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      // Confirm the first goal as achieved
      const firstGoalUuid = plan.goals[0].uuid
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${firstGoalUuid}${confirmIfAchievedPath}`)

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      await confirmPage.clickSaveAndContinue()

      // Navigate to current tab
      await page.goto(planOverviewPageCurrentGoalsTabPath)

      // Only 1 goal should remain
      planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(1)

      // The remaining goal should be "Goal To Stay"
      const remainingTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(remainingTitle).toContain('Goal To Stay')
    })
  })

  test.describe('back link', () => {
    test('back link navigates to update-goal-steps page', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoalsWithCompletedSteps(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`)

      await ConfirmIfAchievedPage.verifyOnPage(page)

      // Click back link
      const backLink = page.locator('.govuk-back-link')
      await expect(backLink).toBeVisible()
      await backLink.click()

      // Should navigate to update-goal-steps
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`,
      )
    })
  })

  test.describe('entry from update-goal-steps page', () => {
    test('navigates to confirm-if-achieved when all steps are marked as completed', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Incomplete Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'First step', status: 'NOT_STARTED' },
              { actor: 'person_on_probation', description: 'Second step', status: 'IN_PROGRESS' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to update-goal-steps page
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // Verify we're on update-goal-steps page
      await expect(page.locator('h1')).toContainText('Update goal and steps')

      // Change all step statuses to COMPLETED
      const step0Select = page.locator('select[name="step_status_0"]')
      const step1Select = page.locator('select[name="step_status_1"]')

      await step0Select.selectOption('COMPLETED')
      await step1Select.selectOption('COMPLETED')

      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to confirm-if-achieved page
      await expect(page).toHaveURL(
        `${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${confirmIfAchievedPath}`,
      )
      await ConfirmIfAchievedPage.verifyOnPage(page)
    })

    test('navigates to plan overview when not all steps are completed for ACTIVE goal', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Mixed Step Status',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'First step', status: 'COMPLETED' },
              { actor: 'person_on_probation', description: 'Second step', status: 'NOT_STARTED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to update-goal-steps page
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // Leave the steps as they are (not all completed)
      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview current tab (not confirm-if-achieved)
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('navigates to plan overview future tab when not all steps are completed for FUTURE goal', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Future Goal With Incomplete Steps',
            areaOfNeed: 'finances',
            status: 'FUTURE',
            steps: [
              { actor: 'probation_practitioner', description: 'First step', status: 'IN_PROGRESS' },
              { actor: 'person_on_probation', description: 'Second step', status: 'NOT_STARTED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to update-goal-steps page
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // Leave the steps as they are (not all completed)
      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview future tab (not confirm-if-achieved)
      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })

    test('does not navigate to confirm-if-achieved when some steps are marked as not started yet', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Blocked Steps',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [
              { actor: 'probation_practitioner', description: 'First step', status: 'COMPLETED' },
              { actor: 'person_on_probation', description: 'Second step', status: 'NOT_STARTED' },
            ],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      // Navigate to update-goal-steps page
      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview (not confirm-if-achieved) since not all steps are COMPLETED
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })
  })
})
