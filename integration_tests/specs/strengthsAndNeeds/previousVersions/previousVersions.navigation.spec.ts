import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, previousVersions, sanFormPath, v1Path } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'

test.describe('Previous Versions - Navigation', () => {
  test('can navigate to previous versions where no previous version exists', async ({
    page,
    createSession,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}/current${previousVersions}`)

    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')

    await expect(previousVersionsPage.previousVersionsLink).not.toBeVisible()

    // Verify message is shown when no previous versions exist

    await expect(previousVersionsPage.mainForm).toContainText(
      "Check versions of Test's current assessment. The links will open in a new tab.",
    )

    // Verify no previous versions rows are shown
    const countersignedRows = previousVersionsPage.table.first().locator('tbody').getByRole('row')
    const allVersionsRows = previousVersionsPage.table.last().locator('tbody').getByRole('row')

    await expect(countersignedRows).toHaveCount(0)
    await expect(allVersionsRows).toHaveCount(0)

  })
})
