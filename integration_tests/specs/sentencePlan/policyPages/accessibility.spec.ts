import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToPrivacyScreen, navigateToSentencePlan, sentencePlanV1URLs } from '../sentencePlanUtils'

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

  test('does not show a back link', async ({ page }) => {
    await expect(page.locator('.govuk-back-link')).not.toBeVisible()
  })

  // TODO: Test should be split out to each pages spec files once they are built.
  test('redirects user back to privacy page when bypassed', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      assessmentType: 'SAN_SP',
    })
    await sentencePlanBuilder.extend(sentencePlanId).withAgreementStatus('AGREED').save()

    await navigateToPrivacyScreen(page, handoverLink)
    await page.goto(sentencePlanV1URLs.ACCESSIBILITY)
    await expect(page).toHaveURL(sentencePlanV1URLs.ACCESSIBILITY)

    await page.goto(sentencePlanV1URLs.ABOUT_PERSON)
    await expect(page).toHaveURL(/\/sentence-plan\/privacy/)

    await page.goto(sentencePlanV1URLs.PLAN_HISTORY)
    await expect(page).toHaveURL(/\/sentence-plan\/privacy/)

    await page.goto(sentencePlanV1URLs.PREVIOUS_VERSIONS)
    await expect(page).toHaveURL(/\/sentence-plan\/privacy/)
  })
})
