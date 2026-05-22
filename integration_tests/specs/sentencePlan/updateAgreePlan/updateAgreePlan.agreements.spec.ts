import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import UpdateAgreePlanPage from '../../../pages/sentencePlan/updateAgreePlanPage'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { checkAccessibility, navigateToSentencePlan } from '../sentencePlanUtils'

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

  test('can update agreement with Yes and notes and redirects to plan overview', async ({ page }) => {
    // Navigate to update agree plan
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    await checkAccessibility(page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })

    // Select Yes, enter notes and save
    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.enterNotes('Person on probation agreed to the plan')
    await updateAgreePlanPage.clickSave()

    // Should redirect to plan overview
    await PlanOverviewPage.verifyOnPage(page)

    // Should show "{name} agreed to their plan on" message (UPDATED_AGREED)
    const message = page.locator('.govuk-body', { hasText: 'agreed to their plan on' })
    await expect(message).toMatchAriaSnapshot(`
      - paragraph:
        - text: /agreed to their plan on/
        - link "View plan history"
    `)
  })

  test('can update agreement with No, details and notes then redirects to plan overview', async ({ page }) => {
    // Navigate to update agree plan
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    // Select No, enter details and notes then save
    await updateAgreePlanPage.selectAgreeNo()
    await updateAgreePlanPage.enterDetailsForNo('They want to review the plan again next week.')
    await updateAgreePlanPage.enterNotes('They have a meeting with the probation practitioner.')
    await updateAgreePlanPage.clickSave()

    // Should redirect to plan overview
    await PlanOverviewPage.verifyOnPage(page)

    // Should show "Plan created on" message (UPDATED_DO_NOT_AGREE)
    const message = page.locator('.govuk-body', { hasText: 'Plan created on' })
    await expect(message).toMatchAriaSnapshot(`
      - paragraph:
        - text: /Plan created on/
        - link "View plan history"
    `)
  })

  test('can update agreement with Yes and no notes then redirects to plan overview', async ({ page }) => {
    // Navigate to update agree plan
    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
    await planOverviewPage.updateAgreementLink.click()
    const updateAgreePlanPage = await UpdateAgreePlanPage.verifyOnPage(page)

    // Select Yes, do not enter any notes and save
    await updateAgreePlanPage.selectAgreeYes()
    await updateAgreePlanPage.clickSave()

    // Should redirect to plan overview
    await PlanOverviewPage.verifyOnPage(page)

    // Should show "{name} agreed to their plan on" message (UPDATED_AGREED)
    const message = page.locator('.govuk-body', { hasText: 'agreed to their plan on' })
    await expect(message).toMatchAriaSnapshot(`
      - paragraph:
        - text: /agreed to their plan on/
        - link "View plan history"
    `)
  })
})
