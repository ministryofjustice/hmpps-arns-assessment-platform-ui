import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import { expectPlanAgreementUpdates } from '../../support/featureFlags'
import AgreePlanPage from '../../pages/sentencePlan/agreePlanPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoals, currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  buildPageTitle,
  checkAccessibility,
  navigateToSentencePlan,
  sentencePlanPageTitles,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

const agreementPageTitle = expectPlanAgreementUpdates
  ? 'Have you shared this plan with Test?'
  : sentencePlanPageTitles.agreePlan
const noGoalsError = expectPlanAgreementUpdates
  ? 'To confirm the plan, create a goal to work on now'
  : 'To agree the plan, create a goal to work on now'

test.describe('Plan agreement journey', () => {
  test.describe('access validation - plan overview errors', () => {
    test('shows an error when submitting a plan with no goals', async ({ page, createSession }) => {
      // Setup: create assessment with NO goals
      const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await navigateToSentencePlan(page, handoverLink)

      // Verify we're on plan overview and Agree plan button is visible
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Click the Agree plan button
      await planOverviewPage.agreePlanButton.click()

      // Should stay on overview with validation errors (no redirect)
      await expect(page).toHaveURL(/\/overview/)

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.planOverview))

      // Should show error summary
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText('There is a problem')
      await expect(errorSummary).toContainText(noGoalsError)

      // Should also show inline error on the blank content section
      const inlineError = page.locator('#blank-plan-content .govuk-error-message')
      await expect(inlineError).toContainText(noGoalsError)
    })

    test('shows an error when submitting a plan with goals but no steps', async ({ page, openSentencePlan }) => {
      // Setup: create assessment with goal but NO steps
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoals(1)),
      })

      // Click the Agree plan button
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      // Should stay on overview with validation errors (no redirect)
      await expect(page).toHaveURL(/\/overview/)

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.planOverview))

      // Should show error summary with goal-specific error
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText('There is a problem')
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 1'")

      // Should show inline error on the goal card
      const inlineError = page.locator('.goal-list__item .govuk-error-message')
      await expect(inlineError).toContainText("Add steps to 'Current Goal 1'")
    })

    test('shows multiple errors when multiple goals have no steps', async ({ page, openSentencePlan }) => {
      // Setup: create assessment with 2 goals but NO steps
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoals(2)),
      })

      // Click the Agree plan button
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      // Should stay on overview with validation errors (no redirect)
      await expect(page).toHaveURL(/\/overview/)

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.planOverview))

      // Should show error summary with both goals
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 1'")
      await expect(errorSummary).toContainText("Add steps to 'Current Goal 2'")
    })
  })

  test.describe('access validation - direct navigation via url', () => {
    test('should redirect to plan overview when plan has no steps on active goal', async ({
      page,
      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoals(1)),
      })

      await page.goto(sentencePlanV1URLs.PLAN_AGREE)

      await expect(page).toHaveURL(/\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('should redirect to plan overview when one active goal has steps but another does not', async ({
      page,
      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder =>
          builder
            .withGoal({
              title: 'Goal with steps',
              areaOfNeed: 'finances',
              status: 'ACTIVE',
              steps: [{ actor: 'probation_practitioner', description: 'A step' }],
            })
            .withGoal({
              title: 'Goal without steps',
              areaOfNeed: 'health-and-wellbeing',
              status: 'ACTIVE',
            }),
      })

      await page.goto(sentencePlanV1URLs.PLAN_AGREE)

      await expect(page).toHaveURL(/\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('should redirect to plan overview when plan only has future goals with steps', async ({
      page,
      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder =>
          builder.withGoal({
            title: 'Future goal with steps',
            areaOfNeed: 'finances',
            status: 'FUTURE',
            steps: [{ actor: 'probation_practitioner', description: 'A step' }],
          }),
      })

      await page.goto(sentencePlanV1URLs.PLAN_AGREE)

      await expect(page).toHaveURL(/\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('agree plan form validation', () => {
    test('shows error when saving without selecting an option', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      // Navigate to agree plan page
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Click save without selecting an option
      await agreePlanPage.clickSave()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(agreementPageTitle))

      // Should show inline validation error on the field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_question')
      expect(hasFieldError).toBe(true)

      // Verify error message text
      const errorMessage = await agreePlanPage.getValidationErrorMessage('plan_agreement_question')
      expect(errorMessage).toContain('Select if they agree to the plan')
    })

    test('shows error when selecting No without entering details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      // Navigate to agree plan page
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select No option
      await agreePlanPage.selectAgreeNo()

      // Verify details field is visible
      const isDetailsVisible = await agreePlanPage.isDetailsForNoVisible()
      expect(isDetailsVisible).toBe(true)

      // Click save without entering details
      await agreePlanPage.clickSave()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(agreementPageTitle))

      // Should show validation error for details field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_details_no')
      expect(hasFieldError).toBe(true)
    })

    test('shows error when selecting Could not answer without entering details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      // Navigate to agree plan page
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select Could not answer option
      await agreePlanPage.selectCouldNotAnswer()

      // Verify details field is visible
      const isDetailsVisible = await agreePlanPage.isDetailsForCouldNotAnswerVisible()
      expect(isDetailsVisible).toBe(true)

      // Click save without entering details
      await agreePlanPage.clickSave()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(agreementPageTitle))

      // Should show validation error for details field
      const hasFieldError = await agreePlanPage.hasValidationError('plan_agreement_details_could_not_answer')
      expect(hasFieldError).toBe(true)
    })
  })

  test.describe('agree plan happy paths', () => {
    test('submits a draft plan from the overview with the Yes option', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      const overview = await PlanOverviewPage.verifyOnPage(page)
      await overview.agreePlanButton.click()

      await expect(page).toHaveURL(/\/agree-plan/)
      await expect(page).toHaveTitle(buildPageTitle(agreementPageTitle))
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      if (expectPlanAgreementUpdates) {
        await expect(agreePlanPage.agreementQuestionLegend).toHaveText(agreementPageTitle)
        const header = page.getByTestId('plan-header')
        await expect(header.getByRole('link', { name: 'Return to OASys' })).toBeVisible()
        await expect(header.getByRole('link', { name: 'View previous versions' })).toBeVisible()
      }

      await agreePlanPage.selectAgreeYes()
      await agreePlanPage.enterNotes('Plan discussed and agreed during supervision session.')

      // Save
      await agreePlanPage.clickSave()

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "{name} agreed to their plan on [date]" message for agreed plans
      const agreedMessage = page.locator('.govuk-body', { hasText: 'agreed to their plan on' })
      await expect(agreedMessage).toBeVisible()
      await expect(agreedMessage).toContainText('View plan history')
      await expect(overview.agreePlanButton).toHaveCount(0)
    })

    test('can agree to plan with No option and details', async ({
      page,

      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      // Navigate to agree plan page
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select No
      await agreePlanPage.selectAgreeNo()

      // Enter required details
      await agreePlanPage.enterDetailsForNo('They want to focus on different priorities first.')

      // Save
      await agreePlanPage.clickSave()

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "Plan created on [date]" message for non-agreement plans
      const planCreatedMessage = page.locator('.govuk-body', { hasText: 'Plan created on' })
      await expect(planCreatedMessage).toBeVisible()
      await expect(planCreatedMessage).toContainText('View plan history')
    })

    test('can agree to plan with Could not answer option and details', async ({
      page,

      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })

      // Navigate to agree plan page
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const agreePlanPage = await AgreePlanPage.verifyOnPage(page)

      // Select Could not answer
      await agreePlanPage.selectCouldNotAnswer()

      // Enter required details
      await agreePlanPage.enterDetailsForCouldNotAnswer('Unable to contact - will discuss at next appointment.')

      // Accessibility
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })

      // Save
      await agreePlanPage.clickSave()

      // Verify we're on plan overview
      await PlanOverviewPage.verifyOnPage(page)

      // Should show "Update [name]'s agreement" message for could not answer
      const updateAgreementMessage = page.locator('.govuk-body', { hasText: 'agreement' })
      await expect(updateAgreementMessage).toBeVisible()
      await expect(updateAgreementMessage).toContainText("when you've shared the plan with them")
    })
  })

  test.describe('updated draft plan overview', () => {
    test.skip(!expectPlanAgreementUpdates, 'Requires the plan agreement updates flag')

    test('displays OASys navigation and a secondary Confirm plan button', async ({ page, openSentencePlan }) => {
      await openSentencePlan()
      const overview = await PlanOverviewPage.verifyOnPage(page)
      await expect(overview.header.getByRole('link', { name: 'Return to OASys' })).toBeVisible()
      await expect(overview.header.getByRole('link', { name: 'View previous versions' })).toBeVisible()
      await expect(overview.header.getByRole('button', { name: 'Return to OASys' })).toHaveCount(0)
      await expect(overview.agreePlanButton).toBeVisible()
      await expect(overview.agreePlanButton).toHaveClass(/govuk-button--secondary/)
    })

    test('has no accessibility violations in the main content', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)),
      })
      const overview = await PlanOverviewPage.verifyOnPage(page)
      await expect(overview.planLastUpdatedMessage).toBeVisible()
      await checkAccessibility(page, { include: '#main-content' })
    })

    test('shows the draft last updated date and updater without a plan history link', async ({
      page,
      openSentencePlan,
    }) => {
      await openSentencePlan({
        plan: builder =>
          builder
            .withGoal({
              title: 'Find stable housing',
              areaOfNeed: 'accommodation',
              status: 'ACTIVE',
              createdBy: 'Jane Smith',
            })
            .withEventsBackdated(new Date('2024-06-18T10:00:00Z'), new Date('2024-06-18T11:00:00Z')),
      })
      const overview = await PlanOverviewPage.verifyOnPage(page)
      await expect(overview.planLastUpdatedMessage).toBeVisible()
      await expect(overview.planLastUpdatedMessage).toHaveText('Last updated on 18 June 2024 by Jane Smith.')
      await expect(overview.planLastUpdatedMessage.getByRole('link')).toHaveCount(0)
    })
  })
})
