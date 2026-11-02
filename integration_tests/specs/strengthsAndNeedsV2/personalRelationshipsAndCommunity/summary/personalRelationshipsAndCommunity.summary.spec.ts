import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeedsV2/personalRelationshipsAndCommunityPage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        { question: Question.personal_relationships_community_changes, value: CommonOption.made_changes },
        { question: Question.personal_relationships_community_changes_made_changes_details, value: 'Some details' },
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
        Step.personal_relationships_want_to_make_changes.code,
        Step.personal_relationships_community_summary.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-community-summary',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Summary',
    )

    await expect(personalRelationshipsAndCommunityPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Are there any children in Test's life?
        - definition:
          - paragraph: Yes, children that live with them
          - paragraph: test
        - definition:
          - link "Change Are there any children in Test's life?":
            - /url: personal-relationships-children-information#personal_relationships_community_children_details-question
        - term: Does Test have any parenting responsibilities?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Does Test have any parenting responsibilities?":
            - /url: personal-relationships-any-parenting-responsibilities#personal_relationships_community_any_parenting_responsibilities-question
        - term: Is Test able to manage their parenting responsibilities?
        - definition:
          - paragraph: Yes, manages parenting responsibilities well
          - paragraph: test
        - definition:
          - link "Change Is Test able to manage their parenting responsibilities?":
            - /url: personal-relationships-community#personal_relationships_community_parental_responsibilities-question
        - term: What is Test's current relationship like with their family?
        - definition:
          - paragraph: Stable, supportive, positive and rewarding relationship
          - paragraph: test
        - definition:
          - link "Change What is Test's current relationship like with their family?":
            - /url: personal-relationships-community#personal_relationships_community_family_relationship-question
        - term: What was Test's experience of their childhood?
        - definition:
          - paragraph: Positive experience
          - paragraph: test
        - definition:
          - link "Change What was Test's experience of their childhood?":
            - /url: personal-relationships-community#personal_relationships_community_childhood-question
        - term: Did Test have any childhood behavioural problems?
        - definition:
          - paragraph: "Yes"
          - paragraph: test
        - definition:
          - link "Change Did Test have any childhood behavioural problems?":
            - /url: personal-relationships-community#personal_relationships_community_childhood_behaviour-question
        - term: Is Test part of any groups or communities that gives them a sense of belonging? (optional)
        - definition:
          - paragraph: test
        - definition:
          - link "Change Is Test part of any groups or communities that gives them a sense of belonging? (optional)":
            - /url: personal-relationships-community#personal_relationships_community_belonging-question
        - term: Is Test in a relationship?
        - definition:
          - paragraph: In a relationship, living together
        - definition:
          - link "Change Is Test in a relationship?":
            - /url: personal-relationships-community#personal_relationships_community_in_relationship-question
        - term: Is Test happy with their current relationship status?
        - definition:
          - paragraph: Happy and positive about their relationship status or their relationship is likely to act as a protective factor
          - paragraph: test
        - definition:
          - link "Change Is Test happy with their current relationship status?":
            - /url: personal-relationships-community#personal_relationships_community_current_relationship-question
        - term: What is Test's history of intimate relationships?
        - definition:
          - paragraph: History of stable, supportive, positive and rewarding relationships
          - paragraph: test
        - definition:
          - link "Change What is Test's history of intimate relationships?":
            - /url: personal-relationships-community#personal_relationships_community_intimate_relationship-question
        - term: Is there evidence that Test has been a perpetrator of domestic abuse?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Is there evidence that Test has been a perpetrator of domestic abuse?":
            - /url: personal-relationships-domestic-abuse-perpetrator#personal_relationships_community_domestic_abuse_perpetrator-question
        - term: Who did Test abuse?
        - definition:
          - paragraph: Intimate partner
          - paragraph: test
        - definition:
          - link "Change Who did Test abuse?":
            - /url: personal-relationships-domestic-abuse-against#personal_relationships_community_domestic_abuse_against-question
        - term: Is there evidence of coercive behaviour?
        - definition:
          - paragraph: "Yes"
          - paragraph: test
        - definition:
          - link "Change Is there evidence of coercive behaviour?":
            - /url: personal-relationships-domestic-abuse-against#personal_relationships_community_coercive_behaviour-question
        - term: Is there evidence of strangulation?
        - definition:
          - paragraph: "Yes"
          - paragraph: test

        - definition:
          - link "Change Is there evidence of strangulation?":
            - /url: personal-relationships-strangulation#personal_relationships_community_strangulation-question
        - term: Is there evidence that Test has been a victim of domestic abuse?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change Is there evidence that Test has been a victim of domestic abuse?":
            - /url: personal-relationships-domestic-abuse-victim#personal_relationships_community_domestic_abuse_victim-question
        - term: Who has abused them?
        - definition:
          - paragraph: Intimate partner
          - paragraph: test
        - definition:
          - link "Change Who has abused them?":
            - /url: personal-relationships-domestic-abuse-victim-by#personal_relationships_community_domestic_abuse_victim_by-question
        - term: Does Test want to make changes to their personal relationships and community?
        - definition:
          - paragraph: I have already made positive changes and want to maintain them
          - paragraph: Some details
        - definition:
          - link "Change Does Test want to make changes to their personal relationships and community?":
            - /url: personal-relationships-want-to-make-changes#personal_relationships_community_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      subject: { gender: '1' },
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
        { question: Question.personal_relationships_community_changes, value: CommonOption.made_changes },
        { question: Question.personal_relationships_community_changes_made_changes_details, value: 'Some details' },
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
        Step.personal_relationships_want_to_make_changes.code,
        Step.personal_relationships_community_summary.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-community-summary',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Summary',
    )

    await personalRelationshipsAndCommunityPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
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
        { question: Question.personal_relationships_community_changes, value: CommonOption.made_changes },
        { question: Question.personal_relationships_community_changes_made_changes_details, value: 'Some details' },
        {
          question: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        {
          question:
            Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details,
          value: '',
        },
        {
          question: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
          value: CommonOption.no,
        },
        {
          question: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details,
          value: '',
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
        Step.personal_relationships_want_to_make_changes.code,
        Step.personal_relationships_community_summary.code,
      ])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships-community-summary#practitioner-analysis',
    )
    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'strengths or protective factors',
    )

    await personalRelationshipsAndCommunityPage.questions.personal_relationships_community_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await personalRelationshipsAndCommunityPage.markComplete.click()
    await expect(personalRelationshipsAndCommunityPage.complete).toBeVisible()
    expect(page.url()).toContain('personal-relationships-community-analysis')
  })
})
