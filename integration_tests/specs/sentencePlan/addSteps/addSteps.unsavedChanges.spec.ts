import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import AddStepsPage from '../../../pages/sentencePlan/addStepsPage'
import { getDatePlusDaysAsISO, sentencePlanV1UrlBuilders } from '../sentencePlanUtils'

test.describe('Add or update steps page - unsaved changes', () => {
  const goalWithTwoSteps = {
    title: 'Goal with two steps',
    areaOfNeed: 'accommodation',
    status: 'ACTIVE' as const,
    targetDate: getDatePlusDaysAsISO(90),
    steps: [
      { actor: 'probation_practitioner', description: 'First step', status: 'NOT_STARTED' as const },
      { actor: 'probation_practitioner', description: 'Second step', status: 'NOT_STARTED' as const },
    ],
  }

  test('shows a removed step again when returning to the page without saving', async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([goalWithTwoSteps]).withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid
    const stepRows = page.locator('[data-qa="step-row"]')

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.clickRemoveStep(0)
    await expect(stepRows).toHaveCount(1)

    await addStepsPage.clickBack()
    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

    await expect(stepRows).toHaveCount(2)
    await expect(await addStepsPage.getStepDescriptionInput(0)).toHaveValue('First step')
    await expect(await addStepsPage.getStepDescriptionInput(1)).toHaveValue('Second step')
  })

  test('drops an added step when returning to the page without saving', async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([goalWithTwoSteps]).withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid
    const stepRows = page.locator('[data-qa="step-row"]')

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.clickAddStep()
    await expect(stepRows).toHaveCount(3)

    await addStepsPage.clickBack()
    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))

    await expect(stepRows).toHaveCount(2)
  })

  test('keeps unsaved step changes across add, remove and validation reloads', async ({ page, openSentencePlan }) => {
    const { plan } = await openSentencePlan({
      plan: builder => builder.withGoals([goalWithTwoSteps]).withAgreementStatus('AGREED'),
    })
    const goalUuid = plan.goals[0].uuid
    const stepRows = page.locator('[data-qa="step-row"]')

    await page.goto(sentencePlanV1UrlBuilders.goalAddSteps(goalUuid))
    const addStepsPage = await AddStepsPage.verifyOnPage(page)
    await addStepsPage.clickRemoveStep(0)
    await addStepsPage.clickAddStep()
    await addStepsPage.clickAddStep()
    await expect(stepRows).toHaveCount(3)

    await addStepsPage.clickSaveAndContinue()

    await expect(page.locator('.govuk-error-summary')).toBeVisible()
    await expect(stepRows).toHaveCount(3)
    await expect(await addStepsPage.getStepDescriptionInput(0)).toHaveValue('Second step')
  })
})
