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

      const accomodationPage = await AccommodationPage.verifyOnPage(page)

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
