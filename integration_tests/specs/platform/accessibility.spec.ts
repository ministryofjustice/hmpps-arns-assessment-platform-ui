import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import { checkHeaderVisibility, checkLinkOpens } from '../../testUtils'

const accessibilityPageUrl = '/platform/accessibility'

test.describe('Accessibility page', () => {
  test('loads with heading and content', async ({ page }) => {
    await page.goto(accessibilityPageUrl)
    await expect(page).toHaveURL(accessibilityPageUrl)

    await checkHeaderVisibility(page, 1, 'Accessibility statement for Assess and plan: Sentence plan')
    await checkHeaderVisibility(page, 2, 'How accessible this website is')
    await checkHeaderVisibility(page, 2, 'Feedback and contact information')
    await checkHeaderVisibility(page, 3, 'Enforcement procedure')
    await checkHeaderVisibility(page, 2, 'Preparation of this accessibility statement')

    await checkHeaderVisibility(page, 2, 'Technical information about this website’s accessibility')
    await checkHeaderVisibility(page, 2, 'Non-accessible content')
    await checkHeaderVisibility(page, 2, 'What we’re doing to improve accessibility')
    await checkHeaderVisibility(page, 2, 'Preparation of this accessibility statement')
    await checkHeaderVisibility(page, 3, 'Enforcement procedure')
    await checkHeaderVisibility(page, 3, 'Compliance status')
    await checkHeaderVisibility(page, 3, 'Responsive design and visual layout')
    await checkHeaderVisibility(page, 3, 'Screen reader announcements')
    await checkHeaderVisibility(page, 3, 'Keyboard operability')
    await checkHeaderVisibility(page, 3, 'Page structure and navigation')

    // links open in a new tab:
    const abilityNetLink = page.getByRole('link', { name: /advice on making your device easier to use/i })
    const webContentAccessibilityLink = page.getByRole('link', {
      name: /Web Content Accessibility Guidelines version 2.2/i,
    })
    const feedbackAndContactLink = page.getByRole('link', { name: /Contact us/i })
    const equalityAdvisoryLink = page.getByRole('link', { name: /contact the Equality Advisory and Support Service (EASS)/i })
    const spotCheckReportLink = page.getByRole('link', { name: /spot check report/i})
    const fullAccessibilityReportLink = page.getByRole('link', { name: /full accessibility test report/i })

    await checkLinkOpens(abilityNetLink)
    await expect(abilityNetLink).toHaveAttribute('href', 'https://mcmw.abilitynet.org.uk')

    await checkLinkOpens(webContentAccessibilityLink)
    await expect(webContentAccessibilityLink).toHaveAttribute('href', 'https://www.w3.org/TR/WCAG22')

    await checkLinkOpens(feedbackAndContactLink)
    await expect(feedbackAndContactLink).toHaveAttribute(
      'href',
      'https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2GF5fsslU5tImfiqSSPf6JhUQU4xRlA2RTQ0UFlXV1lJWjRPRlVSRE5LOSQlQCN0PWcu',
    )

    await checkLinkOpens(equalityAdvisoryLink)
    await expect(equalityAdvisoryLink).toHaveAttribute('href', 'https://www.equalityadvisoryservice.com')

    await checkLinkOpens(spotCheckReportLink)
    await expect(spotCheckReportLink).toHaveAttribute('href', 'https://uv3383-moj-arns-spot-check.uservisionaccessibility.co.uk/index.html')

    await checkLinkOpens(fullAccessibilityReportLink)
    await expect(fullAccessibilityReportLink).toHaveAttribute(
      'href',
      'https://uv3334-moj-arns-sentence-plan.uservisionaccessibility.co.uk/index.html',
    )
  })

  test('shows shared page layout elements', async ({ page }) => {
    await page.goto(accessibilityPageUrl)

    await expect(page.locator('.govuk-phase-banner').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('shows a Back link to the previous page when there is server-side history', async ({ page }) => {
    await page.goto('/platform/cookies-policy')
    await page.goto(accessibilityPageUrl)

    const backLink = page.locator('.govuk-back-link')

    await expect(backLink).toHaveAttribute('href', '/platform/cookies-policy')
  })
})
