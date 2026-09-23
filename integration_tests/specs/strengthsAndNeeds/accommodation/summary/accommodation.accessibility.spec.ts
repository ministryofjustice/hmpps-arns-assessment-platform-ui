import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/option'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { checkAccessibility, navigateToStrengthsAndNeeds } from '../../sanUtils'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Accessibility', () => {
  test('should be accessible', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
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

    await navigateToStrengthsAndNeeds(page, handoverLink, 'accommodation-summary')
    const accommodationPage = await AccommodationPage.verifyOnPage(page, 'Summary')
    await checkAccessibility(accommodationPage.page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })
})
