import { type Locator, type Page } from '@playwright/test'

/**
 * Helper class for interacting with GOV.UK validation error components.
 * Handles both the error summary box and inline field errors.
 */
export default class ValidationHelper {
  private page: Page

  readonly errorSummary: Locator

  constructor(page: Page) {
    this.page = page
    this.errorSummary = page.locator('.govuk-error-summary')
  }

  async isErrorSummaryVisible(): Promise<boolean> {
    return this.errorSummary.isVisible()
  }

  async getErrorSummaryText(): Promise<string> {
    return (await this.errorSummary.textContent()) ?? ''
  }

  async hasFieldError(fieldName: string): Promise<boolean> {
    const errorMessage = this.page.locator(`#${fieldName}-error`)
    return errorMessage.isVisible()
  }

  async getFieldErrorMessage(fieldName: string): Promise<string> {
    const errorMessage = this.page.locator(`#${fieldName}-error`)
    return (await errorMessage.textContent()) ?? ''
  }
}
