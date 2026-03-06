import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'

const privacyPolicyPageUrl = '/platform/privacy-policy'

test.describe('Privacy policy page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(privacyPolicyPageUrl)
  })

  test('loads with heading and placeholder content', async ({ page }) => {
    await expect(page).toHaveURL(privacyPolicyPageUrl)
    await expect(page.getByRole('heading', { name: 'Privacy policy' })).toBeVisible()
    await expect(page.locator('[data-qa="privacy-policy-content"]')).toContainText(
      'This is the Privacy policy page. Content for this page will be added soon.',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/')
    await page.goto(privacyPolicyPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/')
  })
})
