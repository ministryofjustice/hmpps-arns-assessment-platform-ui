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
      .extend(sanAssessmentId).withAnswers([{ question: 'current_accommodation', value: 'SETTLED' }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')

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
    await accommodationPage.selectTypeOfAccommodation('settled')

    await expect(accommodationPage.homeowner).toBeFocused()
  })

  test('validation temporary option', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: 'current_accommodation', value: 'TEMPORARY' }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')

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
    await accommodationPage.selectTypeOfAccommodation('temporary')

    await expect(accommodationPage.approvedPremises).toBeFocused()
  })

  test('validation no accommodation option', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: 'current_accommodation', value: 'NO_ACCOMMODATION' }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')

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
    await accommodationPage.selectTypeOfAccommodation('no accommodation')

    await expect(accommodationPage.campsite).toBeFocused()
  })

  test('validation settled questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'current_accommodation', value: 'SETTLED' },
        { question: 'type_of_settled_accommodation', value: 'HOMEOWNER' },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Who is')

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

    await accommodationPage.selectWhoTheyAreLivingWith.click()
    await expect(accommodationPage.family).toBeFocused()
    await accommodationPage.selectIfTheLocation.click()
    await expect(accommodationPage.isTheLocationOf).toBeFocused()
    await accommodationPage.selectIfTheAccommodation.click()
    await expect(accommodationPage.yesAccommodationSuitable).toBeFocused()
    await accommodationPage.errorWantsToMakeChanges.click()
    await expect(accommodationPage.yesAlreadyMadePositiveChanges).toBeFocused()
  })
})
