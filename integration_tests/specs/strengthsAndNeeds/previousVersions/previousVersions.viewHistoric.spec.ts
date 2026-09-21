import { expect, Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import HistoricPlanPage from '../../../pages/sentencePlan/historicPlanPage'

test.describe('View Historic Plan', () => {
  const startOfDay = new Date(2026, 0, 1, 9)
  const endOfDay = new Date(2026, 0, 1, 17)

  const navigateToHistoricPlan = async (
    page: Page,
    handoverLink: string,
  ): Promise<{ historicPlanPage: HistoricPlanPage; newPage: Page }> => {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.clickViewVersionOnDate('1st January 2026'),
    ])

    await newPage.waitForLoadState()
    const historicPlanPage = await HistoricPlanPage.verifyOnPageSan(newPage)
    await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')
    await expect(historicPlanPage.alertHeading).toHaveCount(1)
    await expect(historicPlanPage.alertHeading).toContainText('This version is from Thursday 1st January 2026 5:00pm')
    return { historicPlanPage, newPage }
  }

  test.describe('Header', () => {
    test('should not show Return to OASys button when navigating from within Sentence Plan', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await sentencePlanBuilder.extend(sanAssessmentId).withEventsBackdated(startOfDay, endOfDay).save()

      const { historicPlanPage } = await navigateToHistoricPlan(page, handoverLink)

      await expect(historicPlanPage.returnToOasysButton).toBeHidden()
    })
  })
})
