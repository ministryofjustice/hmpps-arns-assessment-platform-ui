import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'

const cookiesPolicyPageUrl = '/platform/cookies-policy'

test.describe('Cookies policy page', () => {
  test('loads with heading and placeholder content', async ({ page }) => {
    await page.goto(cookiesPolicyPageUrl)

    await expect(page).toHaveURL(cookiesPolicyPageUrl)
    await expect(page.getByRole('heading', { name: 'Cookies policy' })).toBeVisible()
    await expect(page.locator('[data-qa="cookies-policy-content"]')).toContainText(
      'This is the Cookies policy page. Content for this page will be added soon.',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await page.goto(cookiesPolicyPageUrl)

    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/platform/privacy-policy')
    await page.goto(cookiesPolicyPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/platform/privacy-policy')
  })
})
