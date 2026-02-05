import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { GoalSummaryCardHelper } from '../helpers'

export default class ConfirmIfAchievedPage extends AbstractPage {
  readonly header: Locator

  readonly allStepsCompletedMessage: Locator

  readonly hasAchievedGoalFieldset: Locator

  readonly yesRadio: Locator

  readonly noRadio: Locator

  readonly howHelpedTextarea: Locator

  readonly saveAndContinueButton: Locator

  readonly hasAchievedGoalError: Locator

  private goalSummaryCard: GoalSummaryCardHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.allStepsCompletedMessage = page.locator('p.govuk-body').filter({ hasText: 'All steps have been completed' })
    this.hasAchievedGoalFieldset = page.locator('fieldset').filter({ hasText: 'achieved this goal?' })
    this.yesRadio = page.locator('input[name="has_achieved_goal"][value="yes"]')
    this.noRadio = page.locator('input[name="has_achieved_goal"][value="no"]')
    this.howHelpedTextarea = page.locator('#how_helped')
    this.saveAndContinueButton = page.getByRole('button', { name: 'Save and continue' })
    this.hasAchievedGoalError = page.locator('#has_achieved_goal-error')
    this.goalSummaryCard = new GoalSummaryCardHelper(page)
  }

  get goalCard(): Locator {
    return this.goalSummaryCard.card
  }

  get goalTitle(): Locator {
    return this.goalSummaryCard.title
  }

  static async verifyOnPage(page: Page): Promise<ConfirmIfAchievedPage> {
    const confirmIfAchievedPage = new ConfirmIfAchievedPage(page)
    await expect(confirmIfAchievedPage.header).toContainText('Confirm if')
    await expect(confirmIfAchievedPage.header).toContainText('has achieved this goal')
    return confirmIfAchievedPage
  }

  async selectYes(): Promise<void> {
    await this.yesRadio.click()
  }

  async selectNo(): Promise<void> {
    await this.noRadio.click()
  }

  async enterHowHelpedNote(note: string): Promise<void> {
    await this.howHelpedTextarea.fill(note)
  }

  async clickSaveAndContinue(): Promise<void> {
    await this.saveAndContinueButton.click()
  }

  async getGoalTitle(): Promise<string> {
    return this.goalSummaryCard.getTitle()
  }

  async isYesSelected(): Promise<boolean> {
    return this.yesRadio.isChecked()
  }

  async isNoSelected(): Promise<boolean> {
    return this.noRadio.isChecked()
  }

  async isHowHelpedTextareaVisible(): Promise<boolean> {
    return this.howHelpedTextarea.isVisible()
  }

  async getInlineErrorText(): Promise<string> {
    return (await this.hasAchievedGoalError.textContent()) ?? ''
  }

  async hasInlineError(): Promise<boolean> {
    return this.hasAchievedGoalError.isVisible()
  }
}
