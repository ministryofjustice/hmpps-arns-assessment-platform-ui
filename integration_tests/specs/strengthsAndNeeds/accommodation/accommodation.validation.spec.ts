import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds } from '../sanUtils'

test.describe('Validation', () => {
  test('validation settled option', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.current_accommodation, value: Option.settled }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Select the type of settled accommodation":
                - /url: "#type_of_settled_accommodation"
      `)
    await questions.type_of_settled_accommodation.errorLink.click()
    await expect(questions.type_of_settled_accommodation.input).toBeFocused()
  })

  test('validation temporary option', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.current_accommodation, value: Option.temporary }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Select the type of temporary accommodation":
                - /url: "#type_of_temporary_accommodation"
      `)
    await questions.type_of_temporary_accommodation.errorLink.click()
    await expect(questions.type_of_temporary_accommodation.input).toBeFocused()
  })

  test('validation no accommodation option', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.current_accommodation, value: Option.no_accommodation }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Select the type of no accommodation":
                - /url: "#type_of_no_accommodation"
      `)
    await questions.type_of_no_accommodation.errorLink.click()
    await expect(questions.type_of_no_accommodation.input).toBeFocused()
  })

  test('validation settled questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.current_accommodation, value: Option.settled },
        { question: Question.type_of_settled_accommodation, value: Option.homeowner },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Who is')
    const { questions } = accommodationPage

    await accommodationPage.saveAndContinue.click()
    await expect(accommodationPage.alert).toMatchAriaSnapshot(`
        - alert:
          - heading "There is a problem" [level=2]
          - list:
            - /children: equal
            - listitem:
              - link "Select who they are living with, or select 'Alone'":
                - /url: "#living_with"
            - listitem:
              - link "Select if the location of the accommodation is suitable":
                - /url: "#suitable_housing_location"
            - listitem:
              - link "Select if the accommodation is suitable":
                - /url: "#suitable_housing"
            - listitem:
              - link "Select if they want to make changes to their accommodation":
                - /url: "#accommodation_changes"
      `)

    await questions.living_with.errorLink.click()
    await expect(questions.living_with.input).toBeFocused()
    await questions.suitable_housing_location.errorLink.click()
    await expect(questions.suitable_housing_location.input).toBeFocused()
    await questions.suitable_housing.errorLink.click()
    await expect(questions.suitable_housing.input).toBeFocused()
    await questions.accommodation_changes.errorLink.click()
    await expect(questions.accommodation_changes.input).toBeFocused()
  })
})
