import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import ThinkingBehavioursAndAttitudesPage from 'pages/strengthsAndNeeds/thinkingBehavioursAndAttitudesPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, thinking } from '../../sanUtils'

/**
 * Some thinking, behaviours and attitudes fields have character limits. These tests exercise the page to reveal the
 * character count fields, then check each one holds to its limit: one character over fails validation, exactly the
 * limit passes.
 */

const answers = [
  { question: Question.thinking_behaviours_attitudes_consequences, value: Option.sometimes },
  { question: Question.thinking_behaviours_attitudes_stable_behaviour, value: CommonOption.no },
  { question: Question.thinking_behaviours_attitudes_offending_activities, value: Option.yes_offending_activities },
  { question: Question.thinking_behaviours_attitudes_peer_pressure, value: Option.some },
  { question: Question.thinking_behaviours_attitudes_peer_pressure_some_details, value: 'Some details' },
  { question: Question.thinking_behaviours_attitudes_problem_solving, value: Option.limited_problem_solving },
  { question: Question.thinking_behaviours_attitudes_peoples_views, value: Option.sometimes },
  { question: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour, value: Option.some },
  { question: Question.thinking_behaviours_attitudes_temper_management, value: CommonOption.no },
  { question: Question.thinking_behaviours_attitudes_violence_controlling_behaviour, value: Option.sometimes },
  { question: Question.thinking_behaviours_attitudes_impulsive_behaviour, value: CommonOption.yes },
  { question: Question.thinking_behaviours_attitudes_positive_attitude, value: Option.negative_attitude_and_concerns },
  { question: Question.thinking_behaviours_attitudes_hostile_orientation, value: Option.some },
  { question: Question.thinking_behaviours_attitudes_supervision, value: Option.unsure_supervision },
  { question: Question.thinking_behaviours_attitudes_criminal_behaviour, value: Option.sometimes },
  { question: Question.thinking_behaviours_attitudes_changes, value: CommonOption.not_applicable },
  { question: Question.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
  { question: Question.thinking_behaviours_attitudes_sexual_preoccupation, value: Option.sometimes },
  {
    question: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
    value: Option.some_offence_related_sexual_interest,
  },
  { question: Question.thinking_behaviours_attitudes_emotional_intimacy, value: CommonOption.unknown },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: 'Some details',
  },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm,
    value: CommonOption.yes,
  },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details,
    value: 'Some details',
  },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending,
    value: CommonOption.yes,
  },
  {
    question: Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details,
    value: 'Some details',
  },
]

test.describe('Thinking, behaviours and attitudes character counts', () => {
  // a test per option, because each one reveals its own details field
  for (const option of [CommonOption.yes, Option.some, CommonOption.no]) {
    test(`thinking-behaviours: peer pressure ${option}`, async ({ page, openSection }) => {
      const section = await openSection(thinking, answers)
      const thinkingPage = new ThinkingBehavioursAndAttitudesPage(page)
      const { questions } = thinkingPage
      await page.goto(`${section}/${Step.thinkingBehaviours.path}`)

      await questions.thinking_behaviours_attitudes_peer_pressure.option(option).check()

      await expectTheLimitsOnThePage(thinkingPage)
    })
  }

  for (const option of changeOptions) {
    test(`thinking-behaviours: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(thinking, answers)
      const thinkingPage = new ThinkingBehavioursAndAttitudesPage(page)
      const { questions } = thinkingPage
      await page.goto(`${section}/${Step.thinkingBehaviours.path}`)

      await questions.thinking_behaviours_attitudes_changes.option(option).check()

      await expectTheLimitsOnThePage(thinkingPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`thinking-behaviours-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(thinking, answers)
      const thinkingPage = new ThinkingBehavioursAndAttitudesPage(page)
      const { questions } = thinkingPage
      await page.goto(`${section}/${Step.thinkingBehavioursSummary.path}#practitioner-analysis`)

      await questions.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors
        .option(answer)
        .check()
      await questions.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(thinkingPage, { save: thinkingPage.markComplete })
    })
  }
})
