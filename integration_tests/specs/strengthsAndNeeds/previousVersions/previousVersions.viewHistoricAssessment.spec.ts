import { expect, Page } from '@playwright/test'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Question as PersonalRelationshipsCommunityQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/question'
import { Option as PersonalRelationshipsCommunityOption } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/option'
import { Question as AccommodationQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { Option as AccommodationOption } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question as EmploymentEducationQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/question'
import { Option as EmploymentEducationOption } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/option'
import { Question as FinanceQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/question'
import { Option as FinanceOption } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/option'
import { Question as DrugUseQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { Question as AlcoholUseQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { Option as AlcoholUseOption } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question as HealthWellbeingQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/question'
import { Question as ThinkingBehavioursAttitudesQuestion } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
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
        .save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await historicAssessmentPage.page.getByText('Offence analysis').click()
      await expect(historicAssessmentPage.summary).toBeVisible()
      await expect(historicAssessmentPage.page.getByText('There are no victims.')).toBeVisible()
    })

    test('should show offence analysis section summary with first question text only', async ({
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
        ])
        .save()

      const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
      await expect(newPage).toHaveTitle('Accommodation analysis - Strengths and needs')

      const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
      await historicAssessmentPage.page.getByText('Offence analysis').click()
      await expect(historicAssessmentPage.summary).toBeVisible()
    })
  })

  // Each section with only its first question answered, which is enough to count as started
  const sections = [
    {
      name: 'Accommodation',
      question: AccommodationQuestion.current_accommodation,
      value: AccommodationOption.settled,
      summaryRow: 'What type of accommodation does',
    },
    {
      name: 'Employment and education',
      question: EmploymentEducationQuestion.employment_status,
      value: EmploymentEducationOption.employed,
      summaryRow: 'current employment status?',
    },
    {
      name: 'Finances',
      question: FinanceQuestion.finance_income,
      value: [FinanceOption.employment],
      summaryRow: 'currently get their money from?',
    },
    {
      name: 'Drug use',
      question: DrugUseQuestion.drug_use,
      value: CommonOption.yes,
      summaryRow: 'ever misused drugs?',
    },
    {
      name: 'Alcohol use',
      question: AlcoholUseQuestion.alcohol_use,
      value: AlcoholUseOption.yes_within_last_three_months,
      summaryRow: 'ever drunk alcohol?',
    },
    {
      name: 'Health and wellbeing',
      question: HealthWellbeingQuestion.health_wellbeing_physical_health_condition,
      value: CommonOption.yes,
      summaryRow: 'have any physical health conditions?',
    },
    {
      name: 'Personal relationships and community',
      question: PersonalRelationshipsCommunityQuestion.personal_relationships_community_children_details,
      value: [PersonalRelationshipsCommunityOption.no_children],
      summaryRow: 'Are there any children',
    },
    {
      name: 'Thinking, behaviours and attitudes',
      question: ThinkingBehavioursAttitudesQuestion.thinking_behaviours_attitudes_consequences,
      value: CommonOption.yes,
      summaryRow: 'aware of the consequences of their actions?',
    },
  ]

  sections.forEach(({ name, question, value, summaryRow }) => {
    test.describe(`${name} section`, () => {
      test(`should show ${name} section has not been started`, async ({
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
        const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
        await historicAssessmentPage.page.getByRole('link', { name, exact: true }).click()

        await expect(historicAssessmentPage.page.getByText('This section has not been started')).toBeVisible()
        await expect(historicAssessmentPage.summary).toBeHidden()
      })

      test(`should show ${name} section summary when only the first question is answered`, async ({
        page,
        createSession,
        strengthsAndNeedsBuilder,
        baseURL,
      }) => {
        const { sanAssessmentId, handoverLink } = await createSession({
          targetService: TargetService.STRENGTHS_AND_NEEDS,
        })
        await strengthsAndNeedsBuilder
          .extend(sanAssessmentId)
          .withEventsBackdated(startOfDay, endOfDay)
          .withAnswers([{ question, value }])
          .save()

        const { newPage } = await navigateToHistoricPlan(page, handoverLink, baseURL, sanAssessmentId)
        const historicAssessmentPage = await HistoricAssessmentPage.verifyOnPage(newPage, 'Employment and education')
        await historicAssessmentPage.page.getByRole('link', { name, exact: true }).click()

        await expect(historicAssessmentPage.page.getByText('This section has not been started')).toBeHidden()
        await expect(historicAssessmentPage.summary).toBeVisible()
        await expect(historicAssessmentPage.summary.getByText(summaryRow)).toBeVisible()
      })
    })
  })
})
