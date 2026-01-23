import { expect } from '@playwright/test'
import { test } from '../../support/fixtures'
import { SentencePlanBuilder } from '../../builders/SentencePlanBuilder'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import { loginAndNavigateToPrivacyScreenByCrn, sentencePlanV1URLs } from './sentencePlanUtils'
import { login, randomCrn } from '../../testUtils'

test.describe('Privacy Screen', () => {
  test.describe('Display and content', () => {
    test('displays privacy screen with correct content', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)

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

    test('displays checkbox with correct label', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      await loginAndNavigateToPrivacyScreenByCrn(page, crn)

      const checkboxLabel = page.locator('label[for="confirm_privacy"]')
      await expect(checkboxLabel).toContainText("I confirm I'll do this before starting an appointment")
    })

    test('does not show Return to OASys link for MPOP access', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)

      const isOasysLinkVisible = await privacyPage.isReturnToOasysLinkVisible()
      expect(isOasysLinkVisible).toBe(false)
    })
  })

  test.describe('Validation', () => {
    test('shows validation error when submitting without checking the checkbox', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)

      await privacyPage.clickConfirm()

      await expect(page).toHaveURL(/\/privacy/)

      const hasError = await privacyPage.hasValidationError()
      expect(hasError).toBe(true)

      const errorMessage = await privacyPage.getFieldErrorMessage()
      expect(errorMessage).toContain('Confirm you will do this before starting an appointment')
    })

    test('error summary links to the checkbox field', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)

      await privacyPage.clickConfirm()

      const errorLink = page.locator('.govuk-error-summary__list a')
      await expect(errorLink).toBeVisible()

      const href = await errorLink.getAttribute('href')
      expect(href).toContain('confirm_privacy')
    })
  })

  test.describe('Successful submission', () => {
    test('redirects to plan overview after confirming privacy', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()
      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)

      await privacyPage.confirmAndContinue()

      await expect(page).toHaveURL(/\/plan\/overview/)

      await PlanOverviewPage.verifyOnPage(page)
    })
  })

  test.describe('Session behaviour', () => {
    test('skips privacy screen on subsequent visits within same session', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()

      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)
      await privacyPage.confirmAndContinue()

      await expect(page).toHaveURL(/\/plan\/overview/)

      await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)

      await expect(page).toHaveURL(/\/plan\/overview/)
      await PlanOverviewPage.verifyOnPage(page)
    })

    test('shows privacy screen again after logging out and back in', async ({ page, aapClient }) => {
      const crn = randomCrn()
      await SentencePlanBuilder(aapClient).fresh().forCrn(crn).save()

      const privacyPage = await loginAndNavigateToPrivacyScreenByCrn(page, crn)
      await privacyPage.confirmAndContinue()
      await expect(page).toHaveURL(/\/plan\/overview/)

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      await planOverviewPage.signOut()

      await login(page)
      await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)

      await expect(page).toHaveURL(/\/privacy/)
      await PrivacyScreenPage.verifyOnPage(page)
    })
  })
})
