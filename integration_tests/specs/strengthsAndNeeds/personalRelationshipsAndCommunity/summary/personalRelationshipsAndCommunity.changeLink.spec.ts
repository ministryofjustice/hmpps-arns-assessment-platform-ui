import { personal } from '../../sanUtils'
import {
  changeLink,
  expectChangeLinksListed,
  expectEachChangeLinkToLandOnItsQuestion,
  practitionerAnalysisTab,
  Scenario,
  test,
} from '../../changeLinkUtils'

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
    { question: 'personal_relationships_community_children_details', value: ['YES_CHILDREN_LIVING_WITH_POP'] },
    {
      question: 'personal_relationships_community_children_details_yes_children_living_with_pop_details',
      value: 'Some details',
    },
    {
      question: 'personal_relationships_community_important_people',
      value: ['CHILD_PARENTAL_RESPONSIBILITIES', 'FAMILY'],
    },
    {
      question: 'personal_relationships_community_important_people_child_parental_responsibilities_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_important_people_family_details', value: 'Some details' },
    { question: 'personal_relationships_community_current_relationship', value: 'HAPPY_RELATIONSHIP' },
    {
      question: 'personal_relationships_community_current_relationship_happy_relationship_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_intimate_relationship', value: 'STABLE_RELATIONSHIPS' },
    {
      question: 'personal_relationships_community_intimate_relationship_stable_relationships_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_challenges_intimate_relationship', value: 'Some details' },
    { question: 'personal_relationships_community_parental_responsibilities', value: 'YES' },
    { question: 'personal_relationships_community_parental_responsibilities_yes_details', value: 'Some details' },
    { question: 'personal_relationships_community_family_relationship', value: 'STABLE_RELATIONSHIP' },
    {
      question: 'personal_relationships_community_family_relationship_stable_relationship_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_childhood', value: 'POSITIVE_CHILDHOOD' },
    { question: 'personal_relationships_community_childhood_positive_childhood_details', value: 'Some details' },
    { question: 'personal_relationships_community_childhood_behaviour', value: 'YES' },
    { question: 'personal_relationships_community_childhood_behaviour_yes_details', value: 'Some details' },
    { question: 'personal_relationships_community_belonging', value: 'Some details' },
    { question: 'personal_relationships_community_changes', value: 'MADE_CHANGES' },
    { question: 'personal_relationships_community_changes_made_changes_details', value: 'Some details' },
    {
      question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors',
      value: 'YES',
    },
    {
      question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
    {
      question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details',
      value: 'Some details',
    },
    { question: 'personal_relationships_community_practitioner_analysis_risk_of_reoffending', value: 'YES' },
    {
      question: 'personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details',
      value: 'Some details',
    },
  ],
  summaryChangeLinks: [
    changeLink('personal-relationships-children-information', 'personal_relationships_community_children_details'),
    changeLink('personal-relationships', 'personal_relationships_community_important_people'),
    changeLink('personal-relationships-community', 'personal_relationships_community_current_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_intimate_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_challenges_intimate_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_parental_responsibilities'),
    changeLink('personal-relationships-community', 'personal_relationships_community_family_relationship'),
    changeLink('personal-relationships-community', 'personal_relationships_community_childhood'),
    changeLink('personal-relationships-community', 'personal_relationships_community_childhood_behaviour'),
    changeLink('personal-relationships-community', 'personal_relationships_community_belonging'),
    changeLink('personal-relationships-community', 'personal_relationships_community_changes'),
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
        const section = await openSection(personal, fullyAnswered.answers)

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
      const section = await openSection(personal, fullyAnswered.answers)

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
        const section = await openSection(personal, fullyAnswered.answers)

        await expectChangeLinksListed(page, `${section}/${summaryPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, fullyAnswered.summaryChangeLinks)
        await expectChangeLinksListed(page, `${section}/${analysisPage}`, practitionerAnalysisChangeLinks, {
          tab: practitionerAnalysisTab,
        })
      })
    })
  })
})
