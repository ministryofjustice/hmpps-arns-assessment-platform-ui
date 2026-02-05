import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { ValidationHelper } from '../helpers'

export default class AgreePlanPage extends AbstractPage {
  readonly header: Locator

  readonly agreementQuestionLegend: Locator

  readonly agreeYesRadio: Locator

  readonly agreeNoRadio: Locator

  readonly couldNotAnswerRadio: Locator

  readonly detailsForNoTextarea: Locator

  readonly detailsForCouldNotAnswerTextarea: Locator

  readonly notesTextarea: Locator

  readonly saveButton: Locator

  private validation: ValidationHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.agreementQuestionLegend = page.locator('legend')
    this.agreeYesRadio = page.locator('input[name="plan_agreement_question"][value="yes"]')
    this.agreeNoRadio = page.locator('input[name="plan_agreement_question"][value="no"]')
    this.couldNotAnswerRadio = page.locator('input[name="plan_agreement_question"][value="could_not_answer"]')
    this.detailsForNoTextarea = page.locator('#plan_agreement_details_no')
    this.detailsForCouldNotAnswerTextarea = page.locator('#plan_agreement_details_could_not_answer')
    this.notesTextarea = page.locator('#plan_agreement_notes')
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.validation = new ValidationHelper(page)
  }

  get errorSummary(): Locator {
    return this.validation.errorSummary
  }

  static async verifyOnPage(page: Page): Promise<AgreePlanPage> {
    const agreePlanPage = new AgreePlanPage(page)
    await expect(agreePlanPage.agreementQuestionLegend).toContainText('agree to this plan')
    return agreePlanPage
  }

  async selectAgreeYes(): Promise<void> {
    await this.agreeYesRadio.check()
  }

  async selectAgreeNo(): Promise<void> {
    await this.agreeNoRadio.check()
  }

  async selectCouldNotAnswer(): Promise<void> {
    await this.couldNotAnswerRadio.check()
  }

  async enterDetailsForNo(details: string): Promise<void> {
    await this.detailsForNoTextarea.fill(details)
  }

  async enterDetailsForCouldNotAnswer(details: string): Promise<void> {
    await this.detailsForCouldNotAnswerTextarea.fill(details)
  }

  async enterNotes(notes: string): Promise<void> {
    await this.notesTextarea.fill(notes)
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click()
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    return this.validation.hasFieldError(fieldName)
  }

  async getValidationErrorMessage(fieldName: string): Promise<string> {
    return this.validation.getFieldErrorMessage(fieldName)
  }

  async isErrorSummaryVisible(): Promise<boolean> {
    return this.validation.isErrorSummaryVisible()
  }

  async getErrorSummaryText(): Promise<string> {
    return this.validation.getErrorSummaryText()
  }

  async isDetailsForNoVisible(): Promise<boolean> {
    return this.detailsForNoTextarea.isVisible()
  }

  async isDetailsForCouldNotAnswerVisible(): Promise<boolean> {
    return this.detailsForCouldNotAnswerTextarea.isVisible()
  }
}
