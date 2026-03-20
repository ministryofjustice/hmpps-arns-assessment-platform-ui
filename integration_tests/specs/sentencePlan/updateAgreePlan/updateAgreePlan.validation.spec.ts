import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { buildErrorPageTitle, navigateToSentencePlan, sentencePlanPageTitles } from '../sentencePlanUtils'

test.describe('Update agree plan - Validation', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('COULD_NOT_ANSWER')
      .save()
    await navigateToSentencePlan(page, handoverLink)
  })

  test('shows validation error when submitting without selecting an option', async ({ page }) => {
    // Navigate to update agree plan via plan overview link
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()

    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)
    await updateAgreePlanPage.clickSave()
    await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.updateAgreePlan))

    // Assert validation error on the radio field
    const hasFieldError = await updateAgreePlanPage.hasValidationError('update_plan_agreement_question')
    expect(hasFieldError).toBe(true)
  })

  test('shows error when selecting No without entering details', async ({ page }) => {
    // Navigate to update agree plan via plan overview link
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    // Select No option
    await updateAgreePlanPage.selectAgreeNo()

    // Verify details textarea is visible
    const isDetailsVisible = await updateAgreePlanPage.isDetailsForNoVisible()
    expect(isDetailsVisible).toBe(true)

    // Click save without entering details
    await updateAgreePlanPage.clickSave()

    // Assert error page title
    await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.updateAgreePlan))

    // Assert validation error on the details field
    const hasFieldError = await updateAgreePlanPage.hasValidationError('update_plan_agreement_details_no')
    expect(hasFieldError).toBe(true)
  })
})
