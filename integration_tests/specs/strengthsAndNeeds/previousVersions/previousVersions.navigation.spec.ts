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
    expect(previousVersionsPage.mainForm).toMatchAriaSnapshot(`
      - paragraph: Check versions of Test's current assessment. The links will open in a new tab.
      - heading "Countersigned versions" [level=2]
      - paragraph: There are no previous versions to display
      - heading "All versions" [level=2]
      - paragraph: There are no previous versions to display
    `)
  })
})
