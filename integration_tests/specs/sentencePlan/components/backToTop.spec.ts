import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan, navigateToPrivacyScreen } from '../sentencePlanUtils'

const backToTopWrapper = '.js-back-to-top'
const backToTopLink = '[data-ai-id="back-to-top"]'

test.describe('Back to top link', () => {
  test('is hidden when the page content fits within the viewport', async ({ page, createSession }) => {
    // Arrange - a blank plan overview is short content, and a tall viewport leaves nothing to scroll.
    await page.setViewportSize({ width: 1280, height: 3000 })
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    // Act
    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)

    // Assert
    await expect(page.locator(backToTopWrapper)).toBeHidden()
  })

  test('is visible and returns to the top when content exceeds the viewport', async ({ page, createSession }) => {
    // Arrange - a short viewport forces the page to scroll.
    await page.setViewportSize({ width: 1280, height: 400 })
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    // Act
    await navigateToSentencePlan(page, handoverLink)
    await PlanOverviewPage.verifyOnPage(page)
    await expect(page.locator(backToTopWrapper)).toBeVisible()

    await page.mouse.wheel(0, 1000)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await page.locator(backToTopLink).click()

    // Assert
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('is not rendered on the privacy screen', async ({ page, createSession }) => {
    // Arrange - a short viewport would show the link if it were present.
    await page.setViewportSize({ width: 1280, height: 400 })
    const { handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })

    // Act
    await navigateToPrivacyScreen(page, handoverLink)

    // Assert
    await expect(page.locator(backToTopWrapper)).toHaveCount(0)
  })
})
