import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeeds/personalRelationshipsAndCommunityPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'personal_relationships_community_children_details', value: ['YES_CHILDREN_LIVING_WITH_POP'] },
        {
          question: 'personal_relationships_community_children_details_yes_children_living_with_pop_details',
          value: 'test',
        },
        { question: 'personal_relationships_community_important_people', value: ['PARTNER_INTIMATE_RELATIONSHIP'] },
        {
          question: 'personal_relationships_community_important_people_partner_intimate_relationship_details',
          value: '',
        },
        { question: 'personal_relationships_community_changes', value: 'NOT_PRESENT' },
        { question: 'personal_relationships_community_belonging', value: '' },
        { question: 'personal_relationships_community_childhood', value: 'POSITIVE_CHILDHOOD' },
        { question: 'personal_relationships_community_childhood_behaviour', value: 'YES' },
        { question: 'personal_relationships_community_family_relationship', value: 'STABLE_RELATIONSHIP' },
        { question: 'personal_relationships_community_current_relationship', value: 'HAPPY_RELATIONSHIP' },
        { question: 'personal_relationships_community_intimate_relationship', value: 'STABLE_RELATIONSHIPS' },
        { question: 'personal_relationships_community_childhood_behaviour_yes_details', value: '' },
        { question: 'personal_relationships_community_challenges_intimate_relationship', value: 'test' },
        { question: 'personal_relationships_community_childhood_positive_childhood_details', value: '' },
        { question: 'personal_relationships_community_current_relationship_happy_relationship_details', value: '' },
        { question: 'personal_relationships_community_family_relationship_stable_relationship_details', value: '' },
        {
          question: 'personal_relationships_community_intimate_relationship_stable_relationships_details',
          value: '',
        },
      ]).save()

    await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
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
          - link "Change":
            - /url: personal-relationships-children-information#personal_relationships_community_children_details
        - term: Who are the important people in Test's life?
        - definition:
          - paragraph: Partner or someone they’re in an intimate relationship with
        - definition:
          - link "Change":
            - /url: personal-relationships#personal_relationships_community_important_people
        - term: Is Test happy with their current relationship status?
        - definition:
          - paragraph: Happy and positive about their relationship status or their relationship is likely to act as a protective factor
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_current_relationship
        - term: What is Test's history of intimate relationships?
        - definition:
          - paragraph: History of stable, supportive, positive and rewarding relationships
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_intimate_relationship
        - term: Is Test able to resolve any challenges in their intimate relationships?
        - definition:
          - paragraph: test
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_challenges_intimate_relationship
        - term: What is Test's current relationship like with their family?
        - definition:
          - paragraph: Stable, supportive, positive and rewarding relationship
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_family_relationship
        - term: What was Test's experience of their childhood?
        - definition:
          - paragraph: Positive experience
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_childhood
        - term: Did Test have any childhood behavioural problems?
        - definition:
          - paragraph: "Yes"
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_childhood_behaviour
        - term: Does Test want to make changes to their personal relationships and community?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change":
            - /url: personal-relationships-community#personal_relationships_community_changes
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
        { question: 'personal_relationships_community_children_details', value: ['YES_CHILDREN_LIVING_WITH_POP'] },
        {
          question: 'personal_relationships_community_children_details_yes_children_living_with_pop_details',
          value: 'test',
        },
        { question: 'personal_relationships_community_important_people', value: ['PARTNER_INTIMATE_RELATIONSHIP'] },
        {
          question: 'personal_relationships_community_important_people_partner_intimate_relationship_details',
          value: '',
        },
        { question: 'personal_relationships_community_changes', value: 'NOT_PRESENT' },
        { question: 'personal_relationships_community_belonging', value: '' },
        { question: 'personal_relationships_community_childhood', value: 'POSITIVE_CHILDHOOD' },
        { question: 'personal_relationships_community_childhood_behaviour', value: 'YES' },
        { question: 'personal_relationships_community_family_relationship', value: 'STABLE_RELATIONSHIP' },
        { question: 'personal_relationships_community_current_relationship', value: 'HAPPY_RELATIONSHIP' },
        { question: 'personal_relationships_community_intimate_relationship', value: 'STABLE_RELATIONSHIPS' },
        { question: 'personal_relationships_community_childhood_behaviour_yes_details', value: '' },
        { question: 'personal_relationships_community_challenges_intimate_relationship', value: 'test' },
        { question: 'personal_relationships_community_childhood_positive_childhood_details', value: '' },
        { question: 'personal_relationships_community_current_relationship_happy_relationship_details', value: '' },
        { question: 'personal_relationships_community_family_relationship_stable_relationship_details', value: '' },
        {
          question: 'personal_relationships_community_intimate_relationship_stable_relationships_details',
          value: '',
        },
      ]).save()

    await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
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
        { question: 'personal_relationships_community_children_details', value: ['YES_CHILDREN_LIVING_WITH_POP'] },
        {
          question: 'personal_relationships_community_children_details_yes_children_living_with_pop_details',
          value: 'test',
        },
        { question: 'personal_relationships_community_important_people', value: ['PARTNER_INTIMATE_RELATIONSHIP'] },
        {
          question: 'personal_relationships_community_important_people_partner_intimate_relationship_details',
          value: '',
        },
        { question: 'personal_relationships_community_changes', value: 'NOT_PRESENT' },
        { question: 'personal_relationships_community_belonging', value: '' },
        { question: 'personal_relationships_community_childhood', value: 'POSITIVE_CHILDHOOD' },
        { question: 'personal_relationships_community_childhood_behaviour', value: 'YES' },
        { question: 'personal_relationships_community_family_relationship', value: 'STABLE_RELATIONSHIP' },
        { question: 'personal_relationships_community_current_relationship', value: 'HAPPY_RELATIONSHIP' },
        { question: 'personal_relationships_community_intimate_relationship', value: 'STABLE_RELATIONSHIPS' },
        { question: 'personal_relationships_community_childhood_behaviour_yes_details', value: '' },
        { question: 'personal_relationships_community_challenges_intimate_relationship', value: 'test' },
        { question: 'personal_relationships_community_childhood_positive_childhood_details', value: '' },
        { question: 'personal_relationships_community_current_relationship_happy_relationship_details', value: '' },
        { question: 'personal_relationships_community_family_relationship_stable_relationship_details', value: '' },
        {
          question: 'personal_relationships_community_intimate_relationship_stable_relationships_details',
          value: '',
        },
        {
          question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors',
          value: 'NO',
        },
        {
          question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details',
          value: '',
        },
        { question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        {
          question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details',
          value: '',
        },
      ]).save()

    await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
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

    await personalRelationshipsAndCommunityPage.linkedToRiskOfReoffending.click()
    await personalRelationshipsAndCommunityPage.markComplete.click()
    await expect(personalRelationshipsAndCommunityPage.complete).toBeVisible()
    expect(page.url()).toContain('personal-relationships-community-analysis')
  })
})
