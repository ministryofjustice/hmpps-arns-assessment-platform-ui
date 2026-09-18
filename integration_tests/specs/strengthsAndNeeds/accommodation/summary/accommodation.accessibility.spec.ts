import AccommodationPage from 'pages/strengthsAndNeeds/accommodationPage'
import { test, TargetService } from '../../../../support/fixtures'
import { checkAccessibility, navigateToStrengthsAndNeeds } from '../../sanUtils'

test.describe('Accessibility', () => {
  test('should be accessible', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
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
    await checkAccessibility(accommodationPage.page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })
})
