import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import { checkHeaderVisibility } from '../../testUtils'

const cookiesPolicyPageUrl = '/platform/cookies-policy'

test.describe('Cookies policy page', () => {
  test('loads with heading and content', async ({ page }) => {
    await page.goto(cookiesPolicyPageUrl)
    await expect(page).toHaveURL(cookiesPolicyPageUrl)

    await checkHeaderVisibility(page, 1, 'Cookies policy for Assess and plan')
    await checkHeaderVisibility(page, 2, 'Session cookies')
    await checkHeaderVisibility(page, 2, 'Survey cookies')
    await checkHeaderVisibility(page, 2, 'Analytics cookies')
  })

  test('shows shared page layout elements', async ({ page }) => {
    await page.goto(cookiesPolicyPageUrl)

    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/platform/accessibility')
    await page.goto(cookiesPolicyPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/platform/accessibility')
  })
})
