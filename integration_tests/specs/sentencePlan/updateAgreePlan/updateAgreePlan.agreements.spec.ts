import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan } from '../sentencePlanUtils'

test.describe('Update agree plan - Agreements', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('COULD_NOT_ANSWER')
      .save()
    await navigateToSentencePlan(page, handoverLink)
  })

  test('can update agreement with Yes and redirects to plan overview', async ({ page }) => {
    // Navigate to update agree plan
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    // Select Yes and save
    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.clickSave()

    // Should redirect to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
    await PlanOverviewPage.verifyOnPage(page)

    // Should show "{name} agreed to their plan on" message (UPDATED_AGREED)
    const message = page.locator('.govuk-body', { hasText: 'agreed to their plan on' })
    await expect(message).toMatchAriaSnapshot(`
      - paragraph:
        - text: /agreed to their plan on/
        - link "View plan history"
    `)
  })

  test('can update agreement with No and details, redirects to plan overview', async ({ page }) => {
    // Navigate to update agree plan
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    // Select No, enter details, save
    await updateAgreePlanPage.selectAgreeNo()
    await updateAgreePlanPage.enterDetailsForNo('They want to review the plan again next week.')
    await updateAgreePlanPage.clickSave()

    // Should redirect to plan overview
    await expect(page).toHaveURL(/\/plan\/overview/)
    await PlanOverviewPage.verifyOnPage(page)

    // Should show "Plan created on" message (UPDATED_DO_NOT_AGREE)
    const message = page.locator('.govuk-body', { hasText: 'Plan created on' })
    await expect(message).toMatchAriaSnapshot(`
      - paragraph:
        - text: /Plan created on/
        - link "View plan history"
    `)
  })
})
