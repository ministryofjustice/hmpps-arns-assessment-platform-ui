import { expect, Page } from '@playwright/test'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, previousVersions, sanFormPath, v1Path } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'
import HistoricAssessmentPage from '../../../pages/strengthsAndNeeds/historicAssessmentPage'

test.describe('View Historic Assessment', () => {
  const startOfDay = new Date(2026, 0, 1, 9)
  const endOfDay = new Date(2026, 0, 1, 17)

  const navigateToHistoricPlan = async (
    page: Page,
    handoverLink: string,
    baseURL: string,
    sanAssessmentId: string,
  ): Promise<{ newPage: Page }> => {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}/current${previousVersions}`)
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.viewVersionOnDate('1st January 2026'),
    ])

    return { newPage }
  }

  test.describe('Banner', () => {
    test('should not show Return to OASys button', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).withEventsBackdated(startOfDay, endOfDay).save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await expect(historicAssessmentPage.returnToOasysButton).toBeHidden()

      await expect(historicAssessmentPage.alertHeading).toHaveCount(1)
      await expect(historicAssessmentPage.alertHeading).toContainText(
        'This version is from Thursday 1st January 2026 5:00pm',
      )
    })

  })

  test.describe('Offence analysis section', () => {
    test('should show offence analysis section is incomplete', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).withEventsBackdated(startOfDay, endOfDay).save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await historicAssessmentPage.page.getByText('Offence analysis').click()
      await expect(historicAssessmentPage.page.getByText('This section has not been started')).toBeVisible()
    })

    test('should show offence analysis section summary', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { sanAssessmentId, handoverLink } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId)
        .withEventsBackdated(startOfDay, endOfDay)
        .withAnswers([
          {
            question: Question.offence_analysis_description_of_offence,
            value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          },
          {
            question: Question.offence_analysis_who_was_the_victim,
            value: [Option.one_or_more_person],
          },
        ])
        .withUserSubmittedSteps([Step.offence_analysis.code])
        .save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await historicAssessmentPage.page.getByText('Offence analysis').click()
      await expect(historicAssessmentPage.summary).toBeVisible()
      await expect(historicAssessmentPage.page.getByText('There are no victims.')).toBeVisible()
    })
  })
})
