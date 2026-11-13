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
          - checkbox "Yes, children they have regular contact with"
          - text: Yes, children they have regular contact with or
          - checkbox "No"
          - text: No
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
      Step.personal_relationships_any_parenting_responsibilities.path,
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
          question: Question.community_personal_relationships_community_parental_responsibilities,
          value: CommonOption.yes,
        },
        {
          question: Question.community_personal_relationships_community_parental_responsibilities_yes_details,
          value: 'test',
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
      Step.personal_relationships_community.path,
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
        - radio "Generally stable and supportive"
        - text: Generally stable and supportive No significant concerns identified about care, safety or family relationships.
        - radio "Some challenges or instability"
        - text: Some challenges or instability Less severe or temporary challenges, disruption or concerns.
        - radio "Significant challenges or instability"
        - text: Significant challenges or instability Serious or longer-term experiences such as prolonged separation from parents or carers, inconsistent care, neglect or abuse. A single serious experience may also be significant.
        - radio "Unknown"
        - text: Unknown
      - group "Is there evidence Test had any childhood behavioural issues or challenges?":
        - text: Is there evidence Test had any childhood behavioural issues or challenges? Consider any experiences, trauma or neurodivergent needs that may have influenced behaviour during childhood
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Are there any people, groups or communities that give Test a sense of belonging?":
        - text: Are there any people, groups or communities that give Test a sense of belonging? Consider positive and negative influences. This could include relationships with friends, neighbours, online communities, social groups, faith groups, extremist groups and gangs.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Does Test currently have a partner?":
        - text: Does Test currently have a partner?
        - radio "Yes, living together"
        - text: Yes, living together
        - radio "Yes, not living together"
        - text: Yes, not living together
        - radio "No"
        - text: No
      - group "How would you describe Test current relationship situation?":
        - text: How would you describe Test current relationship situation?
        - radio "Positive and supportive"
        - text: Positive and supportive Their current relationship is positive and supportive, or they are content being single.
        - radio "Has some difficulties but remains supportive"
        - text: Has some difficulties but remains supportive There are some difficulties or concerns, but there remains some support, stability or contentment with the current situation.
        - radio "Difficult or unhealthy"
        - text: Difficult or unhealthy Their current relationship is causing significant difficulties, is unhealthy, linked to offending, or they are preoccupied with being single.
      - group "How would you describe Test's history of intimate relationships?":
        - text: How would you describe Test's history of intimate relationships? An intimate relationship is one that involves physical and/or emotional closeness.
        - radio "Stable, supportive and rewarding"
        - text: Stable, supportive and rewarding This includes having no history of intimate relationships, but they appear capable of starting and maintaining a heathy one.
        - radio "Both healthy and unhealthy relationships"
        - text: Both healthy and unhealthy relationships
        - radio "Unstable, unsupportive and destructive"
        - text: Unstable, unsupportive and destructive Includes having no history of relationships and there are concerns about their ability to start or maintain one.
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
      Step.personal_relationships_domestic_abuse_perpetrator.path,
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
      Step.personal_relationships_domestic_abuse_against.path,
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Who did Test abuse',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Who did Test abuse?":
        - text: Who did Test abuse? Select all that apply.
        - checkbox "Family member"
        - text: Family member
        - checkbox "Intimate partner"
        - text: Intimate partner
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
      Step.personal_relationships_strangulation.path,
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
      Step.personal_relationships_domestic_abuse_victim.path,
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
      Step.personal_relationships_domestic_abuse_victim_by.path,
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Who has abused them?',
    )

    await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
      - group "Who has abused them?":
        - text: Who has abused them? Select all that apply.
        - checkbox "Family member"
        - text: Family member
        - checkbox "Intimate partner"
        - text: Intimate partner
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
      Step.personal_relationships_want_to_make_changes.path,
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
