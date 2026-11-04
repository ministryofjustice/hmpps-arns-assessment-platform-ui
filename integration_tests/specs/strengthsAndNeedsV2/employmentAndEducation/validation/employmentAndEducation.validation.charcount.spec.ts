import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, employment } from '../../sanUtils'
import EmploymentAndEducationPage from '../../../../pages/strengthsAndNeedsV2/employmentAndEducationPage'
import { details } from '../../../../testUtils'

/**
 * Some employment and education fields have character limits. These tests exercise the page to reveal the character
 * count fields, then check each one holds to its limit: one character over fails validation, exactly the limit
 * passes.
 */

const answers = [
  { question: Question.community_employment_status, value: Option.employed_or_self_employed },
  { question: Question.community_employment_history, value: Option.stable },
  { question: Question.community_employment_history_stable_details, value: details('Stable employment details') },
  {
    question: Question.community_employment_other_responsibilities,
    value: [Option.carer, Option.child, CommonOption.other],
  },
  {
    question: Question.community_employment_other_responsibilities_carer_details,
    value: details('Carer responsibilities details'),
  },
  {
    question: Question.community_employment_other_responsibilities_child_details,
    value: details('Child responsibilities details'),
  },
  {
    question: Question.community_employment_other_responsibilities_other_details,
    value: details('Other responsibilities details'),
  },
  { question: Question.education_academic_professional_vocational_qualifications, value: CommonOption.yes },
  {
    question: Question.education_academic_professional_vocational_qualifications_details,
    value: details('Academic, professional, vocational qualifications details'),
  },
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
    question: Question.education_difficulties_numeracy_severity,
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
]

const userSubmittedSteps = [
  Step.employment_status.code,
  Step.employment_education_details.code,
  Step.education_difficulties.code,
  Step.employment_changes.code,
  Step.employment_education_summary.code,
]

test.describe('Employment and education character counts', () => {
  test('employed: other responsibilities, qualifications and transferable skills', async ({ page, openSection }) => {
    const section = await openSection(employment, answers, userSubmittedSteps)
    const employmentPage = new EmploymentAndEducationPage(page)
    const { questions } = employmentPage
    await page.goto(`${section}/${Step.employment_education_details.path}`)

    await questions.community_employment_other_responsibilities.option(Option.carer).check()
    await questions.community_employment_other_responsibilities.option(Option.child).check()
    await questions.community_employment_other_responsibilities.option(Option.volunteer).check()
    await questions.community_employment_other_responsibilities.option(CommonOption.other).check()
    await questions.education_academic_professional_vocational_qualifications.option(CommonOption.yes).check()
    await questions.education_transferable_skills.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(employmentPage)
  })

  test('employed: some transferable skills', async ({ page, openSection }) => {
    const section = await openSection(employment, answers, userSubmittedSteps)
    const employmentPage = new EmploymentAndEducationPage(page)
    const { questions } = employmentPage
    await page.goto(`${section}/${Step.employment_education_details.path}`)

    await questions.education_transferable_skills.option(Option.yes_some_skills).check()

    await expectTheLimitsOnThePage(employmentPage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of [Option.stable, Option.periods_of_instability, Option.unstable, CommonOption.unknown]) {
    test(`employed: employment history ${option}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers, userSubmittedSteps)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employment_education_details.path}`)

      await questions.community_employment_history.option(option).check()

      await expectTheLimitsOnThePage(employmentPage)
    })
  }

  for (const option of changeOptions) {
    test(`employed: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers, userSubmittedSteps)
      const employmentPage = new EmploymentAndEducationPage(page)
      const { questions } = employmentPage
      await page.goto(`${section}/${Step.employment_changes.path}`)

      await questions.employment_education_changes.option(option).check()

      await expectTheLimitsOnThePage(employmentPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`employment-education-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(employment, answers, userSubmittedSteps)
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
