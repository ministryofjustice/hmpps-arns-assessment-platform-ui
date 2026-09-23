import { expect, Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'
import HistoricAssessmentPage from '../../../pages/strengthsAndNeeds/historicAssessmentPage'

test.describe('View Historic Assessment', () => {
  const startOfDay = new Date(2026, 0, 1, 9)
  const endOfDay = new Date(2026, 0, 1, 17)

  const navigateToHistoricPlan = async (page: Page, handoverLink: string): Promise<{ newPage: Page }> => {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.clickViewVersionOnDate('1st January 2026'),
    ])

    return { newPage }
  }

  test.describe('Banner', () => {
    test('should not show Return to OASys button', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
      const { sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).withEventsBackdated(startOfDay, endOfDay).save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await expect(historicAssessmentPage.returnToOasysButton).toBeHidden()

      await expect(historicAssessmentPage.alertHeading).toHaveCount(1)
      await expect(historicAssessmentPage.alertHeading).toContainText(
        'This version is from Thursday 1st January 2026 5:00pm',
      )
    })
  })
})
