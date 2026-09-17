import { health } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  test,
} from '../../changeLinkUtils'

/**
 * Health and wellbeing change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Fully answered in order to cover every question
 */

const summaryPage = 'health-wellbeing-summary'
const analysisPage = 'health-wellbeing-analysis'

const fullyAnswered: Scenario = {
  answers: [
    { question: 'health_wellbeing_physical_health_condition', value: 'YES' },
    { question: 'health_wellbeing_physical_health_condition_yes_details', value: 'Some details' },
    { question: 'health_wellbeing_mental_health_condition', value: 'YES_ONGOING_SEVERE' },
    { question: 'health_wellbeing_mental_health_condition_yes_ongoing_severe_details', value: 'Some details' },
    { question: 'health_wellbeing_prescribed_medication_physical_conditions', value: 'Some details' },
    { question: 'health_wellbeing_prescribed_medication_mental_conditions', value: 'Some details' },
    { question: 'health_wellbeing_psychiatric_treatment', value: 'YES' },
    { question: 'health_wellbeing_head_injury_or_illness', value: 'YES' },
    { question: 'health_wellbeing_neurodiverse_conditions', value: 'YES' },
    { question: 'health_wellbeing_neurodiverse_conditions_yes_details', value: 'Some details' },
    { question: 'health_wellbeing_learning_difficulties', value: 'YES_SIGNIFICANT_DIFFICULTIES' },
    { question: 'health_wellbeing_learning_difficulties_yes_significant_difficulties_details', value: 'Some details' },
    { question: 'health_wellbeing_coping_day_to_day_life', value: 'YES' },
    { question: 'health_wellbeing_attitude_towards_self', value: 'POSITIVE' },
    { question: 'health_wellbeing_self_harmed', value: 'YES' },
    { question: 'health_wellbeing_self_harmed_yes_details', value: 'Some details' },
    { question: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts', value: 'YES' },
    { question: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details', value: 'Some details' },
    { question: 'health_wellbeing_outlook', value: 'OPTIMISTIC' },
    { question: 'health_wellbeing_positive_factors', value: ['ACCOMMODATION'] },
    { question: 'health_wellbeing_changes', value: 'MADE_CHANGES' },
    { question: 'health_wellbeing_changes_made_changes_details', value: 'Some details' },
    { question: 'health_wellbeing_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    {
      question: 'health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'health_wellbeing_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    { question: 'health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details', value: 'Some details' },
    { question: 'health_wellbeing_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    { question: 'health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details', value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('health-wellbeing', 'health_wellbeing_physical_health_condition'),
    changeLink('health-wellbeing', 'health_wellbeing_mental_health_condition'),
    changeLink('physical-mental-health', 'health_wellbeing_prescribed_medication_physical_conditions'),
    changeLink('physical-mental-health', 'health_wellbeing_prescribed_medication_mental_conditions'),
    changeLink('physical-mental-health', 'health_wellbeing_psychiatric_treatment'),
    changeLink('physical-mental-health', 'health_wellbeing_head_injury_or_illness'),
    changeLink('physical-mental-health', 'health_wellbeing_neurodiverse_conditions'),
    changeLink('physical-mental-health', 'health_wellbeing_learning_difficulties'),
    changeLink('physical-mental-health', 'health_wellbeing_coping_day_to_day_life'),
    changeLink('physical-mental-health', 'health_wellbeing_attitude_towards_self'),
    changeLink('physical-mental-health', 'health_wellbeing_self_harmed'),
    changeLink('physical-mental-health', 'health_wellbeing_attempted_suicide_or_suicidal_thoughts'),
    changeLink('physical-mental-health', 'health_wellbeing_outlook'),
    changeLink('physical-mental-health', 'health_wellbeing_positive_factors'),
    changeLink('physical-mental-health', 'health_wellbeing_changes'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink('health-wellbeing-summary', 'health_wellbeing_practitioner_analysis_strengths_or_protective_factors'),
  changeLink('health-wellbeing-summary', 'health_wellbeing_practitioner_analysis_risk_of_serious_harm'),
  changeLink('health-wellbeing-summary', 'health_wellbeing_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Health and wellbeing change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(health, fullyAnswered.answers)

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
      const section = await openSection(health, fullyAnswered.answers)

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
        const section = await openSection(health, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })
  })
})
