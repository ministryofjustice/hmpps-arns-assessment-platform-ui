import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ConfirmReaddGoalPage extends AbstractPage {
  readonly header: Locator

  readonly goalCard: Locator

  readonly goalTitle: Locator

  readonly readdNoteTextarea: Locator

  readonly canStartNowYes: Locator

  readonly canStartNowNo: Locator

  readonly targetDateOptions: Locator

  readonly customTargetDateInput: Locator

  readonly confirmButton: Locator

  readonly cancelButton: Locator

  readonly errorSummary: Locator

  readonly readdNoteError: Locator

  readonly canStartNowError: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalCard = page.locator('[data-qa="goal-summary-card"]')
    this.goalTitle = page.locator('[data-qa="goal-title"]')
    this.readdNoteTextarea = page.locator('#readd_note')
    this.canStartNowYes = page
      .getByRole('group', { name: /can.*start working on this goal/i })
      .getByRole('radio', { name: 'Yes' })
    this.canStartNowNo = page
      .getByRole('group', { name: /can.*start working on this goal/i })
      .getByRole('radio', { name: /no.*future goal/i })
    this.targetDateOptions = page.locator('[name="target_date_option"]')
    this.customTargetDateInput = page.locator('#custom_target_date')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cancelButton = page.getByRole('button', { name: 'Do not add goal back into plan' })
    this.errorSummary = page.locator('.govuk-error-summary')
    this.readdNoteError = page.locator('#readd_note-error')
    this.canStartNowError = page.locator('#can_start_now-error')
  }

  static async verifyOnPage(page: Page): Promise<ConfirmReaddGoalPage> {
    const confirmReaddGoalPage = new ConfirmReaddGoalPage(page)
    await expect(confirmReaddGoalPage.header).toContainText('Confirm you want to add this goal back')
    return confirmReaddGoalPage
  }

  async enterReaddNote(note: string): Promise<void> {
    await this.readdNoteTextarea.fill(note)
  }

  async getReaddNote(): Promise<string> {
    return this.readdNoteTextarea.inputValue()
  }

  async selectCanStartNow(canStart: boolean): Promise<void> {
    if (canStart) {
      await this.canStartNowYes.click()
    } else {
      await this.canStartNowNo.click()
    }
  }

  async selectTargetDateOption(option: string): Promise<void> {
    const targetDateRadio = this.page.locator(`[name="target_date_option"][value="${option}"]`)
    await targetDateRadio.waitFor({ state: 'visible' })
    await targetDateRadio.click()
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

  // Re-adding a goal requires: (1) a note explaining why, and (2) whether they can start now
  async hasValidationError(): Promise<boolean> {
    const hasReaddError = await this.readdNoteError.isVisible()
    const hasCanStartError = await this.canStartNowError.isVisible()
    return hasReaddError || hasCanStartError
  }

  async hasReaddNoteError(): Promise<boolean> {
    return this.readdNoteError.isVisible()
  }

  async hasCanStartNowError(): Promise<boolean> {
    return this.canStartNowError.isVisible()
  }

  async isCanStartNowYesChecked(): Promise<boolean> {
    return this.canStartNowYes.isChecked()
  }

  async isCanStartNowNoChecked(): Promise<boolean> {
    return this.canStartNowNo.isChecked()
  }
}
