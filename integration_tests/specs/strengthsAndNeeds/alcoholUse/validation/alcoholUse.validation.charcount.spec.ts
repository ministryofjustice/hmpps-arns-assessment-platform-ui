import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, alcohol } from '../../sanUtils'

/**
 * Some alcohol use fields have character limits. These tests exercise the page to reveal the character count fields,
 * then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

const answers = [
  { question: Question.alcohol_use, value: Option.yes_within_last_three_months },
  { question: Question.alcohol_frequency, value: Option.more_than_4_times_a_week },
  { question: Question.alcohol_units, value: Option.units_7_to_9 },
  { question: Question.alcohol_binge_drinking, value: CommonOption.yes },
  { question: Question.alcohol_binge_drinking_frequency, value: Option.weekly },
  { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
  { question: Question.alcohol_past_issues, value: CommonOption.yes },
  { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
  {
    question: Question.alcohol_reasons_for_use,
    value: [Option.social, Option.managing_emotional_issues, CommonOption.other],
  },
  { question: Question.alcohol_reasons_for_use_other_details, value: 'Some details' },
  { question: Question.alcohol_impact_of_use, value: [Option.finances, Option.relationships, CommonOption.other] },
  { question: Question.alcohol_impact_of_use_other_details, value: 'Some details' },
  { question: Question.alcohol_stopped_or_reduced, value: CommonOption.yes },
  { question: Question.alcohol_stopped_or_reduced_yes_details, value: 'Some details' },
  { question: Question.alcohol_use_changes, value: CommonOption.does_not_want_to_make_changes },
  { question: Question.alcohol_use_changes_does_not_want_to_make_changes_details, value: 'Some details' },
  { question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors, value: CommonOption.no },
  {
    question: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
    value: 'Some details',
  },
  { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
  { question: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
  { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  { question: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
]

test.describe('Alcohol use character counts', () => {
  test('alcohol-use-details: past issues, reasons, impact and what has helped', async ({ page, openSection }) => {
    const section = await openSection(alcohol, answers)
    const alcoholUsePage = new AlcoholUsePage(page)
    const { questions } = alcoholUsePage
    await page.goto(`${section}/${Step.alcohol_use_details.path}`)

    await questions.alcohol_past_issues.option(CommonOption.yes).check()
    await questions.alcohol_reasons_for_use.option(CommonOption.other).check()
    await questions.alcohol_impact_of_use.option(CommonOption.other).check()
    await questions.alcohol_stopped_or_reduced.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(alcoholUsePage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of changeOptions) {
    test(`alcohol-use-details: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(alcohol, answers)
      const alcoholUsePage = new AlcoholUsePage(page)
      const { questions } = alcoholUsePage
      await page.goto(`${section}/${Step.alcohol_use_details.path}`)

      await questions.alcohol_use_changes.option(option).check()

      await expectTheLimitsOnThePage(alcoholUsePage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`alcohol-use-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(alcohol, answers)
      const alcoholUsePage = new AlcoholUsePage(page)
      const { questions } = alcoholUsePage
      await page.goto(`${section}/${Step.alcohol_use_summary.path}#practitioner-analysis`)

      await questions.alcohol_use_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.alcohol_use_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.alcohol_use_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(alcoholUsePage, { save: alcoholUsePage.markComplete })
    })
  }
})
