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
      question: Question.personal_relationships_community_any_parenting_responsibilities,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_parental_responsibilities,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_parental_responsibilities_yes_details,
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
      question: Question.personal_relationships_community_belonging,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_in_relationship,
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
      question: Question.personal_relationships_community_domestic_abuse_perpetrator,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_domestic_abuse_against,
      value: [Option.intimate_partner],
    },
    {
      question: Question.personal_relationships_community_domestic_abuse_against_partner_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_coercive_behaviour,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_coercive_behaviour_yes_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_strangulation,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_strangulation_yes_details,
      value: 'test',
    },
    {
      question: Question.personal_relationships_community_domestic_abuse_victim,
      value: CommonOption.yes,
    },
    {
      question: Question.personal_relationships_community_domestic_abuse_victim_by,
      value: [Option.intimate_partner],
    },
    {
      question: Question.personal_relationships_community_domestic_abuse_victim_by_intimate_partner,
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
    changeLink('personal-relationships-children-information', 'personal_relationships_community_children_details'),

    changeLink(
      'personal-relationships-any-parenting-responsibilities',
      'personal_relationships_community_any_parenting_responsibilities',
    ),

    changeLink('personal-relationships-community', 'personal_relationships_community_parental_responsibilities'),
    changeLink('personal-relationships-community', 'personal_relationships_community_family_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_childhood'),
    changeLink('personal-relationships-community', 'personal_relationships_community_childhood_behaviour'),
    changeLink('personal-relationships-community', 'personal_relationships_community_belonging'),
    changeLink('personal-relationships-community', 'personal_relationships_community_in_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_current_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_intimate_relationship'),

    changeLink(
      'personal-relationships-domestic-abuse-perpetrator',
      'personal_relationships_community_domestic_abuse_perpetrator',
    ),

    changeLink(
      'personal-relationships-domestic-abuse-against',
      'personal_relationships_community_domestic_abuse_against',
    ),

    changeLink('personal-relationships-domestic-abuse-against', 'personal_relationships_community_coercive_behaviour'),

    changeLink('personal-relationships-strangulation', 'personal_relationships_community_strangulation'),

    changeLink(
      'personal-relationships-domestic-abuse-victim',
      'personal_relationships_community_domestic_abuse_victim',
    ),

    changeLink(
      'personal-relationships-domestic-abuse-victim-by',
      'personal_relationships_community_domestic_abuse_victim_by',
    ),

    changeLink('personal-relationships-want-to-make-changes', 'personal_relationships_community_changes'),
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
    'personal-relationships-community-summary',
    'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors',
  ),
  changeLink(
    'personal-relationships-community-summary',
    'personal_relationships_community_practitioner_analysis_risk_of_serious_harm',
  ),
  changeLink(
    'personal-relationships-community-summary',
    'personal_relationships_community_practitioner_analysis_risk_of_reoffending',
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
