import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { ValidationHelper } from '../helpers'

export default class UpdateAgreePlanPage extends AbstractPage {
  readonly agreementQuestionLegend: Locator

  readonly agreeYesRadio: Locator

  readonly agreeNoRadio: Locator

  readonly detailsForNoTextarea: Locator

  readonly saveButton: Locator

  readonly goBackLink: Locator

  private validation: ValidationHelper

  private constructor(page: Page) {
    super(page)
    this.agreementQuestionLegend = page.locator('legend')
    this.agreeYesRadio = page.locator('input[name="update_plan_agreement_question"][value="yes"]')
    this.agreeNoRadio = page.locator('input[name="update_plan_agreement_question"][value="no"]')
    this.detailsForNoTextarea = page.locator('#update_plan_agreement_details_no')
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.goBackLink = page.locator('.govuk-back-link')
    this.validation = new ValidationHelper(page)
  }

  static async verifyOnPage(page: Page): Promise<UpdateAgreePlanPage> {
    const agreePlanPage = new UpdateAgreePlanPage(page)
    await expect(agreePlanPage.agreementQuestionLegend).toContainText('agree to their plan')
    return agreePlanPage
  }

  async selectAgreeYes(): Promise<void> {
    await this.agreeYesRadio.check()
  }

  async selectAgreeNo(): Promise<void> {
    await this.agreeNoRadio.check()
  }

  async enterDetailsForNo(details: string): Promise<void> {
    await this.detailsForNoTextarea.fill(details)
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click()
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    return this.validation.hasFieldError(fieldName)
  }

  async isDetailsForNoVisible(): Promise<boolean> {
    return this.detailsForNoTextarea.isVisible()
  }
}
