import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

test.describe('Cookies policy page', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).save()

    await navigateToSentencePlan(page, handoverLink)
    await page.goto(sentencePlanV1URLs.COOKIES_POLICY)
  })

  test('loads with heading and placeholder content', async ({ page }) => {
    await expect(page).toHaveURL(sentencePlanV1URLs.COOKIES_POLICY)
    await expect(page.getByRole('heading', { name: 'Cookies policy' })).toBeVisible()
    await expect(page.locator('[data-qa="cookies-policy-content"]')).toContainText(
      'This is the Cookies policy page. Content for this page will be added soon.',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await expect(page.getByLabel('Primary navigation')).toBeVisible()
    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('#report-a-problem details')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('does not show a back link', async ({ page }) => {
    await expect(page.locator('.govuk-back-link')).not.toBeVisible()
  })
})
