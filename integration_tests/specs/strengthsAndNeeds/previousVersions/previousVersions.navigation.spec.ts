import { expect, Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'

test.describe('Previous Versions - Navigation', () => {
  test('can navigate to previous versions where no previous version exists', async ({ page, createSession }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await navigateToStrengthsAndNeeds(page, handoverLink)

    // Verify the "View previous versions" link is visible
    const viewPreviousVersionsLinkOn = (p: Page) => p.getByRole('link', { name: /View previous versions/i })
    await expect(viewPreviousVersionsLinkOn(page)).toBeVisible()

    // Click the link
    await viewPreviousVersionsLinkOn(page).click()

    // Verify we're on the plan history page
    await expect(page).toHaveURL(/previous-versions/)
    await expect(viewPreviousVersionsLinkOn(page)).toHaveCount(0)

    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')
    await expect(page).toHaveTitle('Previous versions - Strengths and needs')

    // Verify message is shown when no previous versions exist

    await expect(previousVersionsPage.mainContent).toContainText(
      "Check versions of Test's current assessment. The links will open in a new tab.",
    )

    // Verify no previous versions tables are shown
    await expect(previousVersionsPage.table).toHaveCount(0)
  })
})
