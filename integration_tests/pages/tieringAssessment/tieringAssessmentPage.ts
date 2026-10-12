import { expect, type Locator, Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class TieringAssessmentPage extends AbstractPage {

  readonly backLink: Locator

  readonly pageHeading: Locator

  readonly saveAndContinue: Locator

  readonly errorSummaryBox: Locator

  readonly requiredFieldError: Locator

  readonly validDateError: Locator

  readonly wholeNumberError: Locator

  readonly greaterThanZeroError: Locator

  readonly greaterThanOrEqualToZeroError: Locator

  protected constructor(page: Page) {
    super(page)
    this.backLink = page.getByTestId('tiering-assessment-header').getByRole('link', { name: 'Back' })
    this.pageHeading = page.getByTestId('page-title')
    this.saveAndContinue = page.getByRole('button', { name: 'Save and continue' })
    this.errorSummaryBox = page.getByRole('alert')
    this.requiredFieldError = page.getByRole('link', { name: 'This is a required field.' })
    this.validDateError = page.getByRole('link', { name: 'Please enter a valid date.' })
    this.wholeNumberError = page.getByRole('link', { name: 'Must be a whole number.' })
    this.greaterThanZeroError = page.getByRole('link', { name: 'Must be greater than 0.' })
    this.greaterThanOrEqualToZeroError = page.getByRole('link', { name: 'Must be greater than or equal to' })
  }

  async clickBackLink() {
    await this.backLink.click()
  }

  async checkPageUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  async checkPageHeading(heading: string) {
    await expect(this.pageHeading).toContainText(heading)
  }

  async clickSaveAndContinue() {
    await this.saveAndContinue.click()
  }

  async checkErrorSummaryBoxAppears() {
    await expect(this.errorSummaryBox).toContainText('There is a problem')
  }

  async numberOfRequiredFieldErrors(count: number) {
    await expect(this.requiredFieldError).toHaveCount(count)
  }

  async numberOfValidDateErrors(count: number) {
    await expect(this.validDateError).toHaveCount(count)
  }

  async numberOfWholeNumberErrors(count: number) {
    await expect(this.wholeNumberError).toHaveCount(count)
  }

  async numberOfGreaterThanZero(count: number) {
    await expect(this.greaterThanZeroError).toHaveCount(count)
  }

  async numberOfGreaterThanOrEqual(count: number) {
    await expect(this.greaterThanOrEqualToZeroError).toHaveCount(count)
  }
}
