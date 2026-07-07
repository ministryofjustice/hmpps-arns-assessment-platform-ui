import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Health and wellbeing Page', () => {
  test.describe('Questions', () => {
    test('shows physical health and mental health', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL)

      const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page)

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.healthAndWellbeing))

      await expect(healthAndWellbeingPage.currentEmploymentStatus).toMatchAriaSnapshot(`
          - group /have any physical health conditions?/:
            - text: /have any physical health conditions?/
            - radio "Yes"
            - text: "Yes"
            - radio "No"
            - text: "No"
            - radio "Unknown"
            - text: Unknown
          - group /have any diagnosed or documented mental health problems?/:
            - text: /have any diagnosed or documented mental health problems?/
            - radio "Yes, ongoing - severe and documented over a prolonged period of times"
            - text: Yes, ongoing - severe and documented over a prolonged period of times
            - radio "Yes, ongoing - duration is not known or there is no link to offending"
            - text: Yes, ongoing - duration is not known or there is no link to offending
            - radio "Yes, in the past"
            - text: Yes, in the past
            - radio "No"
            - text: "No"
            - radio "Unknown"
            - text: Unknown
          - button "Save and continue"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await HealthAndWellbeingPage.navigateToHealthAndWellbeing(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
