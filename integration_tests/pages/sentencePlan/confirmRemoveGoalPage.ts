import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ConfirmRemoveGoalPage extends AbstractPage {
  readonly header: Locator

  readonly goalCard: Locator

  readonly goalTitle: Locator

  readonly removalNoteTextarea: Locator

  readonly confirmButton: Locator

  readonly cancelButton: Locator

  readonly errorSummary: Locator

  readonly removalNoteError: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalCard = page.locator('[data-qa="goal-summary-card"]')
    this.goalTitle = page.locator('[data-qa="goal-title"]')
    this.removalNoteTextarea = page.locator('#removal_note')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cancelButton = page.getByRole('button', { name: 'Do not remove goal' })
    this.errorSummary = page.locator('.govuk-error-summary')
    this.removalNoteError = page.locator('#removal_note-error')
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
    return this.removalNoteError.isVisible()
  }

  async getValidationErrorMessage(): Promise<string> {
    return (await this.removalNoteError.textContent()) ?? ''
  }
}
