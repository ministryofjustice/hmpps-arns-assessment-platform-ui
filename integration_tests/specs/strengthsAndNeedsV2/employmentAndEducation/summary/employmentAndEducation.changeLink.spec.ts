import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
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
import { details } from '../../../../testUtils'

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
    { question: Question.community_employment_status, value: Option.employed_or_self_employed },
    { question: Question.employment_history, value: Option.stable },
    { question: Question.employment_history_stable_details, value: details('Stable employment details') },
    {
      question: Question.community_employment_other_responsibilities,
      value: [Option.carer, Option.child, CommonOption.other],
    },
    {
      question: Question.employment_other_responsibilities_carer_details,
      value: details('Carer responsibilities details'),
    },
    {
      question: Question.employment_other_responsibilities_child_details,
      value: details('Child responsibilities details'),
    },
    {
      question: Question.employment_other_responsibilities_other_details,
      value: details('Other responsibilities details'),
    },
    { question: Question.education_academic_professional_vocational_qualifications, value: CommonOption.yes },
    { question: Question.education_transferable_skills, value: CommonOption.yes },
    {
      question: Question.education_transferable_skills_yes_details,
      value: details('Transferable skills details'),
    },
    {
      question: Question.education_difficulties,
      value: [Option.reading, Option.writing],
    },
    {
      question: Question.education_difficulties_reading_severity,
      value: Option.significant_difficulties,
    },
    {
      question: Question.education_difficulties_writing_severity,
      value: Option.some_difficulties,
    },
    {
      question: Question.employment_education_changes,
      value: CommonOption.made_changes,
    },
    {
      question: Question.employment_education_changes_made_changes_details,
      value: details('Made changes details'),
    },
    {
      question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
      value: CommonOption.no,
    },
    {
      question: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_no_details,
      value: details('no education strengths'),
    },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_serious_harm,
      value: CommonOption.yes,
    },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
      value: details('employment serious harm'),
    },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_reoffending,
      value: CommonOption.yes,
    },
    {
      question: Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
      value: details('education reoffending'),
    },
  ],
  summaryChangeLinks: [
    changeLink(Step.employment_status.path, Question.community_employment_status),
    changeLink(Step.employment_education_details.path, Question.employment_history),
    changeLink(Step.employment_education_details.path, Question.community_employment_other_responsibilities),
    changeLink(
      Step.employment_education_details.path,
      Question.education_academic_professional_vocational_qualifications,
    ),
    changeLink(Step.employment_education_details.path, Question.education_transferable_skills),
    changeLink(Step.employment_education_details.path, Question.education_difficulties),
    changeLink(Step.education_difficulties.path, Question.education_difficulties_reading_severity),
    changeLink(Step.education_difficulties.path, Question.education_difficulties_writing_severity),
    changeLink(Step.employment_changes.path, Question.employment_education_changes),
  ],
  userSubmittedSteps: [
    Step.employment_status.code,
    Step.employment_education_details.code,
    Step.education_difficulties.code,
    Step.employment_changes.code,
    Step.employment_education_summary.code,
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink(
    Step.employment_education_summary.path,
    Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
  ),
  changeLink(
    Step.employment_education_summary.path,
    Question.employment_education_practitioner_analysis_risk_of_serious_harm,
  ),
  changeLink(
    Step.employment_education_summary.path,
    Question.employment_education_practitioner_analysis_risk_of_reoffending,
  ),
]

test.describe('Employment and education change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(employment, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
      const section = await openSection(employment, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
        const section = await openSection(employment, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
