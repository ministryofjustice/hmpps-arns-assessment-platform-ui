import { test, TargetService } from '../../../support/fixtures'
import { checkAccessibility, navigateToStrengthsAndNeeds } from '../sanUtils'

test.describe('Accessibility', () => {
  test('should be accessible', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.extend(sanAssessmentId, 'v1.0').save()
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await checkAccessibility(page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })
})
