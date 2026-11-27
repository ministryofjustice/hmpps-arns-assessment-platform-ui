import { expect, Page } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToSentencePlan } from '../sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import HistoricPlanPage from '../../../pages/sentencePlan/historicPlanPage'

test.describe('View Historic Plan', () => {
  const startOfDay = new Date(2026, 0, 1, 9)
  const endOfDay = new Date(2026, 0, 1, 17)

  const navigateToSanHistoricPlan = async (
    page: Page,
    handoverLink: string,
    date: string,
  ): Promise<{ historicPlanPage: HistoricPlanPage; newPage: Page }> => {
    await navigateToSentencePlan(page, handoverLink)
    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    const [newPage, link] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.viewSanVersionOnDate(date).then(viewlink => {
        return viewlink
      }),
    ])

    await newPage.waitForLoadState()
    expect(link).toMatch(/^\/?strengths-and-needs\/[^/]+\/view-historic\/.+/)

    const historicPlanPage = await HistoricPlanPage.verifyOnSanPage(newPage)
    return { historicPlanPage, newPage }
  }

  test.describe('San previous version', () => {
    test('should navigate to historic SAN version from Sentence Plan', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
    }) => {
      const { sanAssessmentId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId)
        .withEventsBackdated(startOfDay, endOfDay)
        .withAnswers([
          { question: 'current_accommodation', value: 'SETTLED' },
          { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
        ])
        .withUserSubmittedSteps(['accommodation_status'])
        .save()

      const { historicPlanPage } = await navigateToSanHistoricPlan(page, handoverLink, '1 January 2026')

      await expect(historicPlanPage.alertHeading).toHaveCount(1)
      await expect(historicPlanPage.alertHeading).toContainText('This version is from Thursday 1st January 2026 5:00pm')
      expect(historicPlanPage.page.url()).toContain('accommodation/accommodation-analysis')
      await expect(historicPlanPage.page.getByText('Settled')).toBeVisible()
    })

    test('should navigate to last updated historic SAN version from Sentence Plan', async ({
      page,
      createSession,
      sentencePlanBuilder,
      strengthsAndNeedsBuilder,
    }) => {
      const spStartOfDay = new Date(2026, 1, 1, 9)
      const spEndOfDay = new Date(2026, 1, 1, 17)
      const { sentencePlanId, sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder.extend(sentencePlanId)
        .withEventsBackdated(spStartOfDay, spEndOfDay).save()
      await strengthsAndNeedsBuilder.extend(sanAssessmentId)
        .withEventsBackdated(startOfDay, endOfDay)
        .withAnswers([
          { question: 'current_accommodation', value: 'SETTLED' },
          { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
        ])
        .save()

      const { historicPlanPage } = await navigateToSanHistoricPlan(page, handoverLink, '1 February 2026')

      expect(historicPlanPage.page.url()).toContain('accommodation/accommodation-analysis')
      await expect(historicPlanPage.alertHeading).toHaveCount(1)
      await expect(historicPlanPage.alertHeading).toContainText('This version is from Thursday 1st January 2026 5:00pm')
      await expect(historicPlanPage.page.getByText('Settled')).toBeVisible()
    })
  })
})
