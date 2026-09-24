import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/question'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeeds/personalRelationshipsAndCommunityPage'
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
    value: 'Some details',
  },
  {
    question: Question.personal_relationships_community_important_people,
    value: [Option.child_parental_responsibilities, Option.family],
  },
  {
    question: Question.personal_relationships_community_important_people_child_parental_responsibilities_details,
    value: 'Some details',
  },
  { question: Question.personal_relationships_community_important_people_family_details, value: 'Some details' },
  { question: Question.personal_relationships_community_current_relationship, value: Option.happy_relationship },
  {
    question: Question.personal_relationships_community_current_relationship_happy_relationship_details,
    value: 'Some details',
  },
  { question: Question.personal_relationships_community_intimate_relationship, value: Option.stable_relationships },
  {
    question: Question.personal_relationships_community_intimate_relationship_stable_relationships_details,
    value: 'Some details',
  },
  { question: Question.personal_relationships_community_challenges_intimate_relationship, value: 'Some details' },
  { question: Question.personal_relationships_community_parental_responsibilities, value: CommonOption.yes },
  { question: Question.personal_relationships_community_parental_responsibilities_yes_details, value: 'Some details' },
  { question: Question.personal_relationships_community_family_relationship, value: Option.stable_relationship },
  {
    question: Question.personal_relationships_community_family_relationship_stable_relationship_details,
    value: 'Some details',
  },
  { question: Question.personal_relationships_community_childhood, value: Option.positive_childhood },
  { question: Question.personal_relationships_community_childhood_positive_childhood_details, value: 'Some details' },
  { question: Question.personal_relationships_community_childhood_behaviour, value: CommonOption.yes },
  { question: Question.personal_relationships_community_childhood_behaviour_yes_details, value: 'Some details' },
  { question: Question.personal_relationships_community_belonging, value: 'Some details' },
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

const relationshipsAndChildhood = [
  {
    name: 'positive',
    current: Option.happy_relationship,
    intimate: Option.stable_relationships,
    parenting: CommonOption.yes,
    family: Option.stable_relationship,
    childhood: Option.positive_childhood,
    behaviour: CommonOption.yes,
  },
  {
    name: 'mixed',
    current: Option.concerns_happy_relationship,
    intimate: Option.positive_and_negative_relationships,
    parenting: Option.sometimes,
    family: Option.mixed_relationship,
    childhood: Option.mixed_childhood,
    behaviour: CommonOption.no,
  },
  {
    name: 'negative',
    current: Option.unhappy_relationship,
    intimate: Option.unstable_relationships,
    parenting: CommonOption.no,
    family: Option.unstable_relationship,
    childhood: Option.negative_childhood,
    behaviour: CommonOption.no,
  },
]

test.describe('Personal relationships and community character counts', () => {
  test('personal-relationships-children-information: children they live with, do not live with and see', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(personal, answers)
    const personalPage = new PersonalRelationshipsAndCommunityPage(page)
    const { questions } = personalPage
    await page.goto(`${section}/${Step.personal_relationships_children_information.path}`)

    await questions.personal_relationships_community_children_details
      .option(Option.yes_children_living_with_pop)
      .check()
    await questions.personal_relationships_community_children_details
      .option(Option.yes_children_not_living_with_pop)
      .check()
    await questions.personal_relationships_community_children_details.option(Option.yes_children_visiting).check()

    await expectTheLimitsOnThePage(personalPage)
  })

  test('personal-relationships: everyone important to them', async ({ page, openSection }) => {
    const section = await openSection(personal, answers)
    const personalPage = new PersonalRelationshipsAndCommunityPage(page)
    const { questions } = personalPage
    await page.goto(`${section}/${Step.personal_relationships.path}`)
    const importantPeople = questions.personal_relationships_community_important_people

    await importantPeople.option(Option.partner_intimate_relationship).check()
    await importantPeople.option(Option.child_parental_responsibilities).check()
    await importantPeople.option(Option.other_children).check()
    await importantPeople.option(Option.family).check()
    await importantPeople.option(Option.friends).check()
    await importantPeople.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(personalPage)
  })

  // a test per set of options, because each one reveals its own details field
  for (const relationships of relationshipsAndChildhood) {
    test(`personal-relationships-community: ${relationships.name} relationships and childhood`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(personal, answers)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_community.path}`)

      await questions.personal_relationships_community_current_relationship.option(relationships.current).check()
      await questions.personal_relationships_community_intimate_relationship.option(relationships.intimate).check()
      await questions.personal_relationships_community_parental_responsibilities.option(relationships.parenting).check()
      await questions.personal_relationships_community_family_relationship.option(relationships.family).check()
      await questions.personal_relationships_community_childhood.option(relationships.childhood).check()
      await questions.personal_relationships_community_childhood_behaviour.option(relationships.behaviour).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const option of changeOptions) {
    test(`personal-relationships-community: wants to make changes ${option}`, async ({ page, openSection }) => {
      const section = await openSection(personal, answers)
      const personalPage = new PersonalRelationshipsAndCommunityPage(page)
      const { questions } = personalPage
      await page.goto(`${section}/${Step.personal_relationships_community.path}`)

      await questions.personal_relationships_community_changes.option(option).check()

      await expectTheLimitsOnThePage(personalPage)
    })
  }

  for (const answer of [CommonOption.yes, CommonOption.no]) {
    test(`personal-relationships-community-summary: practitioner analysis ${answer}`, async ({ page, openSection }) => {
      const section = await openSection(personal, answers)
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
