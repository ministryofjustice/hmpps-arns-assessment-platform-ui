import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeedsV2/personalRelationshipsAndCommunityPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation yes children', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        {
          question: Question.personal_relationships_community_children_details,
          value: [Option.yes_children_living_with_pop, Option.yes_children_not_living_with_pop],
        },
      ])
      .withUserSubmittedSteps([])
      .save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Are there any children',
    )

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()
    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Enter details of any children that live with them":
              - /url: "#personal_relationships_community_children_details_yes_children_living_with_pop_details"
          - listitem:
            - link "Enter details of any children that do not live with them":
              - /url: "#personal_relationships_community_children_details_yes_children_not_living_with_pop_details"
    `)

    await questions.personal_relationships_community_children_details_yes_children_living_with_pop_details.errorLink.click()
    await expect(
      questions.personal_relationships_community_children_details_yes_children_living_with_pop_details.input,
    ).toBeFocused()
    await questions.personal_relationships_community_children_details_yes_children_not_living_with_pop_details.errorLink.click()
    await expect(
      questions.personal_relationships_community_children_details_yes_children_not_living_with_pop_details.input,
    ).toBeFocused()
  })

  test('validation any parenting responsibilities questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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
      'any parenting responsibilities?',
    )

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they have parent responsibilities":
              - /url: "#personal_relationships_community_any_parenting_responsibilities"
    `)

    await questions.personal_relationships_community_any_parenting_responsibilities.errorLink.click()
    await expect(questions.personal_relationships_community_any_parenting_responsibilities.input).toBeFocused()
  })

  test('validation personal relationships community questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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
      'current relationship status',
    )

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they’re able to manage their parenting responsibilities":
              - /url: "#personal_relationships_community_parental_responsibilities"
          - listitem:
            - link "Select what their current relationship is like with their family":
              - /url: "#personal_relationships_community_family_relationship"
          - listitem:
            - link "Select their experience of childhood":
              - /url: "#personal_relationships_community_childhood"
          - listitem:
            - link "Select if they had childhood behavioural problems":
              - /url: "#personal_relationships_community_childhood_behaviour"
          - listitem:
            - link "Select if they are in a relationship":
              - /url: "#personal_relationships_community_in_relationship"
          - listitem:
            - link "Select if they are happy with their current relationship status":
              - /url: "#personal_relationships_community_current_relationship"
          - listitem:
            - link "Select their history of intimate relationships":
              - /url: "#personal_relationships_community_intimate_relationship"
    `)

    await questions.personal_relationships_community_parental_responsibilities.errorLink.click()
    await expect(questions.personal_relationships_community_parental_responsibilities.input).toBeFocused()
    await questions.personal_relationships_community_family_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_family_relationship.input).toBeFocused()
    await questions.personal_relationships_community_childhood.errorLink.click()
    await expect(questions.personal_relationships_community_childhood.input).toBeFocused()
    await questions.personal_relationships_community_childhood_behaviour.errorLink.click()
    await expect(questions.personal_relationships_community_childhood_behaviour.input).toBeFocused()
    await questions.personal_relationships_community_in_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_in_relationship.input).toBeFocused()
    await questions.personal_relationships_community_current_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_current_relationship.input).toBeFocused()
    await questions.personal_relationships_community_intimate_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_intimate_relationship.input).toBeFocused()
  })

  test('validation domestic violent perpetrator questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence they have been a perpetrator of domestic abuse":
              - /url: "#personal_relationships_community_domestic_abuse_perpetrator"
    `)

    await questions.personal_relationships_community_domestic_abuse_perpetrator.errorLink.click()
    await expect(questions.personal_relationships_community_domestic_abuse_perpetrator.input).toBeFocused()
  })

  test('validation domestic violent against questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select at least one option":
              - /url: "#personal_relationships_community_domestic_abuse_against"
          - listitem:
            - link "Select if there is evidence of coercive behaviour":
              - /url: "#personal_relationships_community_coercive_behaviour"
    `)

    await questions.personal_relationships_community_domestic_abuse_against.errorLink.click()
    await expect(questions.personal_relationships_community_domestic_abuse_against.input).toBeFocused()
    await questions.personal_relationships_community_coercive_behaviour.errorLink.click()
    await expect(questions.personal_relationships_community_coercive_behaviour.input).toBeFocused()
  })

  test('validation strangulation questions', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence of strangulation":
              - /url: "#personal_relationships_community_strangulation"
    `)

    await questions.personal_relationships_community_strangulation.errorLink.click()
    await expect(questions.personal_relationships_community_strangulation.input).toBeFocused()
  })

  test('validation domestic abuse victim questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence they have been a victim of domestic abuse":
              - /url: "#personal_relationships_community_domestic_abuse_victim"
    `)

    await questions.personal_relationships_community_domestic_abuse_victim.errorLink.click()
    await expect(questions.personal_relationships_community_domestic_abuse_victim.input).toBeFocused()
  })

  test('validation domestic abuse victim by questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select at least one option":
              - /url: "#personal_relationships_community_domestic_abuse_victim_by"
    `)

    await questions.personal_relationships_community_domestic_abuse_victim_by.errorLink.click()
    await expect(questions.personal_relationships_community_domestic_abuse_victim_by.input).toBeFocused()
  })

  test('validation want to make changes questions', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they want to make changes to their personal relationships and community":
              - /url: "#personal_relationships_community_changes"
    `)

    await questions.personal_relationships_community_changes.errorLink.click()
    await expect(questions.personal_relationships_community_changes.input).toBeFocused()
  })
})
