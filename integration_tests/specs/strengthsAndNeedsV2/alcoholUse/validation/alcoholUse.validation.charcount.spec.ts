import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import AlcoholUsePage from 'pages/strengthsAndNeedsV2/alcoholUsePage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, alcohol } from '../../sanUtils'

/**
 * Some alcohol use fields have character limits. These tests exercise the page to reveal the character count fields,
 * then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 */

const answers = [
  { question: Question.alcohol_current_issues, value: Option.significant },
  { question: Question.alcohol_evidence_of_excess_drinking, value: Option.yes_with_evidence },
  { question: Question.alcohol_past_issues, value: CommonOption.yes },
  { question: Question.alcohol_past_issues_yes_details, value: 'Some details' },
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
const userSubmittedSteps = [
  Step.alcohol_use_current_issues.code,
  Step.alcohol_use_excessive_drinking_past_issues.code,
  Step.alcohol_use_stopped_or_reduced.code,
  Step.alcohol_use_changes.code,
  Step.alcohol_use_summary.code,
]

test.describe('Alcohol use character counts', () => {
  test('alcohol_use_excessive_drinking_past_issues: past issues', async ({ page, openSection }) => {
    const section = await openSection(alcohol, answers, userSubmittedSteps)
    const alcoholUsePage = new AlcoholUsePage(page)
    const { questions } = alcoholUsePage
    await page.goto(`${section}/${Step.alcohol_use_excessive_drinking_past_issues.path}`)

    await questions.alcohol_evidence_of_excess_drinking.option(Option.no_evidence).check()
    await questions.alcohol_past_issues.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(alcoholUsePage)
  })

  test('alcohol_use_stopped_or_reduced: alcohol_stopped_or_reduced', async ({ page, openSection }) => {
    const section = await openSection(alcohol, answers, userSubmittedSteps)
    const alcoholUsePage = new AlcoholUsePage(page)
    const { questions } = alcoholUsePage
    await page.goto(`${section}/${Step.alcohol_use_stopped_or_reduced.path}`)

    await questions.alcohol_stopped_or_reduced.option(CommonOption.yes).check()

    await expectTheLimitsOnThePage(alcoholUsePage)
  })

  // a test per option, because each one reveals its own details field
  for (const option of changeOptions) {
    test(`alcohol-use-details: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(alcohol, answers, userSubmittedSteps)
      const alcoholUsePage = new AlcoholUsePage(page)
      const { questions } = alcoholUsePage
      await page.goto(`${section}/${Step.alcohol_use_changes.path}`)

      await questions.alcohol_use_changes.option(option).check()

      await expectTheLimitsOnThePage(alcoholUsePage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`alcohol-use-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(alcohol, answers, userSubmittedSteps)
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
