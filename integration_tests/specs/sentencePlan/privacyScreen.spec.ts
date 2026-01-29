import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import {
  buildErrorPageTitle,
  buildPageTitle,
  navigateToPrivacyScreen,
  sentencePlanPageTitles,
} from './sentencePlanUtils'

test.describe('Privacy Screen', () => {
  test.describe('Display and content', () => {
    test('should be accessible', async ({ page, createSession, makeAxeBuilder, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPrivacyScreen(page, handoverLink)

      const accessibilityScanResults = await makeAxeBuilder()
        .include('#main-content')
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('displays privacy screen with correct content', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      const privacyPage = await navigateToPrivacyScreen(page, handoverLink)

      // ensure page title is correct
      await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.privacy))

      const headingText = await privacyPage.getHeadingText()
      expect(headingText).toContain('Remember to close any other applications before starting an appointment with')

      await expect(privacyPage.privacyContent).toContainText('For example, Outlook, Teams or NDelius')
      await expect(privacyPage.privacyContent).toContainText(
        "You must also close other people's assessments or plans if you have them open in other tabs",
      )
      await expect(privacyPage.privacyContent).toContainText('Do not let')
      await expect(privacyPage.privacyContent).toContainText('use your device either')
      await expect(privacyPage.privacyContent).toContainText('This is to avoid sharing sensitive information')

      await expect(privacyPage.confirmCheckbox).toBeVisible()
      await expect(privacyPage.confirmButton).toBeVisible()
    })

    test('displays checkbox with correct label', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToPrivacyScreen(page, handoverLink)

      const checkboxLabel = page.locator('label[for="confirm_privacy"]')
      await expect(checkboxLabel).toContainText("I confirm I'll do this before starting an appointment")
    })

    test.describe('Validation', () => {
      test('shows validation error when submitting without checking the checkbox', async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).save()

        const privacyPage = await navigateToPrivacyScreen(page, handoverLink)

        await privacyPage.clickConfirm()

        await expect(page).toHaveURL(/\/privacy/)

        // ensure error page title is correct:
        await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.privacy))

        const hasError = await privacyPage.hasValidationError()
        expect(hasError).toBe(true)

        const errorMessage = await privacyPage.getFieldErrorMessage()
        expect(errorMessage).toContain('Confirm you will do this before starting an appointment')
      })

      test('error summary links to the checkbox field', async ({ page, createSession, sentencePlanBuilder }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).save()

        const privacyPage = await navigateToPrivacyScreen(page, handoverLink)

        await privacyPage.clickConfirm()

        // ensure error page title is correct:
        await expect(page).toHaveTitle(buildErrorPageTitle(sentencePlanPageTitles.privacy))

        const errorLink = page.locator('.govuk-error-summary__list a')
        await expect(errorLink).toBeVisible()

        const href = await errorLink.getAttribute('href')
        expect(href).toContain('confirm_privacy')
      })
    })

    test.describe('Successful submission', () => {
      test('redirects to plan overview after confirming privacy', async ({
        page,
        createSession,
        sentencePlanBuilder,
      }) => {
        const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
        await sentencePlanBuilder.extend(sentencePlanId).save()

        const privacyPage = await navigateToPrivacyScreen(page, handoverLink)

        await privacyPage.confirmAndContinue()

        await expect(page).toHaveURL(/\/plan\/overview/)

        await PlanOverviewPage.verifyOnPage(page)
      })
    })
  })
})
