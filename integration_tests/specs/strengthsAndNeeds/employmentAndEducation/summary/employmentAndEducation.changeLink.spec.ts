import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/question'
import { employment } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
} from '../../changeLinkUtils'
import { test } from '../../fixtures'

/**
 * Employment and education change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Employed full time in order to cover every question
 */

const summaryPage = 'employment-education-summary'
const analysisPage = 'employment-education-analysis'

const fullyAnswered: Scenario = {
  answers: [
    { question: Question.employment_status, value: Option.employed },
    { question: Question.employment_type, value: Option.full_time },
    { question: Question.employment_area, value: 'Some details' },
    { question: Question.employment_history, value: Option.periods_of_instability },
    { question: Question.employment_history_periods_of_instability_details, value: 'Some details' },
    { question: Question.employment_other_responsibilities, value: [Option.carer] },
    { question: Question.employment_other_responsibilities_carer_details, value: 'Some details' },
    { question: Question.education_highest_level_completed, value: Option.entry_level },
    { question: Question.education_professional_or_vocational_qualifications, value: CommonOption.yes },
    { question: Question.education_professional_or_vocational_qualifications_yes_details, value: 'Some details' },
    { question: Question.education_transferable_skills, value: CommonOption.yes },
    { question: Question.education_transferable_skills_yes_details, value: 'Some details' },
    { question: Question.education_difficulties, value: [Option.reading] },
    { question: Question.education_difficulties_reading_severity, value: Option.significant_difficulties },
    { question: Question.employment_experience, value: Option.mostly_positive },
    { question: Question.employment_experience_mostly_positive_details, value: 'Some details' },
    { question: Question.education_experience, value: Option.negative },
    { question: Question.education_experience_negative_details, value: 'Some details' },
    { question: Question.employment_education_changes, value: CommonOption.made_changes },
    { question: Question.employment_education_changes_made_changes_details, value: 'Some details' },
    {
      question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
      value: CommonOption.yes,
    },
    {
      question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: 'Some details',
    },
    { question: Question.employment_education_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
      value: 'Some details',
    },
    { question: Question.employment_education_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
      value: 'Some details',
    },
  ],
  summaryChangeLinks: [
    changeLink('current-employment', 'employment_status'),
    changeLink('employed', 'employment_area'),
    changeLink('employed', 'employment_history'),
    changeLink('employed', 'employment_other_responsibilities'),
    changeLink('employed', 'education_highest_level_completed'),
    changeLink('employed', 'education_professional_or_vocational_qualifications'),
    changeLink('employed', 'education_transferable_skills'),
    changeLink('employed', 'education_difficulties'),
    changeLink('employed', 'employment_experience'),
    changeLink('employed', 'education_experience'),
    changeLink('employed', 'employment_education_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink(
    'employment-education-summary',
    'employment_education_practitioner_analysis_strengths_or_protective_factors',
  ),
  changeLink('employment-education-summary', 'employment_education_practitioner_analysis_risk_of_serious_harm'),
  changeLink('employment-education-summary', 'employment_education_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Employment and education change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(employment, fullyAnswered.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          fullyAnswered.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Practitioner analysis', () => {
    test('each change link lands on its question', async ({ page, openSection }) => {
      const section = await openSection(employment, fullyAnswered.answers)

      await expectEachChangeLinkToLandOnItsQuestion(
        page,
        `${section}/${analysisPage}`,
        practitionerAnalysisChangeLinks,
        practitionerAnalysisTab,
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('fully answered', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(employment, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks, summaryTab)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks, summaryTab)
        await expectChangeLinksListed(
          page,
          `${section}/${analysisPage}`,
          practitionerAnalysisChangeLinks,
          practitionerAnalysisTab,
        )
      })
    })
  })
})
