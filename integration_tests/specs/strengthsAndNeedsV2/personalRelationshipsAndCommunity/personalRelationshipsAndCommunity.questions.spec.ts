import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeedsV2/personalRelationshipsAndCommunityPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows any children', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      "Are there any children in Test's life?",
    )

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.personal))

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
        - group "Are there any children in Test's life?":
          - text: Are there any children in Test's life? This refers to any children (under 18 years) Test has regular contact with, even if they do not have parental responsibility. Select all that apply.
          - checkbox "Yes, children that live with them"
          - text: Yes, children that live with them
          - checkbox "Yes, children that do not live with them"
          - text: Yes, children that do not live with them or
          - checkbox "No, there are no children in Test's life"
          - text: No, there are no children in Test's life
        - button "Save and continue"
    `)
  })

  test('shows any parenting responsibilities questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: Question.personal_relationships_community_children_details,
          value: [Option.yes_children_living_with_pop],
        },
        {
          question: Question.personal_relationships_community_children_details_yes_children_living_with_pop_details,
          value: 'test',
        },
      ])
      .withUserSubmittedSteps([Step.personal_relationships_children_information.code])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-any-parenting-responsibilities',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Does Test have any parenting responsibilities?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any parenting responsibilities?":
        - text: Does Test have any parenting responsibilities?
        - radio "Yes"
        - text: Yes
        - radio "No"
        - text: No
      - button "Save and continue"
    `)
  })

  test('shows community questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-community',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Is Test able to manage their parenting responsibilities?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Is Test able to manage their parenting responsibilities?":
        - text: Is Test able to manage their parenting responsibilities? If there are parenting concerns, it does not always mean there are child wellbeing concerns. They may just require some help or support.
        - radio "Yes, manages parenting responsibilities well"
        - text: Yes, manages parenting responsibilities well
        - radio "Sometimes manages parenting responsibilities well"
        - text: Sometimes manages parenting responsibilities well
        - radio "No, is not able to manage parenting responsibilities"
        - text: No, is not able to manage parenting responsibilities
        - radio "Unknown"
        - text: Unknown
      - group "What is Test's current relationship like with their family?":
        - text: What is Test's current relationship like with their family? Consider any relationships that may act like family support.
        - radio "Stable, supportive, positive and rewarding relationship"
        - text: Stable, supportive, positive and rewarding relationship
        - radio "Both positive and negative relationship"
        - text: Both positive and negative relationship
        - radio "Unstable and unsupportive relationship"
        - text: Unstable and unsupportive relationship This includes those who have little or no contact with their family.
        - radio "Unknown"
        - text: Unknown
      - group "What was Test's experience of their childhood?":
        - text: What was Test's experience of their childhood? Childhood is the period up to and including 18 years old.
        - radio "Positive experience"
        - text: Positive experience
        - radio "Both positive and negative experience"
        - text: Both positive and negative experience
        - radio "Negative experience"
        - text: Negative experience This includes things like permanent or long-term separation from their parents or guardians, inconsistent care, neglect or abuse.
      - group "Did Test have any childhood behavioural problems?":
        - text: Did Test have any childhood behavioural problems? Consider any adverse experiences and trauma, as well as neurodiversity that could lead to behavioural problems.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - text: Is Test part of any groups or communities that gives them a sense of belonging? (optional) For example, online social media or community groups.
      - textbox "Is Test part of any groups or communities that gives them a sense of belonging? (optional)"
      - text: You can enter up to 2000 characters You have 2,000 characters remaining
      - group "Is Test in a relationship?":
        - text: Is Test in a relationship?
        - radio "In a relationship, living together"
        - text: In a relationship, living together
        - radio "In a relationship, not living together"
        - text: In a relationship, not living together
        - radio "Not in a relationship"
        - text: Not in a relationship
      - group "Is Test happy with their current relationship status?":
        - text: Is Test happy with their current relationship status?
        - radio "Happy and positive about their relationship status or their relationship is likely to act as a protective factor"
        - text: Happy and positive about their relationship status or their relationship is likely to act as a protective factor
        - radio "Has some concerns about their relationship status but is overall happy"
        - text: Has some concerns about their relationship status but is overall happy
        - radio "Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending"
        - text: Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending
      - group "What is Test's history of intimate relationships?":
        - text: What is Test's history of intimate relationships? An intimate relationship is one that involves physical and/or emotional closeness.
        - radio "History of stable, supportive, positive and rewarding relationships"
        - text: History of stable, supportive, positive and rewarding relationships This includes if they do not have a history of relationships but appear capable of starting and maintaining one.
        - radio "History of both positive and negative relationships"
        - text: History of both positive and negative relationships
        - radio "History of unstable, unsupportive and destructive relationships"
        - text: History of unstable, unsupportive and destructive relationships This includes if they are single and have never had a relationship but would like one.
      - button "Save and continue"
    `)
  })

  test('shows domestic violence perpetrator questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-domestic-abuse-perpetrator',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Is there evidence that Test has been a perpetrator of domestic abuse?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Is there evidence that Test has been a perpetrator of domestic abuse?":
        - text: Is there evidence that Test has been a perpetrator of domestic abuse?
        - radio "Yes"
        - text: Yes
        - radio "No"
        - text: No
      - button "Save and continue"
    `)
  })

  test('shows who did they abuse questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
        Step.personal_relationships_domestic_abuse_perpetrator.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-domestic-abuse-against',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Who did Test abuse',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Who did Test abuse?":
        - text: Who did Test abuse?
        - checkbox "Family member"
        - text: Family member
        - checkbox "Intimate partner"
        - text: Intimate partner
        - checkbox "Family member and intimate partner"
        - text: Family member and intimate partner
      - group "Is there evidence of coercive behaviour?":
        - text: Is there evidence of coercive behaviour?
        - radio "Yes"
        - text: Yes
        - radio "No"
        - text: No
      - button "Save and continue"
    `)
  })

  test('shows strangulation questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
        Step.personal_relationships_domestic_abuse_perpetrator.code,
        Step.personal_relationships_domestic_abuse_against.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-strangulation',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Is there evidence of strangulation?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Is there evidence of strangulation?":
        - text: Is there evidence of strangulation?
        - radio "Yes"
        - text: Yes
        - radio "No"
        - text: No
      - button "Save and continue"
    `)
  })

  test('shows domestic abuse victim questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
        Step.personal_relationships_domestic_abuse_perpetrator.code,
        Step.personal_relationships_domestic_abuse_against.code,
        Step.personal_relationships_strangulation.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-domestic-abuse-victim',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Is there evidence that Test has been a victim of domestic abuse?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Is there evidence that Test has been a victim of domestic abuse?":
        - text: Is there evidence that Test has been a victim of domestic abuse?
        - radio "Yes"
        - text: Yes
        - radio "No"
        - text: No
      - button "Save and continue"
    `)
  })

  test('shows who abused them questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
        Step.personal_relationships_domestic_abuse_perpetrator.code,
        Step.personal_relationships_domestic_abuse_against.code,
        Step.personal_relationships_strangulation.code,
        Step.personal_relationships_domestic_abuse_victim.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-domestic-abuse-victim-by',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Who has abused them?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Who has abused them?":
        - text: Who has abused them?
        - checkbox "Family member"
        - text: Family member
        - checkbox "Intimate partner"
        - text: Intimate partner
        - checkbox "Family member and intimate partner"
        - text: Family member and intimate partner
      - button "Save and continue"
    `)
  })

  test('shows changes questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
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
      ])
      .withUserSubmittedSteps([
        Step.personal_relationships_children_information.code,
        Step.personal_relationships_any_parenting_responsibilities.code,
        Step.personal_relationships_community.code,
        Step.personal_relationships_domestic_abuse_perpetrator.code,
        Step.personal_relationships_domestic_abuse_against.code,
        Step.personal_relationships_strangulation.code,
        Step.personal_relationships_domestic_abuse_victim.code,
        Step.personal_relationships_domestic_abuse_victim_by.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-want-to-make-changes',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Does Test want to make changes to their personal relationships and community?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their personal relationships and community?":
        - text: Does Test want to make changes to their personal relationships and community? Test must answer this question.
        - radio "I have already made positive changes and want to maintain them"
        - text: I have already made positive changes and want to maintain them
        - radio "I am actively making changes"
        - text: I am actively making changes
        - radio "I want to make changes and know how to"
        - text: I want to make changes and know how to
        - radio "I want to make changes but need help"
        - text: I want to make changes but need help
        - radio "I am thinking about making changes"
        - text: I am thinking about making changes
        - radio "I do not want to make changes"
        - text: I do not want to make changes
        - radio "I do not want to answer"
        - text: I do not want to answer or
        - radio "Test is not present"
        - text: Test is not present
        - radio "Not applicable"
        - text: Not applicable
      - button "Save and continue"
    `)
  })
})
