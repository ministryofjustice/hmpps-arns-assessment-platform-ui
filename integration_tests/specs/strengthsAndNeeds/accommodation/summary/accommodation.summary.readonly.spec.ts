import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../sanUtils'

test.describe('Summary read-only', () => {
  test('shows read-only summary page', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      accessMode: 'READ_ONLY',
      planAccessMode: 'READ_WRITE',
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.current_accommodation, value: Option.settled },
        { question: Question.type_of_settled_accommodation, value: Option.homeowner },
        { question: Question.living_with, value: [Option.family] },
        { question: Question.suitable_housing_location, value: CommonOption.no },
        { question: Question.suitable_housing_location_concerns, value: [] },
        { question: Question.suitable_housing, value: CommonOption.no },
        { question: Question.unsuitable_housing_concerns, value: [] },
        { question: Question.accommodation_changes, value: CommonOption.not_present },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-analysis')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await expect(accommodationPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: What type of accommodation does Test currently have?
          - definition:
            - paragraph: Settled
            - paragraph: Homeowner
          - term: Who is Test living with?
          - definition:
            - paragraph: Family
          - term: Is the location of Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - term: Is Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - term: Does Test want to make changes to their accommodation?
          - definition:
            - paragraph: Test is not present
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
        { question: Question.current_accommodation, value: Option.settled },
        { question: Question.type_of_settled_accommodation, value: Option.homeowner },
        { question: Question.living_with, value: [Option.family] },
        { question: Question.suitable_housing_location, value: CommonOption.no },
        { question: Question.suitable_housing_location_concerns, value: [] },
        { question: Question.suitable_housing, value: CommonOption.no },
        { question: Question.unsuitable_housing_concerns, value: [] },
        { question: Question.accommodation_changes, value: CommonOption.not_present },
        {
          question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        {
          question: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_no_details,
          value: '',
        },
        { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.accommodation_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-analysis')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Practitioner analysis')

    await accommodationPage.practitionerAnalysisTab.click()
    await expect(accommodationPage.practitionerAnalysis).toMatchAriaSnapshot(`
      - tabpanel "Practitioner analysis":
        - term: Are there any strengths or protective factors related to Test's accommodation?
        - definition:
          - paragraph: "No"
        - term: Is Test's accommodation linked to risk of serious harm?
        - definition:
          - paragraph: "No"
    `)
  })
})
