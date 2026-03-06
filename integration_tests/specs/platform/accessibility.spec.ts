import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'

const accessibilityPageUrl = '/platform/accessibility'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(accessibilityPageUrl)
  })

  test('loads with heading and placeholder content', async ({ page }) => {
    await expect(page).toHaveURL(accessibilityPageUrl)
    await expect(page.getByRole('heading', { name: 'Accessibility' })).toBeVisible()
    await expect(page.locator('[data-qa="accessibility-content"]')).toContainText(
      'This is the Accessibility page. Content for this page will be added soon.',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/')
    await page.goto(accessibilityPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/')
  })
})
