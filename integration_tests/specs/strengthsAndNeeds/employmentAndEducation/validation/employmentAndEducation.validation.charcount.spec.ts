import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/question'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, employment } from '../../sanUtils'

/**
 * Some employment and education fields have character limits. These tests exercise the page to reveal the character
 * count fields, then check each one holds to its limit: one character over fails validation, exactly the limit
 * passes.
 */

const answers = [
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
]

test.describe('Employment and education character counts', () => {
  test('employed: other responsibilities, qualifications and transferable skills', async ({ page, openSection }) => {
    const section = await openSection(employment, answers)
    const employmentPage = new EmploymentAndEducationPage(page)
    const { questions } = employmentPage
    await page.goto(`${section}/${Step.employed.path}`)

    await questions.employment_other_responsibilities.option(Option.carer).check()
    await questions.employment_other_responsibilities.option(Option.child).check()
    await questions.employment_other_responsibilities.option(Option.volunteer).check()
    await questions.employment_other_responsibilities.option(CommonOption.other).check()
    await questions.education_professional_or_vocational_qualifications.option(CommonOption.yes).check()
    await questions.education_transferable_skills.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(employmentPage)
  })

  test('employed: some transferable skills', async ({ page, openSection }) => {
    const section = await openSection(employment, answers)
    const employmentPage = new EmploymentAndEducationPage(page)
    const { questions } = employmentPage
    await page.goto(`${section}/${Step.employed.path}`)

    await questions.education_transferable_skills.option(Option.yes_some_skills).check()

    await expectTheLimitsOnThePage(employmentPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of [Option.stable, Option.periods_of_instability, Option.unstable, CommonOption.unknown]) {
    test(`employed: employment history ${option}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employed.path}`)

      await questions.employment_history.option(option).check()

      await expectTheLimitsOnThePage(employmentPage)
    })
  }

  for (const option of [
    Option.positive,
    Option.mostly_positive,
    Option.positive_and_negative,
    Option.mostly_negative,
    Option.negative,
  ]) {
    test(`employed: experience of employment and education ${option}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employed.path}`)

      await questions.employment_experience.option(option).check()
      await questions.education_experience.option(option).check()

      await expectTheLimitsOnThePage(employmentPage)
    })
  }

  for (const option of changeOptions) {
    test(`employed: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employed.path}`)

      await questions.employment_education_changes.option(option).check()

      await expectTheLimitsOnThePage(employmentPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`employment-education-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employment_education_summary.path}#practitioner-analysis`)

      await questions.employment_education_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.employment_education_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.employment_education_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(employmentPage, { save: employmentPage.markComplete })
    })
  }
})
