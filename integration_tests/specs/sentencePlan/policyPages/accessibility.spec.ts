import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.ACCESSIBILITY)
  })

  test('loads with heading and placeholder content', async ({ page }) => {
    await expect(page).toHaveURL(sentencePlanV1URLs.ACCESSIBILITY)
    await expect(page.getByRole('heading', { name: 'Accessibility' })).toBeVisible()
    await expect(page.locator('[data-qa="accessibility-content"]')).toContainText(
      'This is the Accessibility page. Content for this page will be added soon.',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await expect(page.getByLabel('Primary navigation')).toBeVisible()
    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('#report-a-problem details')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('back link navigates to plan overview', async ({ page }) => {
    const backLink = page.getByRole('link', { name: 'Back', exact: true })
    await expect(backLink).toHaveAttribute('href', sentencePlanV1URLs.PLAN_OVERVIEW)
    await backLink.click()

    await expect(page).toHaveURL(/\/sentence-plan\/v1\.0\/plan\/overview(\?type=current)?/)
  })
})
