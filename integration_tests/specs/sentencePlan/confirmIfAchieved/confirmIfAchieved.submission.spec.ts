import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmIfAchievedPage from '../../../pages/sentencePlan/confirmIfAchievedPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import {
  buildErrorPageTitle,
  getDatePlusDaysAsISO,
  sentencePlanPageTitles,
  sentencePlanV1UrlBuilders,
  sentencePlanV1URLs,
} from '../sentencePlanUtils'

const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=future`
const planOverviewPageAchievedGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=achieved`

test.describe('Confirm if achieved page - submission', () => {
  test.describe('validation', () => {
    test('shows inline error when no option is selected', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Submit without selecting an option
      await confirmPage.clickSaveAndContinue()

      // ensure error page title is correct:
      await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.confirmIfAchieved))

      // Should show inline validation error near the radio buttons
      expect(confirmPage.hasInlineError())
      const errorText = await confirmPage.getInlineErrorText()
      expect(errorText).toContain('Select if they have achieved this goal')

      // Should still be on the same page
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
    })
  })

  test.describe('selecting Yes', () => {
    test('can confirm goal as achieved with optional note', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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
    })

    test('can confirm goal as achieved without optional note', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select Yes without entering a note
      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      await confirmPage.clickSaveAndContinue()

      // Should still redirect to achieved tab (note is optional)
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)
    })

    test('how helped textarea appears when Yes is selected', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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
    test('redirects to current tab for ACTIVE goals', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Active Goal With Completed Steps',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Completed step', status: 'COMPLETED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await confirmPage.clickSaveAndContinue()

      // Should redirect to current goals tab (not achieved, since goal is ACTIVE)
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('redirects to future tab for FUTURE goals', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Future Goal With Completed Steps',
                areaOfNeed: 'finances',
                status: 'FUTURE',
                steps: [{ actor: 'person_on_probation', description: 'Completed step', status: 'COMPLETED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()
      await confirmPage.clickSaveAndContinue()

      // Should redirect to future goals tab (goal is FUTURE)
      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })

    test('goal remains unchanged when No is selected', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal Should Remain Active',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Step one', status: 'COMPLETED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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

  test.describe('achieved goals integration', () => {
    test('goal appears in achieved tab after confirming Yes', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Goal To Be Achieved',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Complete this', status: 'COMPLETED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await confirmPage.selectYes()
      await confirmPage.isYesSelected()
      await confirmPage.clickSaveAndContinue()

      // Should be on achieved tab
      await expect(page).toHaveURL(planOverviewPageAchievedGoalsTabPath)

      // Goal should be visible in achieved tab
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // ensure notification banner is visible
      await expect(planOverviewPage.notificationBanner).toBeVisible()
      await expect(planOverviewPage.notificationBannerText).toContainText('Congratulations on achieving a goal,')

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Goal To Be Achieved')
    })

    test('goal no longer appears in current tab after confirming Yes', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })

      // Verify we start with 2 current goals
      let planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      let goalCount = await planOverviewPage.getGoalCount()
      expect(goalCount).toBe(2)

      // Confirm the first goal as achieved
      const firstGoalUuid = plan.goals[0].uuid
      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(firstGoalUuid))

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
})
