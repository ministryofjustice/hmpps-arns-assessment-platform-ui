import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/question'
import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeeds/personalRelationshipsAndCommunityPage'
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
          value: [
            Option.yes_children_living_with_pop,
            Option.yes_children_not_living_with_pop,
            Option.yes_children_visiting,
          ],
        },
      ]).save()

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
          - listitem:
            - link "Enter details of any children that visit them regularly":
              - /url: "#personal_relationships_community_children_details_yes_children_visiting_details"
    `)

    await questions.personal_relationships_community_children_details_yes_children_living_with_pop_details.errorLink.click()
    await expect(
      questions.personal_relationships_community_children_details_yes_children_living_with_pop_details.input,
    ).toBeFocused()
    await questions.personal_relationships_community_children_details_yes_children_not_living_with_pop_details.errorLink.click()
    await expect(
      questions.personal_relationships_community_children_details_yes_children_not_living_with_pop_details.input,
    ).toBeFocused()
    await questions.personal_relationships_community_children_details_yes_children_visiting_details.errorLink.click()
    await expect(
      questions.personal_relationships_community_children_details_yes_children_visiting_details.input,
    ).toBeFocused()
  })

  test('validation other important people', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        { question: Question.personal_relationships_community_important_people, value: [CommonOption.other] },
      ]).save()

    await PersonalRelationshipsAndCommunityPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'personal-relationships',
    )

    const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
      page,
      'Who are the important people',
    )

    const { questions } = personalRelationshipsAndCommunityPage

    await personalRelationshipsAndCommunityPage.saveAndContinue.click()
    await expect(personalRelationshipsAndCommunityPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Enter details":
              - /url: "#personal_relationships_community_important_people_other_details"
    `)

    await questions.personal_relationships_community_important_people_other_details.errorLink.click()
    await expect(questions.personal_relationships_community_important_people_other_details.input).toBeFocused()
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
          question: Question.personal_relationships_community_important_people,
          value: [Option.partner_intimate_relationship],
        },
        {
          question: Question.personal_relationships_community_important_people_partner_intimate_relationship_details,
          value: '',
        },
      ]).save()

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
          - /children: equal
          - listitem:
            - link "Select if they are happy with their current relationship status":
              - /url: "#personal_relationships_community_current_relationship"
          - listitem:
            - link "Select their history of intimate relationships":
              - /url: "#personal_relationships_community_intimate_relationship"
          - listitem:
            - link "Enter details":
              - /url: "#personal_relationships_community_challenges_intimate_relationship"
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
            - link "Select if they want to make changes to their personal relationships and community":
              - /url: "#personal_relationships_community_changes"
    `)

    await questions.personal_relationships_community_current_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_current_relationship.input).toBeFocused()
    await questions.personal_relationships_community_intimate_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_intimate_relationship.input).toBeFocused()
    await questions.personal_relationships_community_challenges_intimate_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_challenges_intimate_relationship.input).toBeFocused()
    await questions.personal_relationships_community_family_relationship.errorLink.click()
    await expect(questions.personal_relationships_community_family_relationship.input).toBeFocused()
    await questions.personal_relationships_community_childhood.errorLink.click()
    await expect(questions.personal_relationships_community_childhood.input).toBeFocused()
    await questions.personal_relationships_community_childhood_behaviour.errorLink.click()
    await expect(questions.personal_relationships_community_childhood_behaviour.input).toBeFocused()
    await questions.personal_relationships_community_changes.errorLink.click()
    await expect(questions.personal_relationships_community_changes.input).toBeFocused()
  })
})
