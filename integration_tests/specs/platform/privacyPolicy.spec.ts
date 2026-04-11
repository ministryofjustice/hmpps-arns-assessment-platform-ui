import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import { checkHeaderVisibility } from '../../testUtils'

const privacyPolicyPageUrl = '/platform/privacy-policy'

test.describe('Privacy policy page', () => {
  test('loads with heading and content', async ({ page }) => {
    await page.goto(privacyPolicyPageUrl)
    await expect(page).toHaveURL(privacyPolicyPageUrl)

    await checkHeaderVisibility(page, 1, 'Privacy policy for Assess and plan – sentence plan')
    await checkHeaderVisibility(page, 2, 'About personal information')
    await checkHeaderVisibility(page, 2, 'What data we collect')
    await checkHeaderVisibility(page, 2, 'Why we need your data')
    await checkHeaderVisibility(page, 2, 'Our legal basis for processing your data')
    await checkHeaderVisibility(page, 2, 'What we do with your data')
    await checkHeaderVisibility(page, 2, 'Comments and feedback')
    await checkHeaderVisibility(page, 2, 'How long we keep your data')
    await checkHeaderVisibility(page, 2, 'Where your data is processed and stored')
    await checkHeaderVisibility(page, 2, 'How we protect your data and keep it secure')
    await checkHeaderVisibility(page, 2, 'Further information')
    await checkHeaderVisibility(page, 2, 'Your rights')
    await checkHeaderVisibility(page, 2, 'Changes to this policy')
  })

  test('shows shared page layout elements', async ({ page }) => {
    await page.goto(privacyPolicyPageUrl)

    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/platform/accessibility')
    await page.goto(privacyPolicyPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/platform/accessibility')
  })
})
