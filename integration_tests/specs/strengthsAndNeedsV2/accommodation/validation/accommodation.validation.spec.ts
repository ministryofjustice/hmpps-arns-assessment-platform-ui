import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { navigateToStrengthsAndNeeds } from 'specs/strengthsAndNeedsV2/sanUtils'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation community_current_accommodation', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Does Test currently have somewhere to live?')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select the type of accommodation they currently have":
                - /url: "#community_current_accommodation"
      `)
    await questions.community_current_accommodation.errorLink.click()
    await expect(questions.community_current_accommodation.input).toBeFocused()
  })

  test('validation community_current_accommodation_settled', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_current_accommodation, value: CommonOption.yes }])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_current_accommodation_settled.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, "Is Test's accommodation settled?")
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if the accommodation is settled":
                - /url: "#community_current_accommodation_settled"
      `)

    await questions.community_current_accommodation_settled.errorLink.click()
    await expect(questions.community_current_accommodation_settled.input).toBeFocused()
  })
  test('validation community_suitable_housing_location', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_location.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      "Is the location of Test's accommodation suitable?",
    )
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if the location of the accommodation is suitable":
                - /url: "#community_suitable_housing_location"
      `)

    await questions.community_suitable_housing_location.errorLink.click()
    await expect(questions.community_suitable_housing_location.input).toBeFocused()
  })
  test('validation community_suitable_housing_location_concerns', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.no },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_location_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What are the concerns with the location?')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if there are concerns with the location":
                - /url: "#community_suitable_housing_location_concerns"
      `)

    await questions.community_suitable_housing_location_concerns.errorLink.click()
    await expect(questions.community_suitable_housing_location_concerns.input).toBeFocused()

    // Check community_suitable_housing_location_concerns_other_details
    await questions.community_suitable_housing_location_concerns.option(CommonOption.other).check()
    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Enter details":
                - /url: "#community_suitable_housing_location_concerns_other_details"
      `)
    await questions.community_suitable_housing_location_concerns_other_details.errorLink.click()
    await expect(questions.community_suitable_housing_location_concerns_other_details.input).toBeFocused()
  })
  test('validation community_suitable_housing_concerns', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.no },
        { question: Question.community_suitable_housing_location, value: CommonOption.yes },
        { question: Question.community_suitable_housing, value: Option.yes_with_concerns },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      "What are your concerns about the location of Test's accommodation?",
    )
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if there are concerns with the accommodation":
                - /url: "#community_suitable_housing_concerns"
      `)

    await questions.community_suitable_housing_concerns.errorLink.click()
    await expect(questions.community_suitable_housing_concerns.input).toBeFocused()

    // Check community_suitable_housing_concerns_other_details
    await questions.community_suitable_housing_concerns.option(CommonOption.other).check()
    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Enter details":
                - /url: "#community_suitable_housing_concerns_other_details"
      `)
    await questions.community_suitable_housing_concerns_other_details.errorLink.click()
    await expect(questions.community_suitable_housing_concerns_other_details.input).toBeFocused()
  })
  test('validation community_unsuitable_housing_concerns', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.no },
        { question: Question.community_suitable_housing_location, value: CommonOption.yes },
        { question: Question.community_suitable_housing, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What are the concerns?')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if there are concerns with the accommodation":
                - /url: "#community_unsuitable_housing_concerns"
      `)

    await questions.community_unsuitable_housing_concerns.errorLink.click()
    await expect(questions.community_unsuitable_housing_concerns.input).toBeFocused()

    // Check community_suitable_housing_concerns_other_details
    await questions.community_unsuitable_housing_concerns.option(CommonOption.other).check()
    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Enter details":
                - /url: "#community_unsuitable_housing_concerns_other_details"
      `)
    await questions.community_unsuitable_housing_concerns_other_details.errorLink.click()
    await expect(questions.community_unsuitable_housing_concerns_other_details.input).toBeFocused()
  })
  test('validation accommodation_changes', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.no },
        { question: Question.community_suitable_housing_location, value: CommonOption.yes },
        { question: Question.community_suitable_housing, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.accommodation_changes.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      'Does Test want to make changes to their accommodation?',
    )
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select if they want to make changes to their accommodation":
                - /url: "#accommodation_changes"
      `)

    await questions.accommodation_changes.errorLink.click()
    await expect(questions.accommodation_changes.input).toBeFocused()
  })
  test('validation community_no_accommodation_reason', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_current_accommodation, value: CommonOption.no }])
      .withUserSubmittedSteps([Step.community_current_accommodation.code, Step.community_no_accommodation_reason.code])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_no_accommodation_reason.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Why does Test have no accommodation?')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Select why they have no accommodation":
                - /url: "#community_no_accommodation_reason"
      `)

    await questions.community_no_accommodation_reason.errorLink.click()
    await expect(questions.community_no_accommodation_reason.input).toBeFocused()

    // Check community_no_accommodation_reason_other_details
    await questions.community_no_accommodation_reason.option(CommonOption.other).check()
    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - listitem:
              - link "Enter details":
                - /url: "#community_no_accommodation_reason_other_details"
      `)
    await questions.community_no_accommodation_reason_other_details.errorLink.click()
    await expect(questions.community_no_accommodation_reason_other_details.input).toBeFocused()
  })
})
