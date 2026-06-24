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
      - heading /Agreement updated/
      - heading /Plan created/
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

    await planHistoryPage.clickShowAllSectionsButton()

    // Verify updated agreement entry with disagreement details
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - heading /Agreement updated.*did not agree.*/
      - paragraph: They disagree with the current goals.
      - heading /Plan created/
    `)
  })

  test('plan history shows notes after Yes update with notes', async ({ page }) => {
    // Complete Yes flow with notes
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.enterNotes('Person on probation agreed to the plan')
    await updateAgreePlanPage.clickSave()

    // Navigate to plan history
    await expect(page).toHaveURL(/\/plan\/overview/)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await planHistoryPage.clickShowAllSectionsButton()

    // Verify updated agreement entry with notes
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - heading /Agreement updated.*agreed to this plan.*/
      - paragraph: Person on probation agreed to the plan
      - heading /Plan created/
    `)
  })

  test('plan history shows notes after No update with notes', async ({ page }) => {
    // Complete No flow with details and notes
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await updateAgreePlanPage.selectAgreeNo()
    await updateAgreePlanPage.enterDetailsForNo('They want to review the plan again next week.')
    await updateAgreePlanPage.enterNotes('They have a meeting with the probation practitioner')
    await updateAgreePlanPage.clickSave()

    // Navigate to plan history
    await expect(page).toHaveURL(/\/plan\/overview/)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await planHistoryPage.clickShowAllSectionsButton()

    // Verify updated agreement entry with disagreement details and notes
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - heading /Agreement updated.*did not agree.*/
      - paragraph: They want to review the plan again next week.
      - paragraph: They have a meeting with the probation practitioner
      - heading /Plan created/
    `)
  })

  test('plan history shows "No additional notes." when notes omitted on Yes update', async ({ page }) => {
    // Complete Yes flow without notes
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.clickSave()

    // Navigate to plan history
    await expect(page).toHaveURL(/\/plan\/overview/)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)

    await planHistoryPage.clickShowAllSectionsButton()

    // Verify updated agreement entry falls back to 'No additional notes'
    await expect(planHistoryPage.mainContent).toMatchAriaSnapshot(`
      - heading /Agreement updated.*agreed to this plan.*/
      - paragraph: No additional notes.
      - heading /Plan created/
    `)
  })
})
