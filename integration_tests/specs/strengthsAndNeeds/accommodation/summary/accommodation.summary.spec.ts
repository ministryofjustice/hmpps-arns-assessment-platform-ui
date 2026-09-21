import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../../sanUtils'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'current_accommodation', value: 'SETTLED' },
        { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
        { question: 'living_with', value: ['FAMILY'] },
        { question: 'suitable_housing_location', value: 'NO' },
        { question: 'suitable_housing_location_concerns', value: [] },
        { question: 'suitable_housing', value: 'NO' },
        { question: 'unsuitable_housing_concerns', value: [] },
        { question: 'accommodation_changes', value: 'NOT_PRESENT' },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await expect(accommodationPage.summary).toMatchAriaSnapshot(`
        - tabpanel "Summary":
          - term: What type of accommodation does Test currently have?
          - definition:
            - paragraph: Settled
            - paragraph: Homeowner
          - definition:
            - link "Change What type of accommodation does Test currently have?":
              - /url: current-accommodation#current_accommodation-question
          - term: Who is Test living with?
          - definition:
            - paragraph: Family
          - definition:
            - link "Change Who is Test living with?":
              - /url: accommodation-details#living_with-question
          - term: Is the location of Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Is the location of Test's accommodation suitable?":
              - /url: accommodation-details#suitable_housing_location-question
          - term: Is Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change Is Test's accommodation suitable?":
              - /url: accommodation-details#suitable_housing-question
          - term: Does Test want to make changes to their accommodation?
          - definition:
            - paragraph: Test is not present
          - definition:
            - link "Change Does Test want to make changes to their accommodation?":
              - /url: accommodation-details#accommodation_changes-question
          - button "Go to practitioner analysis"
      `)
  })

  test('practitioner analysis', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'current_accommodation', value: 'SETTLED' },
        { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
        { question: 'living_with', value: ['FAMILY'] },
        { question: 'suitable_housing_location', value: 'NO' },
        { question: 'suitable_housing_location_concerns', value: [] },
        { question: 'suitable_housing', value: 'NO' },
        { question: 'unsuitable_housing_concerns', value: [] },
        { question: 'accommodation_changes', value: 'NOT_PRESENT' },
      ]).save()

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
      .extend(sanAssessmentId)
      .withAnswers([
        { question: 'current_accommodation', value: 'SETTLED' },
        { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
        { question: 'living_with', value: ['FAMILY'] },
        { question: 'suitable_housing_location', value: 'NO' },
        { question: 'suitable_housing_location_concerns', value: [] },
        { question: 'suitable_housing', value: 'NO' },
        { question: 'unsuitable_housing_concerns', value: [] },
        { question: 'accommodation_changes', value: 'NOT_PRESENT' },
        { question: 'accommodation_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        { question: 'accommodation_practitioner_analysis_strengths_or_protective_factors_details', value: '' },
        { question: 'accommodation_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'accommodation_practitioner_analysis_risk_of_serious_harm_details', value: '' },
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')

    await accommodationPage.goToPractitionerAnalysis.click()
    await accommodationPage.questions.accommodation_practitioner_analysis_risk_of_reoffending.option('No')
      .click()
    await accommodationPage.markComplete.click()
    await expect(accommodationPage.complete).toBeVisible()
    expect(page.url()).toContain('accommodation-analysis')
  })
})
