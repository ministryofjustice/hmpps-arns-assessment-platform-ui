import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmIfAchievedPage from '../../../pages/sentencePlan/confirmIfAchievedPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { getDatePlusDaysAsISO, sentencePlanV1UrlBuilders, sentencePlanV1URLs } from '../sentencePlanUtils'

const planOverviewPageCurrentGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=current`
const planOverviewPageFutureGoalsTabPath = `${sentencePlanV1URLs.PLAN_OVERVIEW}?goalStatusTab=future`

test.describe('Confirm if achieved page - navigation', () => {
  test.describe('back link', () => {
    test('back link navigates to update-goal-steps page', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      await ConfirmIfAchievedPage.verifyOnPage(page)

      // Click back link
      const backLink = page.locator('.govuk-back-link')
      await expect(backLink).toBeVisible()
      await backLink.click()

      // Should navigate to update-goal-steps
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))
    })
  })

  test.describe('entry from update-goal-steps page', () => {
    test('navigates to confirm-if-achieved when all steps are marked as completed', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      // Navigate to update-goal-steps page
      await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

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
      await expect(page).toHaveURL(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))
      await ConfirmIfAchievedPage.verifyOnPage(page)
    })

    test('navigates to plan overview when not all steps are completed for ACTIVE goal', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      // Navigate to update-goal-steps page
      await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

      // Leave the steps as they are (not all completed)
      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview current tab (not confirm-if-achieved)
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })

    test('navigates to plan overview future tab when not all steps are completed for FUTURE goal', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      // Navigate to update-goal-steps page
      await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

      // Leave the steps as they are (not all completed)
      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview future tab (not confirm-if-achieved)
      await expect(page).toHaveURL(planOverviewPageFutureGoalsTabPath)
    })

    test('does not navigate to confirm-if-achieved when some steps are marked as not started yet', async ({
      page,
      openSentencePlan,
    }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      // Navigate to update-goal-steps page
      await page.goto(sentencePlanV1UrlBuilders.goalUpdateSteps(goalUuid))

      // Click Save goal and steps button
      await page.getByRole('button', { name: 'Save goal and steps' }).click()

      // Should navigate to plan overview (not confirm-if-achieved) since not all steps are COMPLETED
      await expect(page).toHaveURL(planOverviewPageCurrentGoalsTabPath)
    })
  })
})
