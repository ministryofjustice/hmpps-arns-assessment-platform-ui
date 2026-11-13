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
      Step.personal_relationships_any_parenting_responsibilities.path,
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
            - link "Select if they have parenting responsibilities":
              - /url: "#community_personal_relationships_community_parental_responsibilities"
    `)

    await questions.community_personal_relationships_community_parental_responsibilities.errorLink.click()
    await expect(questions.community_personal_relationships_community_parental_responsibilities.input).toBeFocused()
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
      'Is Test able to manage their parenting responsibilities?\n',
    )

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if they’re able to manage their parenting responsibilities":
              - /url: "#community_personal_relationships_community_manage_parental_responsibilities"
          - listitem:
            - link "Select what their current relationship is like with their family":
              - /url: "#personal_relationships_community_family_relationship"
          - listitem:
            - link "Select their experience of childhood":
              - /url: "#personal_relationships_community_childhood"
          - listitem:
            - link "Select if they had childhood behavioural issues or challenges":
              - /url: "#personal_relationships_community_childhood_behaviour"
          - listitem:
            - link "Select if there are any people, groups or communities that give them a sense of belonging":
              - /url: "#personal_relationships_community_sense_of_belonging"
          - listitem:
            - link "Select if they have a partner":
              - /url: "#personal_relationships_community_relationship_status"
          - listitem:
            - link "Select how you would describe their current relationship situation":
              - /url: "#personal_relationships_community_current_relationship"
          - listitem:
            - link "Select how you would describe their history of intimate relationships":
              - /url: "#personal_relationships_community_intimate_relationship"
    `)

    await questions.community_personal_relationships_community_manage_parental_responsibilities.errorLink.click()
    await expect(
      questions.community_personal_relationships_community_manage_parental_responsibilities.input,
    ).toBeFocused()
    await questions.personal_relationships_community_family_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_family_relationship.input).toBeFocused()
    await questions.personal_relationships_community_childhood.errorLink.click()
    await expect(questions.personal_relationships_community_childhood.input).toBeFocused()
    await questions.personal_relationships_community_childhood_behaviour.errorLink.click()
    await expect(questions.personal_relationships_community_childhood_behaviour.input).toBeFocused()
    await questions.personal_relationships_community_sense_of_belonging.errorLink.click()
    await expect(questions.personal_relationships_community_sense_of_belonging.input).toBeFocused()
    await questions.personal_relationships_community_relationship_status.errorLink.click()
    await expect(questions.personal_relationships_community_relationship_status.input).toBeFocused()
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence they have been a perpetrator of domestic abuse":
              - /url: "#offence_analysis_perpetrator_of_domestic_abuse"
    `)

    await questions.offence_analysis_perpetrator_of_domestic_abuse.errorLink.click()
    await expect(questions.offence_analysis_perpetrator_of_domestic_abuse.input).toBeFocused()
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select at least one option":
              - /url: "#offence_analysis_perpetrator_of_domestic_abuse_victim"
          - listitem:
            - link "Select if there is evidence of coercive behaviour":
              - /url: "#controlling_coercive_behaviour"
    `)

    await questions.offence_analysis_perpetrator_of_domestic_abuse_victim.errorLink.click()
    await expect(questions.offence_analysis_perpetrator_of_domestic_abuse_victim.input).toBeFocused()
    await questions.controlling_coercive_behaviour.errorLink.click()
    await expect(questions.controlling_coercive_behaviour.input).toBeFocused()
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence of strangulation":
              - /url: "#evidence_of_strangulation"
    `)

    await questions.evidence_of_strangulation.errorLink.click()
    await expect(questions.evidence_of_strangulation.input).toBeFocused()
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select if there is evidence they have been a victim of domestic abuse":
              - /url: "#offence_analysis_victim_of_domestic_abuse"
    `)

    await questions.offence_analysis_victim_of_domestic_abuse.errorLink.click()
    await expect(questions.offence_analysis_victim_of_domestic_abuse.input).toBeFocused()
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

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()

    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Select at least one option":
              - /url: "#offence_analysis_victim_of_domestic_abuse_who_committed_abuse"
    `)

    await questions.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.errorLink.click()
    await expect(questions.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.input).toBeFocused()
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
