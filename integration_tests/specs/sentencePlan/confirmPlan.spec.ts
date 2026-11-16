import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import AgreePlanPage from '../../pages/sentencePlan/agreePlanPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { currentGoals, currentGoalsWithCompletedSteps } from '../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  buildPageTitle,
  checkAccessibility,
  sentencePlanPageTitles,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

test.describe('Plan confirmation journey (draft confirmation flag on)', () => {
  const confirmationPageTitle = 'Have you shared this plan with Test?'

  test('displays the draft header with OASys navigation and a secondary Confirm plan button', async ({
    page,
    openSentencePlan,
    makeAxeBuilder,
  }) => {
    await openSentencePlan()
    const overview = await PlanOverviewPage.verifyOnPage(page)
    await expect(overview.header.getByRole('link', { name: 'Return to OASys' })).toBeVisible()
    await expect(overview.header.getByRole('link', { name: 'View previous versions' })).toBeVisible()
    await expect(overview.header.getByRole('button', { name: 'Return to OASys' })).toHaveCount(0)
    await expect(overview.agreePlanButton).toHaveText('Confirm plan')
    await expect(overview.agreePlanButton).toHaveClass(/govuk-button--secondary/)
    expect((await makeAxeBuilder().include('header').analyze()).violations).toEqual([])
  })

  test('shows last updated for draft plans with goals without a history link', async ({ page, openSentencePlan }) => {
    await openSentencePlan({ plan: builder => builder.withGoals(currentGoals(1)) })
    const overview = await PlanOverviewPage.verifyOnPage(page)
    await expect(overview.planLastUpdatedMessage).toBeVisible()
    await expect(overview.planLastUpdatedMessage).toContainText('Last updated on')
    await expect(overview.planLastUpdatedMessage).not.toContainText('View plan history')
    await expect(overview.planAgreedMessage).not.toBeVisible()
    await expect(overview.planCreatedMessage).not.toBeVisible()
  })

  test('hides last updated for draft plans without goals', async ({ page, openSentencePlan }) => {
    await openSentencePlan()
    const overview = await PlanOverviewPage.verifyOnPage(page)
    await expect(overview.planLastUpdatedMessage).toHaveCount(0)
  })

  test.describe('access validation - plan overview errors', () => {
    test('shows error when clicking Confirm plan with no goals', async ({ page, openSentencePlan }) => {
      await openSentencePlan()
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(planOverviewPage.agreePlanButton).toHaveText('Confirm plan')
      await expect(planOverviewPage.agreePlanButton).toHaveClass(/govuk-button--secondary/)
      await planOverviewPage.agreePlanButton.click()

      await expect(page).toHaveURL(/\/overview/)
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.planOverview))
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary).toContainText('There is a problem')
      const noGoalsError = 'To confirm the plan, create a goal to work on now'
      await expect(errorSummary).toContainText(noGoalsError)
      await expect(page.locator('#blank-plan-content .govuk-error-message')).toContainText(noGoalsError)
    })

    test('shows an error when a current goal has no steps', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoals(1)) })
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      await expect(page).toHaveURL(/\/overview/)
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.planOverview))
      await expect(page.locator('.govuk-error-summary')).toContainText("Add steps to 'Current Goal 1'")
      await expect(page.locator('.goal-list__item .govuk-error-message')).toContainText("Add steps to 'Current Goal 1'")
    })

    test('shows errors when multiple current goals have no steps', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoals(2)) })
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      await expect(page).toHaveURL(/\/overview/)
      await expect(page.locator('.govuk-error-summary')).toContainText("Add steps to 'Current Goal 1'")
      await expect(page.locator('.govuk-error-summary')).toContainText("Add steps to 'Current Goal 2'")
    })

    test('can access the shared plan question when goals have steps', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.agreePlanButton.click()

      await expect(page).toHaveURL(/\/agree-plan/)
      await expect(page).toHaveTitle(buildPageTitle(confirmationPageTitle))
      await AgreePlanPage.verifyOnPage(page, true)
      await expect(page.locator('legend')).toHaveText(confirmationPageTitle)
      const returnLink = page.getByRole('link', { name: 'Return to OASys' })
      await expect(returnLink).toBeVisible()
      await expect(returnLink).toHaveAttribute('href', /.+/)
      await expect(page.getByTestId('plan-header').getByRole('link', { name: 'View previous versions' })).toBeVisible()
    })
  })

  test.describe('access validation - direct navigation via url', () => {
    test('redirects direct access when a current goal has no steps', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoals(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      await expect(page).toHaveURL(/\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('redirects direct access when one current goal has no steps', async ({ page, openSentencePlan }) => {
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

    test('redirects to plan overview when plan only has future goals with steps', async ({
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

  test.describe('confirm plan form validation', () => {
    test('shows error when saving without selecting an option', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.clickSave()

      await expect(page).toHaveTitle(buildErrorPageTitle(confirmationPageTitle))
      expect(await confirmPlanPage.hasValidationError('plan_agreement_question')).toBe(true)
      expect(await confirmPlanPage.getValidationErrorMessage('plan_agreement_question')).toContain(
        'Select if they agree to the plan',
      )
    })

    test('shows error when selecting No without entering details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectAgreeNo()
      expect(await confirmPlanPage.isDetailsForNoVisible()).toBe(true)
      await confirmPlanPage.clickSave()

      await expect(page).toHaveTitle(buildErrorPageTitle(confirmationPageTitle))
      expect(await confirmPlanPage.hasValidationError('plan_agreement_details_no')).toBe(true)
    })

    test('shows error when selecting Could not answer without entering details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectCouldNotAnswer()
      expect(await confirmPlanPage.isDetailsForCouldNotAnswerVisible()).toBe(true)
      await confirmPlanPage.clickSave()

      await expect(page).toHaveTitle(buildErrorPageTitle(confirmationPageTitle))
      expect(await confirmPlanPage.hasValidationError('plan_agreement_details_could_not_answer')).toBe(true)
    })
  })

  test.describe('confirm plan happy paths', () => {
    test('can confirm the plan with Yes option', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectAgreeYes()
      await confirmPlanPage.enterNotes('Plan discussed and agreed during supervision session.')
      await confirmPlanPage.clickSave()

      await PlanOverviewPage.verifyOnPage(page)
      const agreedMessage = page.locator('.govuk-body', { hasText: 'agreed to their plan on' })
      await expect(agreedMessage).toBeVisible()
      await expect(agreedMessage).toContainText('View plan history')
    })

    test('can confirm the plan with No option and details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectAgreeNo()
      await confirmPlanPage.enterDetailsForNo('They want to focus on different priorities first.')
      await confirmPlanPage.clickSave()

      await PlanOverviewPage.verifyOnPage(page)
      const planCreatedMessage = page.locator('.govuk-body', { hasText: 'Plan created on' })
      await expect(planCreatedMessage).toBeVisible()
      await expect(planCreatedMessage).toContainText('View plan history')
    })

    test('can confirm the plan with Could not answer option and details', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectCouldNotAnswer()
      await confirmPlanPage.enterDetailsForCouldNotAnswer('Unable to contact - will discuss at next appointment.')
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
      await confirmPlanPage.clickSave()

      await PlanOverviewPage.verifyOnPage(page)
      const updateAgreementMessage = page.locator('.govuk-body', { hasText: 'agreement' })
      await expect(updateAgreementMessage).toBeVisible()
      await expect(updateAgreementMessage).toContainText("when you've shared the plan with them")
    })
  })

  test.describe('confirm plan button visibility', () => {
    test('Confirm plan button is visible for draft plans', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(planOverviewPage.agreePlanButton).toBeVisible()
      await expect(planOverviewPage.agreePlanButton).toHaveText('Confirm plan')
    })

    test('Confirm plan button is hidden after the plan is confirmed', async ({ page, openSentencePlan }) => {
      await openSentencePlan({ plan: builder => builder.withGoals(currentGoalsWithCompletedSteps(1)) })
      await page.goto(sentencePlanV1URLs.PLAN_AGREE)
      const confirmPlanPage = await AgreePlanPage.verifyOnPage(page, true)
      await confirmPlanPage.selectAgreeYes()
      await confirmPlanPage.clickSave()

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await expect(planOverviewPage.agreePlanButton).not.toBeVisible()
    })
  })
})
