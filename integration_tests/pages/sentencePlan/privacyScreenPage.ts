import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PrivacyScreenPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly privacyContent: Locator

  readonly confirmCheckbox: Locator

  readonly confirmButton: Locator

  readonly returnToOasysLink: Locator

  readonly backLink: Locator

  readonly errorSummary: Locator

  readonly fieldError: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.privacyContent = page.locator('.govuk-grid-column-two-thirds')
    this.confirmCheckbox = page.locator('#confirm_privacy')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.returnToOasysLink = page.getByRole('link', { name: 'Return to OASys' })
    this.backLink = page.locator('.govuk-back-link')
    this.errorSummary = page.locator('.govuk-error-summary')
    this.fieldError = page.locator('#confirm_privacy-error')
  }

  static async verifyOnPage(page: Page): Promise<PrivacyScreenPage> {
    const privacyScreenPage = new PrivacyScreenPage(page)
    await expect(privacyScreenPage.pageHeading).toContainText(
      'Remember to close any other applications before starting an appointment',
    )
    return privacyScreenPage
  }

  async checkConfirmCheckbox(): Promise<void> {
    await this.confirmCheckbox.check()
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click()
  }

  async confirmAndContinue(): Promise<void> {
    await this.checkConfirmCheckbox()
    await this.clickConfirm()
  }

  async getHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent()) || ''
  }

  async isReturnToOasysLinkVisible(): Promise<boolean> {
    return this.returnToOasysLink.isVisible()
  }

  async hasValidationError(): Promise<boolean> {
    return this.errorSummary.isVisible()
  }

  async getFieldErrorMessage(): Promise<string> {
    return (await this.fieldError.textContent()) || ''
  }
}
