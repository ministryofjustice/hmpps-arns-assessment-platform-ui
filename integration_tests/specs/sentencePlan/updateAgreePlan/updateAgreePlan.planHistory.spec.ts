import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe('Update agree plan - Plan history', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withAgreementStatus('COULD_NOT_ANSWER')
      .save()
    await navigateToSentencePlan(page, handoverLink)
  })

  test('plan history shows agreement entry after Yes update', async ({ page }) => {
    // Complete Yes flow
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.clickSave()

    // Navigate to plan history
    await expect(page).toHaveURL(/\/plan\/overview/)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Verify updated agreement entry
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Agreement updated
      - separator
      - paragraph:
        - strong: Plan created
    `)
  })

  test('plan history shows agreement entry after No update', async ({ page }) => {
    // Complete No flow with details
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await updateAgreePlanPage.selectAgreeNo()
    await updateAgreePlanPage.enterDetailsForNo('They disagree with the current goals.')
    await updateAgreePlanPage.clickSave()

    // Navigate to plan history
    await expect(page).toHaveURL(/\/plan\/overview/)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    // Verify updated agreement entry with disagreement details
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - paragraph:
        - strong: Agreement updated
      - paragraph: /did not agree/
      - paragraph: They disagree with the current goals.
      - separator
      - paragraph:
        - strong: Plan created
    `)
  })
})
