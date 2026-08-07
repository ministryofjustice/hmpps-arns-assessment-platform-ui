import { expect } from '@playwright/test'
import PersonalRelationshipsAndCommunityPage from 'pages/strengthsAndNeeds/personalRelationshipsAndCommunityPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Personal relationships and community Page', () => {
  test.describe('Questions', () => {
    test('shows any children', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
      )

      const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
        page,
        'Are there any children',
      )

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.personal))

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
          - group "Are there any children in Test's life?":
            - text: Are there any children in Test's life? This refers to any children (under 18 years) Test has regular contact with, even if they do not have parental responsibility. Select all that apply.
            - checkbox "Yes, children that live with them"
            - text: Yes, children that live with them
            - checkbox "Yes, children that do not live with them"
            - text: Yes, children that do not live with them
            - checkbox "Yes, children that visit them regularly"
            - text: Yes, children that visit them regularly or
            - checkbox "No, there are no children in Test's life"
            - text: No, there are no children in Test's life
          - button "Save and continue"
      `)
    })

    test('shows important people questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        ]).save()

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
        'personal-relationships',
      )

      const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
        page,
        'Who are the important people',
      )

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
        - group "Who are the important people in Test's life?":
          - text: Who are the important people in Test's life? Select all that apply.
          - checkbox "Partner or someone they’re in an intimate relationship with"
          - text: Partner or someone they’re in an intimate relationship with
          - checkbox "Their children or anyone they have parenting responsibilities for"
          - text: Their children or anyone they have parenting responsibilities for
          - checkbox "Other children"
          - text: Other children
          - checkbox "Family members"
          - text: Family members
          - checkbox "Friends"
          - text: Friends
          - checkbox "Other"
          - text: Other
        - button "Save and continue"
      `)
    })

    test('shows community questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
        ]).save()

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
        'personal-relationships-community',
      )

      const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
        page,
        'current relationship status',
      )

      await expect(personalRelationshipsAndCommunityPage.mainForm).toMatchAriaSnapshot(`
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
        - text: Is Test able to resolve any challenges in their intimate relationships? Consider how resilient they are, and how they work with their partner to resolve issues when they arise. An intimate relationship is one that involves physical and/or emotional closeness.
        - textbox "Is Test able to resolve any challenges in their intimate relationships?"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
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

  test.describe('Validation', () => {
    test('validation yes children', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          {
            question: 'personal_relationships_community_children_details',
            value: ['YES_CHILDREN_LIVING_WITH_POP', 'YES_CHILDREN_NOT_LIVING_WITH_POP', 'YES_CHILDREN_VISITING'],
          },
        ]).save()

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
      )

      const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
        page,
        'Are there any children',
      )

      await personalRelationshipsAndCommunityPage.saveAndContinue.click()

      await personalRelationshipsAndCommunityPage.errorChildrenThatLive.click()
      await expect(personalRelationshipsAndCommunityPage.enterDetailsChildrenThatLive).toBeFocused()
      await personalRelationshipsAndCommunityPage.errorChildrenThatDoNotLive.click()
      await expect(personalRelationshipsAndCommunityPage.enterDetailsChildrenThatDoNotLive).toBeFocused()
      await personalRelationshipsAndCommunityPage.errorChildrenThatVisit.click()
      await expect(personalRelationshipsAndCommunityPage.enterDetailsChildrenThatVisit).toBeFocused()
    })

    test('validation other important people', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
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
          { question: 'personal_relationships_community_important_people', value: ['OTHER'] },
        ]).save()

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
        'personal-relationships',
      )

      const personalRelationshipsAndCommunityPage = await PersonalRelationshipsAndCommunityPage.verifyOnPage(
        page,
        'Who are the important people',
      )

      await personalRelationshipsAndCommunityPage.saveAndContinue.click()
      await personalRelationshipsAndCommunityPage.errorEnterDetails.click()

      await expect(personalRelationshipsAndCommunityPage.enterDetails).toBeFocused()
    })
  })

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
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-children-information
          - term: Who are the important people in Test's life?
          - definition:
            - paragraph: Partner or someone they’re in an intimate relationship with
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships
          - term: Is Test happy with their current relationship status?
          - definition:
            - paragraph: Happy and positive about their relationship status or their relationship is likely to act as a protective factor
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: What is Test's history of intimate relationships?
          - definition:
            - paragraph: History of stable, supportive, positive and rewarding relationships
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: Is Test able to resolve any challenges in their intimate relationships?
          - definition:
            - paragraph: test
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: What is Test's current relationship like with their family?
          - definition:
            - paragraph: Stable, supportive, positive and rewarding relationship
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: What was Test's experience of their childhood?
          - definition:
            - paragraph: Positive experience
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: Did Test have any childhood behavioural problems?
          - definition:
            - paragraph: "Yes"
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
          - term: Does Test want to make changes to their personal relationships and community?
          - definition:
            - paragraph: Test is not present
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
            - paragraph
          - definition:
            - link "Change":
              - /url: personal-relationships-community
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
            question:
              'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details',
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

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await PersonalRelationshipsAndCommunityPage.navigateToPersonalRelationshipsAndCommunity(
        page,
        handoverLink,
        baseURL,
      )
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
