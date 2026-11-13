import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { TargetService, test } from '../../../support/fixtures'
import { buildPageTitle, navigateToStrengthsAndNeeds, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows accommodation type', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)

    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Does Test currently have somewhere to live?')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.accommodation))

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group /Does Test currently have somewhere to live?/:
        - text: /Does Test currently have somewhere to live?/
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows settled questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_current_accommodation, value: CommonOption.yes }])
      .withUserSubmittedSteps([Step.community_current_accommodation.code])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_current_accommodation_settled.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, "Is Test's accommodation settled?")

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Is Test's accommodation settled?":
        - text: Is Test's accommodation settled?
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows location suitable questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
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

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Is the location of Test's accommodation suitable?":
        - text: Is the location of Test's accommodation suitable?
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows why location not suitable questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_location_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      "Why is the location of Test's accommodation not suitable? (Optional)",
    )

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Why is the location of Test's accommodation not suitable? (Optional)":
        - text: Why is the location of Test's accommodation not suitable? (Optional) Select all that apply.
        - checkbox "Close to criminal associates"
        - text: Close to criminal associates
        - checkbox "Close to someone who has victimised them"
        - text: Close to someone who has victimised them
        - checkbox "Close to victim or possible victims"
        - text: Close to victim or possible victims
        - checkbox "Difficulty with neighbours"
        - text: Difficulty with neighbours
        - checkbox "Safety of the area"
        - text: Safety of the area
        - checkbox "Other"
        - text: Other
      - button "Save and continue"
    `)
  })

  test('shows is accommodation suitable questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.yes },
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
        { question: Question.community_suitable_housing_location_concerns, value: Option.criminal_associates },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, "Is Test's accommodation suitable?")

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Is Test's accommodation suitable?":
        - text: Is Test's accommodation suitable? This includes things like safety, who they are living with and having appropriate amenities.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows concerns about accommodation suitability questions', async ({
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
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
        { question: Question.community_suitable_housing_location_concerns, value: Option.criminal_associates },
        { question: Question.community_suitable_housing, value: Option.yes_with_concerns },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
        Step.community_suitable_housing.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      "What are your concerns about the suitability of Test's accommodation? (Optional)",
    )

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "What are your concerns about the suitability of Test's accommodation? (Optional)":
        - text: What are your concerns about the suitability of Test's accommodation? (Optional) Select all that apply.
        - checkbox "Issues with the property"
        - text: Issues with the property For example, poor kitchen or bathroom facilities
        - checkbox "Overcrowding"
        - text: Overcrowding
        - checkbox "Risk of their accommodation being exploited by others"
        - text: Risk of their accommodation being exploited by others For example, cuckooing
        - checkbox "Safety of accommodation"
        - text: Safety of accommodation
        - checkbox "Victim lives with them"
        - text: Victim lives with them
        - checkbox "Victimised by someone living with them"
        - text: Victimised by someone living with them
        - checkbox "Other"
        - text: Other
      - button "Save and continue"
    `)
  })

  test('shows why is accommodation not suitable questions', async ({
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
        { question: Question.community_current_accommodation_settled, value: CommonOption.yes },
        { question: Question.community_suitable_housing_location, value: CommonOption.no },
        { question: Question.community_suitable_housing_location_concerns, value: Option.criminal_associates },
        { question: Question.community_suitable_housing, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.community_current_accommodation.code,
        Step.community_current_accommodation_settled.code,
        Step.community_suitable_housing_location.code,
        Step.community_suitable_housing_location_concerns.code,
        Step.community_suitable_housing.code,
      ])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_suitable_housing_concerns.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      "Why is Test's accommodation not suitable? (Optional)",
    )

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Why is Test's accommodation not suitable? (Optional)":
        - text: Why is Test's accommodation not suitable? (Optional) Select all that apply.
        - checkbox "Issues with the property"
        - text: Issues with the property For example, poor kitchen or bathroom facilities
        - checkbox "Overcrowding"
        - text: Overcrowding
        - checkbox "Risk of their accommodation being exploited by others"
        - text: Risk of their accommodation being exploited by others For example, cuckooing
        - checkbox "Safety of accommodation"
        - text: Safety of accommodation
        - checkbox "Victim lives with them"
        - text: Victim lives with them
        - checkbox "Victimised by someone living with them"
        - text: Victimised by someone living with them
        - checkbox "Other"
        - text: Other
      - button "Save and continue"
    `)
  })

  test('shows no accommodation questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([{ question: Question.community_current_accommodation, value: CommonOption.no }])
      .withUserSubmittedSteps([Step.community_current_accommodation.code])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.community_no_accommodation_reason.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'have no accommodation')

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
      - group "Why does Test have no accommodation?":
        - text: Why does Test have no accommodation?
        - paragraph: Consider current and past homelessness issues.
        - paragraph: Select all that apply.
        - checkbox "Alcohol related problems"
        - text: Alcohol related problems
        - checkbox "Drug related problems"
        - text: Drug related problems
        - checkbox "Financial difficulties"
        - text: Financial difficulties
        - checkbox "Left previous accommodation due to risk to others"
        - text: Left previous accommodation due to risk to others
        - checkbox "Left previous accommodation for their own safety"
        - text: Left previous accommodation for their own safety
        - checkbox "No accommodation when released from prison"
        - text: No accommodation when released from prison
        - checkbox "Other"
        - text: Other
      - button "Save and continue"
    `)
  })

  test('shows want to make changes questions', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.community_current_accommodation, value: CommonOption.no },
        { question: Question.community_no_accommodation_reason, value: Option.alcohol_problems },
      ])
      .withUserSubmittedSteps([Step.community_current_accommodation.code, Step.community_no_accommodation_reason.code])
      .save()

    await navigateToStrengthsAndNeeds(page, handoverLink, Step.accommodation_changes.path)
    const accommodationPage = await AccommodationPage.verifyOnPage(
      page,
      'Does Test want to make changes to their accommodation?',
    )

    await expect(accommodationPage.mainForm).toMatchAriaSnapshot(`
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
})
