import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import ConfirmIfAchievedPage from '../../../pages/sentencePlan/confirmIfAchievedPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { getDatePlusDaysAsISO, sentencePlanV1UrlBuilders } from '../sentencePlanUtils'

const allStepsCompletedMessage = 'All steps have been completed. Check if this goal can now be marked as achieved.'

test.describe('Confirm if achieved page - page content', () => {
  test.describe('page content', () => {
    test('displays all steps completed message', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await expect(confirmPage.allStepsCompletedMessage).toBeVisible()
      await expect(confirmPage.allStepsCompletedMessage).toContainText(allStepsCompletedMessage)
    })

    test('displays goal summary card with goal details', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Test Goal Title',
                areaOfNeed: 'accommodation',
                status: 'ACTIVE',
                targetDate: getDatePlusDaysAsISO(90),
                steps: [{ actor: 'probation_practitioner', description: 'Test step description', status: 'COMPLETED' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Goal card should be visible
      await expect(confirmPage.goalCard).toBeVisible()

      // Goal title should be displayed
      const goalTitle = await confirmPage.getGoalTitle()
      expect(goalTitle).toContain('Test Goal Title')
    })

    test('displays goal card with steps', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder
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
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Goal card should show steps
      await expect(confirmPage.goalCard).toContainText('First completed step')
      await expect(confirmPage.goalCard).toContainText('Second completed step')
    })

    test('displays radio button options', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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

    test('has correct fieldset legend', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      await expect(confirmPage.hasAchievedGoalFieldset).toContainText('achieved this goal?')
    })
  })

  test.describe('conditional how helped textarea', () => {
    test('textarea is hidden when No is selected', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

      const confirmPage = await ConfirmIfAchievedPage.verifyOnPage(page)

      // Select No
      await confirmPage.selectNo()
      await confirmPage.isNoSelected()

      // Textarea should remain hidden
      await expect(confirmPage.howHelpedTextarea).toBeHidden()
    })

    test('textarea becomes hidden when switching from Yes to No', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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

    test('how helped textarea has correct label', async ({ page, openSentencePlan }) => {
      const { plan } = await openSentencePlan({
        plan: builder =>
          builder.withGoals(currentGoalsWithCompletedSteps(1))
            .withAgreementStatus('AGREED'),
      })
      const goalUuid = plan.goals[0].uuid

      await page.goto(sentencePlanV1UrlBuilders.goalConfirmIfAchieved(goalUuid))

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
})
