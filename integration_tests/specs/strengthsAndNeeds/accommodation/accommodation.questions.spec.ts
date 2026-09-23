import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, navigateToStrengthsAndNeeds, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows accommodation type', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)

    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.accommodation))

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
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
        { question: Question.current_accommodation, value: Option.settled },
        { question: Question.type_of_settled_accommodation, value: Option.homeowner },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Who is')

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
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
        { question: Question.current_accommodation, value: Option.temporary },
        { question: Question.type_of_temporary_accommodation, value: Option.approved_premises },
        { question: Question.approved_premises_end_date, value: '2030-01-01' },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Is the location')

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
        - group "Is the location of Test's accommodation suitable?"
        - group "Is Test's accommodation suitable?"
        - group "Does Test have future accommodation planned?"
        - group "Does Test want to make changes to their accommodation?"
        - button "Save and continue"
      `)
  })

  test('temporary approved premises, end date optional', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.current_accommodation, value: Option.temporary }]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'What type of accommodation')
    await accommodationPage.questions.type_of_temporary_accommodation.option(Option.approved_premises)
      .click()
    await accommodationPage.saveAndContinue.click()

    await AccommodationPage.verifyOnPage(page, 'Is the location')
  })

  test('shows no accommodation questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.current_accommodation, value: Option.no_accommodation },
        { question: Question.type_of_no_accommodation, value: Option.campsite },
      ]).save()

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-details')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'have no accommodation')

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
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
