import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { navigateToStrengthsAndNeeds } from 'specs/strengthsAndNeedsV2/sanUtils'
import { details } from 'testUtils'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
        {
          question: Question.community_suitable_housing_location_concerns,
          value: [Option.criminal_associates, Option.victimisation, CommonOption.other],
        },
        {
          question: Question.community_suitable_housing_location_concerns_other_details,
          value: details('location concerns other'),
        },
        { question: Question.community_suitable_housing, value: Option.yes_with_concerns },
        {
          question: Question.community_suitable_housing_concerns,
          value: [Option.facilities, Option.overcrowding, CommonOption.other],
        },
        {
          question: Question.community_suitable_housing_concerns_other_details,
          value: details('housing concerns other'),
        },
        { question: Question.accommodation_changes, value: CommonOption.making_changes },
        {
          question: Question.accommodation_changes_making_changes_details,
          value: details('actively making changings'),
        },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
        Step.community_suitable_housing.code,
        Step.community_suitable_housing_concerns.code,
        Step.accommodation_changes.code,
        Step.accommodation_summary.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await expect(accommodationPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Does Test currently have somewhere to live?
          - definition:
            - paragraph: Yes
          - definition:
            - link "Change Does Test currently have somewhere to live?":
              - /url: accommodation-community-current-accommodation#community_current_accommodation-question
          - term: Is Test's accommodation settled?
          - definition:
            - paragraph: "Yes"
          - definition:
            - link "Change Is Test's accommodation settled?":
              - /url: accommodation-community-current-accommodation-settled#community_current_accommodation_settled-question
          - term: Is the location of Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Is the location of Test's accommodation suitable?":
              - /url: accommodation-community-suitable-housing-location#community_suitable_housing_location-question
          - term: What are the concerns with the location?
          - definition:
            - paragraph: Close to criminal associates
            - paragraph: Close to someone who has victimised them
            - paragraph: Other
            - paragraph: location concerns other — free text answer.
          - definition:
            - link "Change What are the concerns with the location?":
              - /url: accommodation-community-suitable-housing-location-concerns#community_suitable_housing_location_concerns-question
          - term: Is Test accommodation suitable?
          - definition:
            - paragraph: Yes, with concerns
          - definition:
            - link "Change Is Test accommodation suitable?":
              - /url: accommodation-community-suitable-housing#community_suitable_housing-question
          - term: What are your concerns about the location of Test's accommodation?
          - definition:
            - paragraph: Issues with the property - for example, poor kitchen or bathroom facilities
            - paragraph: Overcrowding
            - paragraph: Other
            - paragraph: housing concerns other — free text answer.
          - definition:
            - link "Change What are your concerns about the location of Test's accommodation?":
              - /url: accommodation-community-suitable-housing-concerns#community_suitable_housing_concerns-question
          - term: Does Test want to make changes to their accommodation?
          - definition:
            - paragraph: I am actively making changes
            - paragraph: actively making changings — free text answer.
          - definition:
            - link "Change Does Test want to make changes to their accommodation?":
              - /url: accommodation-changes#accommodation_changes-question
          - button "Go to practitioner analysis"
      `)
  })

  test('practitioner analysis', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.no },
        { question: Question.community_no_accommodation_reason, value: Option.alcohol_problems },
        { question: Question.accommodation_changes, value: CommonOption.made_changes },
        { question: Question.accommodation_changes_made_changes_details, value: 'Some details' },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_no_accommodation_reason.code,
        Step.accommodation_changes.code,
        Step.accommodation_summary.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await accommodationPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
        {
          question: Question.community_suitable_housing_location_concerns,
          value: [Option.criminal_associates, Option.victimisation, CommonOption.other],
        },
        {
          question: Question.community_suitable_housing_location_concerns_other_details,
          value: details('location concerns other'),
        },
        { question: Question.community_suitable_housing, value: CommonOption.yes },
        { question: Question.accommodation_changes, value: CommonOption.making_changes },
        {
          question: Question.accommodation_changes_making_changes_details,
          value: details('actively making changings'),
        },

        {
          question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.yes,
        },
        {
          question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
          value: details('accommodation strengths'),
        },
        { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        {
          question: Question.accommodation_practitioner_analysis_risk_of_serious_harm_no_details,
          value: details('no serious harm'),
        },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
        Step.community_suitable_housing.code,
        Step.accommodation_changes.code,
        Step.accommodation_summary.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await accommodationPage.goToPractitionerAnalysis.click()
    await accommodationPage.questions.accommodation_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()

    await accommodationPage.markComplete.click()
    await expect(accommodationPage.complete).toBeVisible()
    expect(page.url()).toContain('accommodation-analysis')

    await expect(accommodationPage.practitionerAnalysis).toMatchAriaSnapshot(`
      - tabpanel "Practitioner analysis":
        - term: Are there any strengths or protective factors related to Test's accommodation?
        - definition:
          - paragraph: "Yes"
          - paragraph: accommodation strengths — free text answer.
        - definition:
          - link "Change Are there any strengths or protective factors related to Test's accommodation?":
            - /url: accommodation-summary#accommodation_practitioner_analysis_strengths_or_protective_factors-question
        - term: Is Test's accommodation linked to risk of serious harm?
        - definition:
          - paragraph: "No"
          - paragraph: no serious harm — free text answer.
        - definition:
          - link "Change Is Test's accommodation linked to risk of serious harm?":
            - /url: accommodation-summary#accommodation_practitioner_analysis_risk_of_serious_harm-question
        - term: Is Test's accommodation linked to risk of reoffending?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Is Test's accommodation linked to risk of reoffending?":
            - /url: accommodation-summary#accommodation_practitioner_analysis_risk_of_reoffending-question
    `)
  })
})
