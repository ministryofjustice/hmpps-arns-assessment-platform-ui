import { employment } from '../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  test,
} from './helpers'

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
    { question: 'employment_status', value: 'EMPLOYED' },
    { question: 'employment_type', value: 'FULL_TIME' },
    { question: 'employment_area', value: 'Some details' },
    { question: 'employment_history', value: 'PERIODS_OF_INSTABILITY' },
    { question: 'employment_history_periods_of_instability_details', value: 'Some details' },
    { question: 'employment_other_responsibilities', value: ['CARER'] },
    { question: 'employment_other_responsibilities_carer_details', value: 'Some details' },
    { question: 'education_highest_level_completed', value: 'ENTRY_LEVEL' },
    { question: 'education_professional_or_vocational_qualifications', value: 'YES' },
    { question: 'education_professional_or_vocational_qualifications_yes_details', value: 'Some details' },
    { question: 'education_transferable_skills', value: 'YES' },
    { question: 'education_transferable_skills_yes_details', value: 'Some details' },
    { question: 'education_difficulties', value: ['READING'] },
    { question: 'education_difficulties_reading_severity', value: 'SIGNIFICANT_DIFFICULTIES' },
    { question: 'employment_experience', value: 'MOSTLY_POSITIVE' },
    { question: 'employment_experience_mostly_positive_details', value: 'Some details' },
    { question: 'education_experience', value: 'NEGATIVE' },
    { question: 'education_experience_negative_details', value: 'Some details' },
    { question: 'employment_education_changes', value: 'MADE_CHANGES' },
    { question: 'employment_education_changes_made_changes_details', value: 'Some details' },
    { question: 'employment_education_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    {
      question: 'employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'employment_education_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'employment_education_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'employment_education_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'employment_education_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
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
        {
          tab: practitionerAnalysisTab,
        },
      )
    })
  })

  test.describe('Summary', () => {
    test.describe('fully answered', () => {
      test('the summary and analysis pages list every change link', async ({ page, openSection }) => {
        const section = await openSection(employment, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })
  })
})
