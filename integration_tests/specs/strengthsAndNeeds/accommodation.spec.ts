import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, navigateToStrengthsAndNeeds, sanPageTitles } from './sanUtils'

test.describe('Accommodation Page', () => {
  test.describe('Questions', () => {
    test('shows accomodation type', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await navigateToStrengthsAndNeeds(page, handoverLink)

      const accomodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.accommodation))

      await expect(accomodationPage.whatTypeOfAccommodation).toMatchAriaSnapshot(`
          - group /What type of accommodation does/:
            - text: /What type of accommodation does/
            - radio "Settled"
            - text: Settled
            - radio "Temporary"
            - text: Temporary
            - radio "No accommodation"
            - text: No accommodation
          - button "Save and continue"
      `)
    })

    test('shows settled questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
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

      await expect(accommodationPage.mainSection).toMatchAriaSnapshot(`
        - heading "Accommodation" [level=1]
        - group "Who is Test living with?":
          - text: Who is Test living with? Select all that apply.
          - checkbox "Family"
          - text: Family
          - checkbox "Friends"
          - text: Friends
          - checkbox "Partner"
          - text: Partner
          - checkbox "Person under 18 years old"
          - text: Person under 18 years old
          - checkbox "Other"
          - text: Other
          - checkbox "Unknown"
          - text: Unknown or
          - checkbox "Alone"
          - text: Alone
        - group "Is the location of Test's accommodation suitable?":
          - text: Is the location of Test's accommodation suitable?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
        - group "Is Test's accommodation suitable?":
          - text: Is Test's accommodation suitable? This includes things like safety or having appropriate amenities.
          - radio "Yes"
          - text: "Yes"
          - radio "Yes, with concerns"
          - text: Yes, with concerns
          - radio "No"
          - text: "No"
        - group "Does Test want to make changes to their accommodation?":
          - text: Does Test want to make changes to their accommodation? Test must answer this question.
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

    test('shows temporary questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'current_accommodation', value: 'TEMPORARY' },
          { question: 'type_of_temporary_accommodation', value: 'APPROVED_PREMISES' },
          { question: 'approved_premises_end_date', value: '2030-01-01' },
        ]).save()

      await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
      const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Is the location')

      await expect(accommodationPage.mainSection).toMatchAriaSnapshot(`
        - link "Back"
        - heading "Accommodation" [level=1]
        - strong: Incomplete
        - group "Is the location of Test's accommodation suitable?"
        - group "Is Test's accommodation suitable?"
        - group "Does Test have future accommodation planned?"
        - group "Does Test want to make changes to their accommodation?"
        - button "Save and continue"
      `)
    })

    test('temporary approved premises, end date optional', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([{ question: 'current_accommodation', value: 'TEMPORARY' }]).save()

      await navigateToStrengthsAndNeeds(page, handoverLink)
      const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
      await accommodationPage.approvedPremises.click()
      await accommodationPage.saveAndContinue.click()

      await AccommodationPage.verifyOnPage(page, 'Is the location')
    })

    test('shows no accommodation questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId).withAnswers([
          { question: 'current_accommodation', value: 'NO_ACCOMMODATION' },
          { question: 'type_of_no_accommodation', value: 'CAMPSITE' },
        ]).save()

      await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
      const accommodationPage = await AccommodationPage.verifyOnPage(page, 'have no accommodation')

      await expect(accommodationPage.mainSection).toMatchAriaSnapshot(`
        - link "Back"
        - heading "Accommodation" [level=1]
        - strong: Incomplete
        - group "Why does Test have no accommodation?"
        - text: What’s helped Test stay in accommodation in the past? (optional)
        - textbox "What’s helped Test stay in accommodation in the past? (optional)"
        - text: You can enter up to 2000 characters You have 2,000 characters remaining
        - group "Does Test have future accommodation planned?"
        - group "Does Test want to make changes to their accommodation?"
        - button "Save and continue"
      `)
    })
  })

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
            - link "Change":
              - /url: current-accommodation
          - term: Who is Test living with?
          - definition:
            - paragraph: Family
          - definition:
            - link "Change":
              - /url: accommodation-details#living_with
          - term: Is the location of Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: accommodation-details#suitable_housing_location
          - term: Is Test's accommodation suitable?
          - definition:
            - paragraph: "No"
          - definition:
            - link "Change":
              - /url: accommodation-details#suitable_housing
          - term: Does Test want to make changes to their accommodation?
          - definition:
            - paragraph: Test is not present
          - definition:
            - link "Change":
              - /url: accommodation-details#accommodation_changes
          - button "Go to practitioner analysis"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await navigateToStrengthsAndNeeds(page, handoverLink)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
