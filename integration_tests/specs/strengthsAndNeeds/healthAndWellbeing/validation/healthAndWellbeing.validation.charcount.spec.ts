import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/question'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, health } from '../../sanUtils'

/**
 * Some health and wellbeing fields have character limits. These tests exercise the page to reveal the character
 * count fields, then check each one holds to its limit: one character over fails validation, exactly the limit
 * passes.
 */

const answers = [
  { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.yes },
  { question: Question.health_wellbeing_physical_health_condition_yes_details, value: 'Some details' },
  { question: Question.health_wellbeing_mental_health_condition, value: Option.yes_ongoing_severe },
  { question: Question.health_wellbeing_mental_health_condition_yes_ongoing_severe_details, value: 'Some details' },
  { question: Question.health_wellbeing_prescribed_medication_physical_conditions, value: 'Some details' },
  { question: Question.health_wellbeing_prescribed_medication_mental_conditions, value: 'Some details' },
  { question: Question.health_wellbeing_psychiatric_treatment, value: CommonOption.yes },
  { question: Question.health_wellbeing_head_injury_or_illness, value: CommonOption.yes },
  { question: Question.health_wellbeing_neurodiverse_conditions, value: CommonOption.yes },
  { question: Question.health_wellbeing_neurodiverse_conditions_yes_details, value: 'Some details' },
  { question: Question.health_wellbeing_learning_difficulties, value: Option.yes_significant_difficulties },
  {
    question: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details,
    value: 'Some details',
  },
  { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.yes },
  { question: Question.health_wellbeing_attitude_towards_self, value: Option.positive },
  { question: Question.health_wellbeing_self_harmed, value: CommonOption.yes },
  { question: Question.health_wellbeing_self_harmed_yes_details, value: 'Some details' },
  { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.yes },
  { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details, value: 'Some details' },
  { question: Question.health_wellbeing_outlook, value: Option.optimistic },
  { question: Question.health_wellbeing_positive_factors, value: [Option.accommodation] },
  { question: Question.health_wellbeing_changes, value: CommonOption.made_changes },
  { question: Question.health_wellbeing_changes_made_changes_details, value: 'Some details' },
  {
    question: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: 'Some details',
  },
  { question: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
  { question: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details, value: 'Some details' },
  { question: Question.health_wellbeing_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  { question: Question.health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details, value: 'Some details' },
]

test.describe('Health and wellbeing character counts', () => {
  // a test per option, because each one reveals its own details field
  for (const option of [Option.yes_ongoing_severe, Option.yes_ongoing, Option.yes_in_the_past]) {
    test(`health-wellbeing: physical health condition, and mental health condition ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(health, answers)
      const healthPage = new HealthAndWellbeingPage(page)
      const { questions } = healthPage
      await page.goto(`${section}/${Step.health_wellbeing.path}`)

      await questions.health_wellbeing_physical_health_condition.option(CommonOption.yes).check()
      await questions.health_wellbeing_mental_health_condition.option(option).check()

      await expectTheLimitsOnThePage(healthPage)
    })
  }

  // prescribed medication for physical and mental conditions is always shown on this page
  test('physical-mental-health: neurodiverse conditions, self harm, suicidal thoughts and positive factors', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(health, answers)
    const healthPage = new HealthAndWellbeingPage(page)
    const { questions } = healthPage
    await page.goto(`${section}/${Step.physical_mental_health.path}`)

    await questions.health_wellbeing_neurodiverse_conditions.option(CommonOption.yes).check()
    await questions.health_wellbeing_self_harmed.option(CommonOption.yes).check()
    await questions.health_wellbeing_attempted_suicide_or_suicidal_thoughts.option(CommonOption.yes).check()
    await questions.health_wellbeing_positive_factors.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(healthPage)
  })

  for (const option of [Option.yes_significant_difficulties, Option.yes_some_difficulties]) {
    test(`physical-mental-health: learning difficulties ${option}`, async ({ page, openSection }) => {
      const section = await openSection(health, answers)
      const healthPage = new HealthAndWellbeingPage(page)
      const { questions } = healthPage
      await page.goto(`${section}/${Step.physical_mental_health.path}`)

      await questions.health_wellbeing_learning_difficulties.option(option).check()

      await expectTheLimitsOnThePage(healthPage)
    })
  }

  for (const option of changeOptions) {
    test(`physical-mental-health: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(health, answers)
      const healthPage = new HealthAndWellbeingPage(page)
      const { questions } = healthPage
      await page.goto(`${section}/${Step.physical_mental_health.path}`)

      await questions.health_wellbeing_changes.option(option).check()

      await expectTheLimitsOnThePage(healthPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`health-wellbeing-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(health, answers)
      const healthPage = new HealthAndWellbeingPage(page)
      const { questions } = healthPage
      await page.goto(`${section}/${Step.health_wellbeing_summary.path}#practitioner-analysis`)

      await questions.health_wellbeing_practitioner_analysis_strengths_or_protective_factors.option(answer).check()
      await questions.health_wellbeing_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.health_wellbeing_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(healthPage, { save: healthPage.markComplete })
    })
  }
})
