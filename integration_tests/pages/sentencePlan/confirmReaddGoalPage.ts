import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import {
  GoalSummaryCardHelper,
  ValidationHelper,
  CanStartNowHelper,
  TargetDateHelper,
  type TargetDateOption,
} from '../helpers'

export default class ConfirmReaddGoalPage extends AbstractPage {
  readonly header: Locator

  readonly readdNoteTextarea: Locator

  readonly confirmButton: Locator

  readonly cancelButton: Locator

  readonly readdNoteError: Locator

  readonly canStartNowError: Locator

  private goalSummaryCard: GoalSummaryCardHelper

  private validation: ValidationHelper

  private canStartNow: CanStartNowHelper

  private targetDate: TargetDateHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.readdNoteTextarea = page.locator('#readd_note')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cancelButton = page.getByRole('button', { name: 'Do not add goal back into plan' })
    this.readdNoteError = page.locator('#readd_note-error')
    this.canStartNowError = page.locator('#can_start_now-error')
    this.goalSummaryCard = new GoalSummaryCardHelper(page)
    this.validation = new ValidationHelper(page)
    this.canStartNow = new CanStartNowHelper(page)
    this.targetDate = new TargetDateHelper(page)
  }

  get goalCard(): Locator {
    return this.goalSummaryCard.card
  }

  get goalTitle(): Locator {
    return this.goalSummaryCard.title
  }

  get canStartNowYes(): Locator {
    return this.canStartNow.yesRadio
  }

  get canStartNowNo(): Locator {
    return this.canStartNow.noRadio
  }

  get targetDateOptions(): Locator {
    return this.targetDate.options
  }

  get customTargetDateInput(): Locator {
    return this.targetDate.customDateInput
  }

  get errorSummary(): Locator {
    return this.validation.errorSummary
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
    return this.canStartNow.select(canStart)
  }

  async selectTargetDateOption(option: TargetDateOption): Promise<void> {
    return this.targetDate.selectOption(option)
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click()
  }

  async getGoalTitle(): Promise<string> {
    return this.goalSummaryCard.getTitle()
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
    return this.canStartNow.isYesChecked()
  }

  async isCanStartNowNoChecked(): Promise<boolean> {
    return this.canStartNow.isNoChecked()
  }
}
