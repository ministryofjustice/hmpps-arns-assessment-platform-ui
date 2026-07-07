import { expect } from '@playwright/test'
import EmploymentAndEducationPage from 'pages/strengthsAndNeeds/employmentAndEducationPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, checkAccessibility, sanPageTitles } from './sanUtils'

test.describe('Employment and education Page', () => {
  test.describe('Questions', () => {
    test('shows current employment status', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
      await strengthsAndNeedsBuilder.fresh().save()

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)

      const employmentAndEducationPage = await EmploymentAndEducationPage.verifyOnPage(page)

      await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.employmentAndEducation))

      await expect(employmentAndEducationPage.currentEmploymentStatus).toMatchAriaSnapshot(`
          - group /current employment status?/:
            - text: /current employment status?/
            - radio "Employed"
            - text: Employed
            - radio "Self-employed"
            - text: Self-employed
            - radio "Retired"
            - text: Retired
            - radio "Currently unavailable for work"
            - text: Currently unavailable for work
            - radio "Unemployed - actively looking for work"
            - text: Unemployed - actively looking for work
            - radio "Unemployed - not actively looking for work"
            - text: Unemployed - not actively looking for work
          - button "Save and continue"
      `)
    })
  })

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page, createSession, baseURL }) => {
      const { handoverLink } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

      await EmploymentAndEducationPage.navigateToEmploymentAndEducation(page, handoverLink, baseURL)
      await checkAccessibility(page, {
        // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
        disableRules: ['aria-allowed-attr'],
      })
    })
  })
})
