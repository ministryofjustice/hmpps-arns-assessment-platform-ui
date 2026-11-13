import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/step'
import { personal } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  summaryTab,
} from '../../changeLinkUtils'
import { test } from '../../fixtures'

/**
 * Personal relationships and community change links
 *
 *   1. Questions: for each branch of the section, every question change link followed
 *   2. Practitioner analysis: every practitioner analysis change link followed
 *   3. Summary: what the summary and analysis pages list
 *
 * Branches: Parental responsibilities included, as that is the only way that question appears,
 * in order to cover every question
 */

const summaryPage = 'personal-relationships-community-summary'
const analysisPage = 'personal-relationships-community-analysis'

const fullyAnswered: Scenario = {
  answers: [
    {
      question: Question.personal_relationships_community_children_details,
      value: [Option.yes_children_living_with_pop],
    },
    {
      question: Question.personal_relationships_community_children_details_yes_children_living_with_pop_details,
      value: 'test',
    },
    {
      question: Question.community_personal_relationships_community_parental_responsibilities,
      value: CommonOption.yes,
    },
    {
      question: Question.community_personal_relationships_community_parental_responsibilities_yes_details,
      value: 'test',
    },
    {
      question: Question.community_personal_relationships_community_manage_parental_responsibilities,
      value: CommonOption.yes,
    },
    {
      question: Question.community_personal_relationships_community_manage_parental_responsibilities_yes_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_family_relationship,
      value: Option.stable_relationship,
    },
    {
      question: Question.personal_relationships_community_family_relationship_stable_relationship_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_childhood,
      value: Option.positive_childhood,
    },
    {
      question: Question.personal_relationships_community_childhood_positive_childhood_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_childhood_behaviour,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_childhood_behaviour_yes_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_sense_of_belonging,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_sense_of_belonging_yes_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_relationship_status,
      value: Option.in_relationship_living_together,
    },
    {
      question: Question.personal_relationships_community_current_relationship,
      value: Option.happy_relationship,
    },
    {
      question: Question.personal_relationships_community_current_relationship_happy_relationship_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_intimate_relationship,
      value: Option.stable_relationships,
    },
    {
      question: Question.personal_relationships_community_intimate_relationship_stable_relationships_details,
      value: 'test',
    },
    {
      question: Question.offence_analysis_perpetrator_of_domestic_abuse,
      value: CommonOption.yes,
    },
    {
      question: Question.offence_analysis_perpetrator_of_domestic_abuse_victim,
      value: [Option.intimate_partner],
    },
    {
      question: Question.offence_analysis_perpetrator_of_domestic_abuse_victim_intimate_partner_details,
      value: 'test',
    },
    {
      question: Question.controlling_coercive_behaviour,
      value: CommonOption.yes,
    },
    {
      question: Question.controlling_coercive_behaviour_yes_details,
      value: 'test',
    },
    {
      question: Question.evidence_of_strangulation,
      value: CommonOption.yes,
    },
    {
      question: Question.evidence_of_strangulation_yes_details,
      value: 'test',
    },
    {
      question: Question.offence_analysis_victim_of_domestic_abuse,
      value: CommonOption.yes,
    },
    {
      question: Question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse,
      value: [Option.intimate_partner],
    },
    {
      question: Question.offence_analysis_victim_of_domestic_abuse_intimate_partner_details,
      value: 'test',
    },
    { question: Question.personal_relationships_community_changes, value: CommonOption.made_changes },
    { question: Question.personal_relationships_community_changes_made_changes_details, value: 'Some details' },
    {
      question: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
      value: CommonOption.yes,
    },
    {
      question:
        Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details,
      value: 'Some details',
    },
    {
      question: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details,
      value: 'Some details',
    },
    {
      question: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details,
      value: 'Some details',
    },
  ],
  summaryChangeLinks: [
    changeLink(
      Step.personal_relationships_children_information.path,
      Question.personal_relationships_community_children_details,
    ),
    changeLink(
      Step.personal_relationships_any_parenting_responsibilities.path,
      Question.community_personal_relationships_community_parental_responsibilities,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.community_personal_relationships_community_manage_parental_responsibilities,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_family_relationship,
    ),
    changeLink(Step.personal_relationships_community.path, Question.personal_relationships_community_childhood),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_childhood_behaviour,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_sense_of_belonging,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_relationship_status,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_current_relationship,
    ),
    changeLink(
      Step.personal_relationships_community.path,
      Question.personal_relationships_community_intimate_relationship,
    ),
    changeLink(
      Step.personal_relationships_domestic_abuse_perpetrator.path,
      Question.offence_analysis_perpetrator_of_domestic_abuse,
    ),
    changeLink(
      Step.personal_relationships_domestic_abuse_against.path,
      Question.offence_analysis_perpetrator_of_domestic_abuse_victim,
    ),
    changeLink(Step.personal_relationships_domestic_abuse_against.path, Question.controlling_coercive_behaviour),
    changeLink(Step.personal_relationships_strangulation.path, Question.evidence_of_strangulation),
    changeLink(
      Step.personal_relationships_domestic_abuse_victim.path,
      Question.offence_analysis_victim_of_domestic_abuse,
    ),
    changeLink(
      Step.personal_relationships_domestic_abuse_victim_by.path,
      Question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse,
    ),
    changeLink(
      Step.personal_relationships_want_to_make_changes.path,
      Question.personal_relationships_community_changes,
    ),
  ],
  userSubmittedSteps: [
    Step.personal_relationships_children_information.code,
    Step.personal_relationships_any_parenting_responsibilities.code,
    Step.personal_relationships_community.code,
    Step.personal_relationships_domestic_abuse_perpetrator.code,
    Step.personal_relationships_domestic_abuse_against.code,
    Step.personal_relationships_strangulation.code,
    Step.personal_relationships_domestic_abuse_victim.code,
    Step.personal_relationships_domestic_abuse_victim_by.code,
    Step.personal_relationships_want_to_make_changes.code,
    Step.personal_relationships_community_summary.code,
  ],
}

const practitionerAnalysisChangeLinks = [
  changeLink(
    Step.personal_relationships_community_summary.path,
    Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
  ),
  changeLink(
    Step.personal_relationships_community_summary.path,
    Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
  ),
  changeLink(
    Step.personal_relationships_community_summary.path,
    Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending,
  ),
]

test.describe('Personal relationships and community change links', () => {
  test.describe('Questions', () => {
    test.describe('fully answered', () => {
      test('each change link lands on its question', async ({ page, openSection }) => {
        const section = await openSection(personal, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
      const section = await openSection(personal, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
        const section = await openSection(personal, fullyAnswered.answers, fullyAnswered.userSubmittedSteps)

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
