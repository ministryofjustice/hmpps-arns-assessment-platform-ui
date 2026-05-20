import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent, navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe(`Plan History - Print view`, () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    // Arrange: a plan with one goal and an agreement so the accordion has sections
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({ title: 'Find stable accommodation', areaOfNeed: 'accommodation', status: 'ACTIVE' })
      .withPlanAgreements([{ status: 'AGREED', createdBy: 'Test Practitioner', dateOffset: 0 }])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()
    await PlanHistoryPage.verifyOnPage(page)
  })

  test('should not show the "Show all sections" or "Hide all sections" controls when printed', async ({ page }) => {
    // Act: switch the page into print media so print CSS applies to all assertions below
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('#plan-history-accordion .govuk-accordion__controls')).toBeHidden()
  })

  test('should not show the "Show" or "Hide" toggle text and chevron when printed ', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })

    const toggles = page.locator('#plan-history-accordion .govuk-accordion__section-toggle')
    const all = await toggles.all()
    await Promise.all(all.map(toggle => expect(toggle).toBeHidden()))
  })

  test('should render section headings as non-interactive text when printed', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })

    const headingButton = page.locator('#plan-history-accordion .govuk-accordion__section-button').first()
    await expect(headingButton).toHaveCSS('pointer-events', 'none')
    await expect(headingButton).toHaveCSS('cursor', 'text')
  })

  test('should still display plan history section headings when printed', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('#plan-history-accordion .govuk-accordion__section-heading-text').first()).toBeVisible()
  })

  test('should hide the "Update agreement" link when printed', async ({ page, createSession, sentencePlanBuilder }) => {
    // Arrange: a plan with a COULD_NOT_ANSWER agreement so the update-agreement link renders
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({ title: 'Find stable accommodation', areaOfNeed: 'accommodation', status: 'ACTIVE' })
      .withPlanAgreements([
        {
          status: 'COULD_NOT_ANSWER',
          createdBy: 'Test Practitioner',
          detailsCouldNotAnswer: `Person wasn't present`,
          dateOffset: 0,
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    const planHistoryPage = await PlanHistoryPage.verifyOnPage(page)
    await planHistoryPage.clickShowAllSectionsButton()

    await page.emulateMedia({ media: 'print' })

    await expect(page.locator('#plan-history-accordion [data-qa="plan-history-update-agreement-link"]')).toHaveCSS(
      'display',
      'none',
    )
  })

})
