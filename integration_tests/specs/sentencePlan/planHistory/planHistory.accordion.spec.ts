import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

test.describe('Plan History - Accordion behaviour', () => {
  test.beforeEach(async ({ page, createSession, sentencePlanBuilder }) => {
    // Two events so the accordion has multiple sections to expand/collapse
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Find stable accommodation',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        createdBy: 'Jane Smith',
        steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
      })
      .withPlanAgreements([
        {
          status: 'AGREED',
          createdBy: 'Test Practitioner',
          dateOffset: -86400000,
        },
      ])
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()
    await PlanHistoryPage.verifyOnPage(page)
  })

  test('Show all sections expands every section and toggles button label to Hide all sections', async ({ page }) => {
    // Arrange
    const showAllButton = page.getByRole('button', { name: 'Show all sections' })
    const hideAllButton = page.getByRole('button', { name: 'Hide all sections' })
    const sectionButtons = page.locator('.govuk-accordion__section-button')
    const expectAllExpanded = async (expanded: 'true' | 'false') => {
      const buttons = await sectionButtons.all()
      await Promise.all(buttons.map(btn => expect(btn).toHaveAttribute('aria-expanded', expanded)))
    }

    // Assert initial state: Show all visible, sections collapsed
    await expect(showAllButton).toBeVisible()
    await expect(hideAllButton).not.toBeVisible()
    await expectAllExpanded('false')

    // Act
    await showAllButton.click()

    // Assert: button label now says Hide all sections, every section expanded
    await expect(hideAllButton).toBeVisible()
    await expect(showAllButton).not.toBeVisible()
    await expectAllExpanded('true')

    // Act
    await hideAllButton.click()

    // Assert: back to initial state
    await expect(showAllButton).toBeVisible()
    await expect(hideAllButton).not.toBeVisible()
    await expectAllExpanded('false')
  })

  test('Individual Show toggle expands only that section and toggles label to Hide', async ({ page }) => {
    // Arrange
    const firstSection = page.locator('.govuk-accordion__section').first()
    const secondSection = page.locator('.govuk-accordion__section').nth(1)
    const firstButton = firstSection.locator('.govuk-accordion__section-button')
    const secondButton = secondSection.locator('.govuk-accordion__section-button')
    const firstToggleText = firstSection.locator('.govuk-accordion__section-toggle-text')

    // Assert initial state: both sections collapsed, first section's toggle says Show
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await expect(secondButton).toHaveAttribute('aria-expanded', 'false')
    await expect(firstToggleText).toHaveText('Show')

    // Act
    await firstButton.click()

    // Assert: first section expanded with Hide label, second untouched
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    await expect(firstToggleText).toHaveText('Hide')
    await expect(secondButton).toHaveAttribute('aria-expanded', 'false')

    // Act
    await firstButton.click()

    // Assert: first section back to collapsed with Show label
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await expect(firstToggleText).toHaveText('Show')
  })
})
