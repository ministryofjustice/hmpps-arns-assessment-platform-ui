import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { navigateToStrengthsAndNeeds } from 'specs/strengthsAndNeedsV2/sanUtils'
import { details } from 'testUtils'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary read-only', () => {
  test('shows read-only summary page', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
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

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-analysis')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await expect(accommodationPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: Does Test currently have somewhere to live?
          - definition:
            - paragraph: Yes
          - term: Is Test's accommodation settled?
          - definition:
            - paragraph: "Yes"
          - term: Is the location of Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - term: What are the concerns with the location?
          - definition:
            - paragraph: Close to criminal associates
            - paragraph: Close to someone who has victimised them
            - paragraph: Other
            - paragraph: location concerns other — free text answer.
          - term: Is Test's accommodation suitable?
          - definition:
            - paragraph: "Yes, with concerns"
          - term: What are your concerns about the location of Test's accommodation?
          - definition:
            - paragraph: Issues with the property - for example, poor kitchen or bathroom facilities
            - paragraph: Overcrowding
            - paragraph: Other
            - paragraph: housing concerns other — free text answer.
          - term: Does Test want to make changes to their accommodation?
          - definition:
            - paragraph: I am actively making changes
            - paragraph: actively making changings — free text answer.
      `)
  })

  test('read-only practitioner analysis', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
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
        { question: Question.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
        {
          question: Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details,
          value: details('reoffending risk'),
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

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-analysis')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Practitioner analysis')

    await accommodationPage.practitionerAnalysisTab.click()
    await expect(accommodationPage.practitionerAnalysis).toMatchAriaSnapshot(`
      - tabpanel "Practitioner analysis":
        - term: Are there any strengths or protective factors related to Test's accommodation?
        - definition:
          - paragraph: "Yes"
          - paragraph: accommodation strengths — free text answer.
        - term: Is Test's accommodation linked to risk of serious harm?
        - definition:
          - paragraph: "No"
          - paragraph: no serious harm — free text answer.
        - term: Is Test's accommodation linked to risk of reoffending?
        - definition:
          - paragraph: "Yes"
          - paragraph: reoffending risk — free text answer.
    `)
  })
})
