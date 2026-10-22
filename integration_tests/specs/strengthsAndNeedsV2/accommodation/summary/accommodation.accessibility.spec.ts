import AccommodationPage from 'pages/strengthsAndNeedsV2/accommodationPage'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/step'
import { checkAccessibility, navigateToStrengthsAndNeeds } from 'specs/strengthsAndNeedsV2/sanUtils'
import { details } from 'testUtils'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Accessibility', () => {
  test('should be accessible', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
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
        { question: Question.community_suitable_housing, value: CommonOption.no },
        {
          question: Question.community_unsuitable_housing_concerns,
          value: [Option.facilities, Option.overcrowding, CommonOption.other],
        },
        {
          question: Question.community_unsuitable_housing_concerns_other_details,
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

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')
    await checkAccessibility(accommodationPage.page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })
})
