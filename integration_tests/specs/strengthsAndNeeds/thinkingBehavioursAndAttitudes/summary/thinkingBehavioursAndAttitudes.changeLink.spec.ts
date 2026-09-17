import { thinking } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
  test,
} from '../../changeLinkUtils'

/**
 * Thinking, behaviours and attitudes change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Fully answered in order to cover every question
 */

const summaryPage = 'thinking-behaviours-summary'
const analysisPage = 'thinking-behaviours-analysis'

const fullyAnswered: Scenario = {
  answers: [
    { question: 'thinking_behaviours_attitudes_consequences', value: 'SOMETIMES' },
    { question: 'thinking_behaviours_attitudes_stable_behaviour', value: 'NO' },
    { question: 'thinking_behaviours_attitudes_offending_activities', value: 'YES_OFFENDING_ACTIVITIES' },
    { question: 'thinking_behaviours_attitudes_peer_pressure', value: 'SOME' },
    { question: 'thinking_behaviours_attitudes_peer_pressure_some_details', value: 'Some details' },
    { question: 'thinking_behaviours_attitudes_problem_solving', value: 'LIMITED_PROBLEM_SOLVING' },
    { question: 'thinking_behaviours_attitudes_peoples_views', value: 'SOMETIMES' },
    { question: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour', value: 'SOME' },
    { question: 'thinking_behaviours_attitudes_temper_management', value: 'NO' },
    { question: 'thinking_behaviours_attitudes_violence_controlling_behaviour', value: 'SOMETIMES' },
    { question: 'thinking_behaviours_attitudes_impulsive_behaviour', value: 'YES' },
    { question: 'thinking_behaviours_attitudes_positive_attitude', value: 'NEGATIVE_ATTITUDE_AND_CONCERNS' },
    { question: 'thinking_behaviours_attitudes_hostile_orientation', value: 'SOME' },
    { question: 'thinking_behaviours_attitudes_supervision', value: 'UNSURE_SUPERVISION' },
    { question: 'thinking_behaviours_attitudes_criminal_behaviour', value: 'SOMETIMES' },
    { question: 'thinking_behaviours_attitudes_changes', value: 'NOT_APPLICABLE' },
    { question: 'thinking_behaviours_attitudes_risk_sexual_harm', value: 'YES' },
    { question: 'thinking_behaviours_attitudes_sexual_preoccupation', value: 'SOMETIMES' },
    {
      question: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
      value: 'SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
    },
    { question: 'thinking_behaviours_attitudes_emotional_intimacy', value: 'UNKNOWN' },
    { question: 'thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
    {
      question: 'thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    {
      question: 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details',
      value: 'Some details',
    },
    { question: 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    {
      question: 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details',
      value: 'Some details',
    },
  ],
  summaryChangeLinks: [
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_consequences'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_stable_behaviour'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_offending_activities'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_peer_pressure'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_problem_solving'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_peoples_views'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_manipulative_predatory_behaviour'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_temper_management'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_violence_controlling_behaviour'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_impulsive_behaviour'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_positive_attitude'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_hostile_orientation'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_supervision'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_criminal_behaviour'),
    changeLink('thinking-behaviours', 'thinking_behaviours_attitudes_changes'),
    changeLink('thinking-behaviours-risk-of-sexual-harm', 'thinking_behaviours_attitudes_risk_sexual_harm'),
    changeLink('thinking-behaviours-sexual-harm', 'thinking_behaviours_attitudes_sexual_preoccupation'),
    changeLink('thinking-behaviours-sexual-harm', 'thinking_behaviours_attitudes_offence_related_sexual_interest'),
    changeLink('thinking-behaviours-sexual-harm', 'thinking_behaviours_attitudes_emotional_intimacy'),
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink(
    'thinking-behaviours-summary',
    'thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors',
  ),
  changeLink('thinking-behaviours-summary', 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm'),
  changeLink('thinking-behaviours-summary', 'thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending'),
]

test.describe('Thinking, behaviours and attitudes change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(thinking, fullyAnswered.answers)

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
      const section = await openSection(thinking, fullyAnswered.answers)

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
        const section = await openSection(thinking, fullyAnswered.answers)

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
