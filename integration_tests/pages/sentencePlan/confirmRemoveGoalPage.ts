import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { ValidationHelper } from '../helpers'

export default class ConfirmRemoveGoalPage extends AbstractPage {
  readonly header: Locator

  readonly removalNoteTextarea: Locator

  readonly confirmButton: Locator

  readonly cancelButton: Locator

  readonly goalCard: Locator

  readonly goalTitle: Locator

  private validation: ValidationHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.removalNoteTextarea = page.locator('#removal_note')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cancelButton = page.getByRole('button', { name: 'Do not remove goal' })
    this.goalCard = page.locator('[data-qa="goal-summary-card"]')
    this.goalTitle = page.locator('[data-qa="goal-title"]')
    this.validation = new ValidationHelper(page)
  }

  get errorSummary(): Locator {
    return this.validation.errorSummary
  }

  static async verifyOnPage(page: Page): Promise<ConfirmRemoveGoalPage> {
    const confirmRemoveGoalPage = new ConfirmRemoveGoalPage(page)
    await expect(confirmRemoveGoalPage.header).toContainText('Confirm you want to remove this goal')
    return confirmRemoveGoalPage
  }

  async enterRemovalNote(note: string): Promise<void> {
    await this.removalNoteTextarea.fill(note)
  }

  async getRemovalNote(): Promise<string> {
    return this.removalNoteTextarea.inputValue()
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click()
  }

  async getGoalTitle(): Promise<string> {
    return (await this.goalTitle.textContent()) ?? ''
  }

  async getHeaderText(): Promise<string> {
    return (await this.header.textContent()) ?? ''
  }

  async hasValidationError(): Promise<boolean> {
    return this.validation.hasFieldError('removal_note')
  }

  async getValidationErrorMessage(): Promise<string> {
    return this.validation.getFieldErrorMessage('removal_note')
  }
}
