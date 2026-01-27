import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import AgreePlanPage from '../../pages/sentencePlan/agreePlanPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoals, currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import { navigateToSentencePlan } from './sentencePlanUtils'

test.describe('Agree plan journey', () => {
  test.describe('access validation - plan overview errors', () => {
    test('shows error when clicking Agree plan with no goals', async ({ page, createSession }) => {
      // Setup: create assessment with NO goals
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      // Verify we're on plan overview and Agree plan button is visible
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Click the Agree plan button
      await planOverviewPage.agreePlanButton.click()

      // Should redirect back to overview with error param
      await expect(page).toHaveURL(/type=current.*error=no-active-goals|error=no-active-goals.*type=current/)

      // Should show error summary
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText('There is a problem')
      await expect(errorSummary).toContainText('To agree the plan, create a goal to work on now')

      // Should also show inline error on the blank content section
      const inlineError = page.locator('#blank-plan-content .govuk-error-message')
      await expect(inlineError).toContainText('To agree the plan, create a goal to work on now')
    })

    test('shows error when clicking Agree plan with goals but no steps', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Setup: create assessment with goal but NO steps
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Click the Agree plan button
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      // Should redirect back to overview with error param
      await expect(page).toHaveURL(/error=no-steps/)

      // Should show error summary with goal-specific error
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText('There is a problem')
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 1'")

      // Should show inline error on the goal card
      const inlineError = page.locator('.goal-list__item .govuk-error-message')
      await expect(inlineError).toContainText("Add steps to 'Current Goal 1'")
    })

    test('shows multiple errors when multiple goals have no steps', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Setup: create assessment with 2 goals but NO steps
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(2)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Click the Agree plan button
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      // Should redirect back to overview with error param
      await expect(page).toHaveURL(/error=no-steps/)

      // Should show error summary with both goals
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 1'")
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 2'")
    })

    test('can access Agree plan page when goals have steps', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Click the Agree plan button
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      // Should successfully navigate to agree plan page
      await expect(page).toHaveURL(/\/agree-plan/)

      // Verify we're on the agree plan page
      await AgreePlanPage.verifyOnPage(page)
    })
  })

  test.describe('agree plan form validation', () => {
    test('shows error when saving without selecting an option', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Click save without selecting an option
      await agreePlanPage.clickSave()

      // Should show inline validation error on the field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_question')
      expect(hasFieldError).toBe(true)

      // Verify error message text
      const errorMessage = await agreePlanPage.getValidationErrorMessage('plan_agreement_question')
      expect(errorMessage).toContain('Select if they agree to the plan')
    })

    test('shows error when selecting No without entering details', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select No option
      await agreePlanPage.selectAgreeNo()

      // Verify details field is visible
      const isDetailsVisible = await agreePlanPage.isDetailsForNoVisible()
      expect(isDetailsVisible).toBe(true)

      // Click save without entering details
      await agreePlanPage.clickSave()

      // Should show validation error for details field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_details_no')
      expect(hasFieldError).toBe(true)
    })

    test('shows error when selecting Could not answer without entering details', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select Could not answer option
      await agreePlanPage.selectCouldNotAnswer()

      // Verify details field is visible
      const isDetailsVisible = await agreePlanPage.isDetailsForCouldNotAnswerVisible()
      expect(isDetailsVisible).toBe(true)

      // Click save without entering details
      await agreePlanPage.clickSave()

      // Should show validation error for details field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_details_could_not_answer')
      expect(hasFieldError).toBe(true)
    })
  })

  test.describe('agree plan happy paths', () => {
    test('can agree to plan with Yes option', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      await agreePlanPage.selectAgreeYes()
      await agreePlanPage.enterNotes('Plan discussed and agreed during supervision session.')

      // Save
      await agreePlanPage.clickSave()

      // Should redirect to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "Plan created on [date]" message for agreed plans
      const planCreatedMessage = page.locator('.govuk-body', { hasText: 'Plan created on' })
      await expect(planCreatedMessage).toBeVisible()
      await expect(planCreatedMessage).toContainText('View plan history')
    })

    test('can agree to plan with No option and details', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select No
      await agreePlanPage.selectAgreeNo()

      // Enter required details
      await agreePlanPage.enterDetailsForNo('They want to focus on different priorities first.')

      // Save
      await agreePlanPage.clickSave()

      // Should redirect to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "Plan created on [date]" message (same as Yes - both are final agreements)
      const planCreatedMessage = page.locator('.govuk-body', { hasText: 'Plan created on' })
      await expect(planCreatedMessage).toBeVisible()
      await expect(planCreatedMessage).toContainText('View plan history')
    })

    test('can agree to plan with Could not answer option and details', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan page
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select Could not answer
      await agreePlanPage.selectCouldNotAnswer()

      // Enter required details
      await agreePlanPage.enterDetailsForCouldNotAnswer('Unable to contact - will discuss at next appointment.')

      // Save
      await agreePlanPage.clickSave()

      // Should redirect to plan overview
      await expect(page).toHaveURL(/\/plan\/overview/)

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "Update [name]'s agreement" message for could not answer
      const updateAgreementMessage = page.locator('.govuk-body', { hasText: 'agreement' })
      await expect(updateAgreementMessage).toBeVisible()
      await expect(updateAgreementMessage).toContainText("when you've shared the plan with them")
    })
  })

  test.describe('agree plan button visibility', () => {
    test('Agree plan button is visible for draft plans', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Agree plan button should be visible
      await expect(planOverviewPage.agreePlanButton).toBeVisible()
    })

    test('Agree plan button is hidden after plan is agreed', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoalsWithCompletedSteps(1)).save()
      await navigateToSentencePlan(page, handoverLink)

      // Navigate to agree plan and agree
      await page.goto('/forms/sentence-plan/v1.0/plan/agree-plan')
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)
      await agreePlanPage.selectAgreeYes()
      await agreePlanPage.clickSave()

      // Verify we're back on plan overview
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Agree plan button should be hidden now
      await expect(planOverviewPage.agreePlanButton).not.toBeVisible()
    })
  })
})
