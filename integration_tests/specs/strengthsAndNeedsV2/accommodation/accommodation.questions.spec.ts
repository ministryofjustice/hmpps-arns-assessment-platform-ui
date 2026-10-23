import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { expect } from '@playwright/test'
import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
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
})
