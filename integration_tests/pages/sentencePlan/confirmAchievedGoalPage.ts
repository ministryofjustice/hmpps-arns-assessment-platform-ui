import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { GoalSummaryCardHelper } from '../helpers'

export default class ConfirmAchievedGoalPage extends AbstractPage {
  readonly header: Locator

  readonly howHelpedTextarea: Locator

  readonly confirmButton: Locator

  readonly cancelButton: Locator

  private goalSummaryCard: GoalSummaryCardHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.howHelpedTextarea = page.locator('#how_helped')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cancelButton = page.getByRole('button', { name: 'Do not mark as achieved' })
    this.goalSummaryCard = new GoalSummaryCardHelper(page)
  }

  get goalCard(): Locator {
    return this.goalSummaryCard.card
  }

  get goalTitle(): Locator {
    return this.goalSummaryCard.title
  }

  static async verifyOnPage(page: Page): Promise<ConfirmAchievedGoalPage> {
    const confirmIfAchievedPage = new ConfirmAchievedGoalPage(page)
    await expect(confirmIfAchievedPage.header).toContainText('has achieved this goal')
    return confirmIfAchievedPage
  }

  async enterHowHelpedNote(note: string): Promise<void> {
    await this.howHelpedTextarea.fill(note)
  }

  async getHowHelpedNote(): Promise<string> {
    return this.howHelpedTextarea.inputValue()
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
}
