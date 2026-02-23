import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import { navigateToSentencePlan, navigateToPrivacyScreen } from './sentencePlanUtils'

test.describe('Feedback and Report a Problem', () => {
  test.describe('Phase Banner', () => {
    // AC1: Phase banner visible on every SP page with Beta tag, feedback link, and report a problem link
    // AC2: Feedback link opens in a new tab
    test('shows phase banner with Beta tag, feedback link and report a problem link', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const phaseBanner = page.locator('.govuk-phase-banner', { hasText: 'Beta' })
      await expect(phaseBanner).toBeVisible()
      await expect(phaseBanner.locator('.govuk-tag')).toHaveText('Beta')

      // AC1: Check the full banner content text
      await expect(phaseBanner).toContainText(
        'This is a new service. Give feedback (opens in a new tab) to help us improve it, or report a problem.',
      )

      // AC2: Feedback link opens in a new tab
      const feedbackLink = phaseBanner.getByRole('link', { name: /give feedback/i })
      await expect(feedbackLink).toBeVisible()
      await expect(feedbackLink).toHaveAttribute('target', '_blank')
      await expect(feedbackLink).toHaveClass(/govuk-link--no-visited-state/)

      const reportProblemLink = phaseBanner.getByRole('link', { name: /report a problem/i })
      await expect(reportProblemLink).toBeVisible()
      await expect(reportProblemLink).toHaveClass(/govuk-link--no-visited-state/)
    })

    // AC1: Phase banner appears on every SP page, including the privacy screen
    test('phase banner appears on privacy screen', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPrivacyScreen(page, handoverLink)

      const phaseBanner = page.locator('.govuk-phase-banner', { hasText: 'Beta' })
      await expect(phaseBanner).toBeVisible()
      await expect(phaseBanner.locator('.govuk-tag')).toHaveText('Beta')
    })
  })

  test.describe('Report a Problem Expander', () => {
    // AC3: Collapsed expander at the bottom of every SP page with wording "Report a problem"
    test('shows collapsed report a problem expander at bottom of page', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      const details = page.locator('#report-a-problem details')
      await expect(details).toBeVisible()
      await expect(details).not.toHaveAttribute('open', '')

      await expect(details.locator('summary')).toHaveText(/Report a problem/)
    })

    // AC4: Expander content includes instruction text, ServiceNow link, read-only text box with
    //       CRN, Request ID, Assessment ID, OASys PK, and a Copy button
    test('expander shows ServiceNow link and support details when opened', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink, crn } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      await page.locator('#report-a-problem summary').click()

      // Check instruction text
      const expanderContent = page.locator('#report-a-problem .govuk-details__text')
      await expect(expanderContent).toContainText(
        'Copy this information and paste it into the ServiceNow form (opens in a new tab).',
      )

      // Check ServiceNow link opens in new tab
      const serviceNowLink = page.locator('#report-a-problem').getByRole('link', { name: /servicenow form/i })
      await expect(serviceNowLink).toBeVisible()
      await expect(serviceNowLink).toHaveAttribute('target', '_blank')

      // Check all fields are present in the text box
      const detailsText = page.locator('#report-problem-details')
      await expect(detailsText).toContainText(`CRN: ${crn}`)
      await expect(detailsText).toContainText(/Request ID:/)
      await expect(detailsText).toContainText(/Assessment ID:/)
      await expect(detailsText).toContainText(/OASys PK:/)

      // Check Copy button is present
      const copyButton = page.locator('#report-a-problem').getByRole('button', { name: /copy/i })
      await expect(copyButton).toBeVisible()
    })

    // AC5: Fields show as blank when data is unavailable.
    //       On the privacy screen, CRN and OASys PK are available from the session
    //       but Assessment ID is not yet set.
    test('unavailable fields are blank on privacy screen', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPrivacyScreen(page, handoverLink)

      await page.locator('#report-a-problem summary').click()

      const detailsText = page.locator('#report-problem-details')
      await expect(detailsText).toBeVisible()

      // Fields available from the session should be populated
      await expect(detailsText).toContainText(`CRN: ${crn}`)
      await expect(detailsText).toContainText(/Request ID:/)

      // Assessment ID is not available on the privacy screen and should be blank
      const text = await detailsText.textContent()
      expect(text).toMatch(/Assessment ID:\s*\n/)
    })
  })

  test.describe('Report a Problem Link Behaviour', () => {
    // AC7: Clicking "report a problem" in the phase banner scrolls to and opens the expander,
    //       and the expander can be collapsed again by clicking the summary
    test('clicking report a problem in phase banner opens the expander', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)

      // Verify expander is closed
      const details = page.locator('#report-a-problem details')
      await expect(details).not.toHaveAttribute('open', '')

      // Click the report a problem link in the phase banner
      await page
        .locator('.govuk-phase-banner', { hasText: 'Beta' })
        .getByRole('link', { name: /report a problem/i })
        .click()

      // Verify expander is now open
      await expect(details).toHaveAttribute('open', '')

      // Verify expander can be collapsed again
      await page.locator('#report-a-problem summary').click()
      await expect(details).not.toHaveAttribute('open', '')
    })
  })
})
