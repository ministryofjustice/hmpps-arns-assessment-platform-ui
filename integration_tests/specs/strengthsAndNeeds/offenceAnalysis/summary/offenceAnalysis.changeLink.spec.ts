import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import { offence } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  Scenario,
  summaryTab,
} from '../../changeLinkUtils'
import { test } from '../../fixtures'

/**
 * Offence analysis change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Summary: what the summary page lists
 *
 * Branches: Fully answered in order to cover every question
 *
 * Offence analysis has no practitioner analysis questions or analysis page
 */

const summaryPage = 'offence-analysis-summary'

const fullyAnswered: Scenario = {
  answers: [
    { question: Question.offence_analysis_description_of_offence, value: 'Some details' },
    { question: Question.offence_analysis_elements, value: [Option.arson, Option.weapon] },
    { question: Question.offence_weapon_details, value: 'A knife' },
    { question: Question.offence_analysis_reason, value: 'Some details' },
    { question: Question.offence_analysis_motivations, value: [Option.emotional_state] },
    { question: Question.offence_analysis_who_was_the_victim, value: [CommonOption.other] },
    { question: Question.offence_analysis_who_was_the_victim_other_details, value: 'Some details' },
    { question: Question.offence_analysis_how_many_involved, value: Option.two },
    { question: Question.offence_analysis_leader, value: CommonOption.yes },
    { question: Question.offence_analysis_leader_yes_details, value: 'Some details' },
    { question: Question.offence_analysis_impact_on_victims, value: CommonOption.yes },
    { question: Question.offence_analysis_impact_on_victims_yes_details, value: 'Some details' },
    { question: Question.offence_analysis_accept_responsibility, value: CommonOption.yes },
    { question: Question.offence_analysis_accept_responsibility_yes_details, value: 'Some details' },
    { question: Question.offence_analysis_escalation, value: CommonOption.yes },
    { question: Question.offence_analysis_escalation_yes_details, value: 'Some details' },
    { question: Question.offence_analysis_perpetrator_of_domestic_abuse, value: CommonOption.no },
    { question: Question.offence_analysis_victim_of_domestic_abuse, value: CommonOption.no },
    { question: Question.offence_analysis_patterns_of_offending, value: 'Some details' },
    { question: Question.offence_analysis_risk, value: CommonOption.yes },
    { question: Question.offence_analysis_risk_yes_details, value: 'Some details' },
  ],
  summaryChangeLinks: [
    changeLink('offence-analysis', 'offence_analysis_description_of_offence'),
    changeLink('offence-analysis', 'offence_analysis_elements'),
    changeLink('offence-analysis', 'offence_analysis_reason'),
    changeLink('offence-analysis', 'offence_analysis_motivations'),
    changeLink('offence-analysis', 'offence_analysis_who_was_the_victim'),
    changeLink('offence-analysis-involved-parties', 'offence_analysis_how_many_involved'),
    changeLink('offence-analysis-impact', 'offence_analysis_leader'),
    changeLink('offence-analysis-impact', 'offence_analysis_impact_on_victims'),
    changeLink('offence-analysis-impact', 'offence_analysis_accept_responsibility'),
    changeLink('offence-analysis-impact', 'offence_analysis_escalation'),
    changeLink('offence-analysis-impact', 'offence_analysis_perpetrator_of_domestic_abuse'),
    changeLink('offence-analysis-impact', 'offence_analysis_victim_of_domestic_abuse'),
    changeLink('offence-analysis-impact', 'offence_analysis_patterns_of_offending'),
    changeLink('offence-analysis-impact', 'offence_analysis_risk'),
  ],
}

test.describe('Offence analysis change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(offence, fullyAnswered.answers)

        await expectEachChangeLinkToLandOnItsQuestion(
          page,
          `${section}/${summaryPage}`,
          fullyAnswered.summaryChangeLinks,
          summaryTab,
        )
      })
    })
  })

  test.describe('Summary', () => {
    test.describe('fully answered', () => {
      test('the summary page lists every change link', async ({ page, openSection }) => {
        const section = await openSection(offence, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks, summaryTab)
      })
    })
  })
})
