import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import {
  Option as PersonalRelationshipOption,
  Option,
} from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeedsV2/personalRelationshipsAndCommunityPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { changeOptions, personal } from '../../sanUtils'

/**
 * Some personal relationships and community fields have character limits. These tests exercise the page to reveal
 * the character count fields, then check each one holds to its limit: one character over fails validation, exactly
 * the limit passes.
 */

const answers = [
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
    question: Question.community_personal_relationships_community_parental_responsibilities_no_details,
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
]

const userSubmittedSteps = [
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
]

const relationshipsAndChildhood = [
  {
    name: 'positive',
    current: Option.happy_relationship,
    intimate: Option.stable_relationships,
    parenting: CommonOption.yes,
    family: Option.stable_relationship,
    childhood: Option.positive_childhood,
    behaviour: CommonOption.yes,
    belonging: CommonOption.yes,
  },
  {
    name: 'mixed',
    current: Option.concerns_happy_relationship,
    intimate: Option.positive_and_negative_relationships,
    parenting: Option.sometimes,
    family: Option.mixed_relationship,
    childhood: Option.mixed_childhood,
    behaviour: CommonOption.no,
    belonging: CommonOption.yes,
  },
  {
    name: 'negative',
    current: Option.unhappy_relationship,
    intimate: Option.unstable_relationships,
    parenting: CommonOption.no,
    family: Option.unstable_relationship,
    childhood: Option.negative_childhood,
    behaviour: CommonOption.no,
    belonging: CommonOption.yes,
  },
]

const changeOptionsDomesticAbuse = [
  PersonalRelationshipOption.family_member,
  PersonalRelationshipOption.intimate_partner,
]

test.describe('Personal relationships and community character counts', () => {
  test('personal-relationships-children-information: children they live with, do not live with and see', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(personal, answers, userSubmittedSteps)
    const personalPage = new PersonalRelationshipsAndCommunityPage(page)
    const { questions } = personalPage
    await page.goto(`${section}/${Step.personal_relationships_children_information.path}`)

    await questions.personal_relationships_community_children_details
      .option(Option.yes_children_living_with_pop)
      .check()
    await questions.personal_relationships_community_children_details
      .option(Option.yes_children_not_living_with_pop)
      .check()

    await expectTheLimitsOnThePage(personalPage)
  })

  for (const option of [CommonOption.yes, CommonOption.no]) {
    test(`personal-relationships-any-parenting-responsibilities: parenting responsibilities ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_any_parenting_responsibilities.path}`)

      await questions.community_personal_relationships_community_parental_responsibilities.option(option).check()
      await expectTheLimitsOnThePage(personalPage)
    })
  }

  // a test per set of options, because each one reveals its own details field
  for (const relationships of relationshipsAndChildhood) {
    test(`personal-relationships-community: ${relationships.name} relationships and childhood`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_community.path}`)

      await questions.community_personal_relationships_community_manage_parental_responsibilities
        .option(relationships.parenting)
        .check()
      await questions.personal_relationships_community_family_relationship.option(relationships.family).check()
      await questions.personal_relationships_community_childhood.option(relationships.childhood).check()
      await questions.personal_relationships_community_childhood_behaviour.option(relationships.behaviour).check()
      await questions.personal_relationships_community_sense_of_belonging.option(relationships.behaviour).check()
      await questions.personal_relationships_community_current_relationship.option(relationships.current).check()
      await questions.personal_relationships_community_intimate_relationship.option(relationships.intimate).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of changeOptionsDomesticAbuse) {
    test(`personal-relationships-domestic-abuse-against: who did they abuse ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_domestic_abuse_against.path}`)

      await questions.offence_analysis_perpetrator_of_domestic_abuse_victim.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of [CommonOption.yes, CommonOption.no]) {
    test(`personal-relationships-domestic-abuse-against: evidence of coercive behaviour ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_domestic_abuse_against.path}`)

      await questions.controlling_coercive_behaviour.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of [CommonOption.yes, CommonOption.no]) {
    test(`personal-relationships-strangulation: evidence of strangulation ${option}`, async ({ page, openSection }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_strangulation.path}`)

      await questions.evidence_of_strangulation.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of changeOptionsDomesticAbuse) {
    test(`personal-relationships-domestic-abuse-victim-by: who abused them ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_domestic_abuse_victim_by.path}`)

      await questions.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of changeOptions) {
    test(`personal-relationships-want-to-make-changes: wants to make changes ${option}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_want_to_make_changes.path}`)

      await questions.personal_relationships_community_changes.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`personal-relationships-community-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(personal, answers, userSubmittedSteps)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_community_summary.path}#practitioner-analysis`)

      await questions.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors
        .option(answer)
        .check()
      await questions.personal_relationships_community_practitioner_analysis_risk_of_serious_harm.option(answer).check()
      await questions.personal_relationships_community_practitioner_analysis_risk_of_reoffending.option(answer).check()

      await expectTheLimitsOnThePage(personalPage, { save: personalPage.markComplete })
    })
  }
})
