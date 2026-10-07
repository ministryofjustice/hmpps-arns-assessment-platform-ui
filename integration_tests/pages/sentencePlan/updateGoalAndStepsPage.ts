import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class UpdateGoalAndStepsPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly goalContextInset: Locator

  readonly goalTitle: Locator

  readonly targetDateMessage: Locator

  readonly futureGoalMessage: Locator

  readonly changeGoalDetailsLink: Locator

  readonly stepsTable: Locator

  readonly noStepsMessage: Locator

  readonly addStepsLink: Locator

  readonly addOrUpdateStepsLink: Locator

  readonly progressNotesTextarea: Locator

  readonly progressNotesLabel: Locator

  readonly progressNotesHint: Locator

  readonly viewAllNotesDetails: Locator

  readonly viewAllNotesSummary: Locator

  readonly noNotesMessage: Locator

  readonly saveGoalAndStepsButton: Locator

  readonly markAsAchievedButton: Locator

  readonly removeGoalLink: Locator

  readonly backLink: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.goalContextInset = page.locator('.guidance-panel')
    this.goalTitle = this.goalContextInset.locator('p').filter({ hasText: 'Goal:' })
    this.targetDateMessage = this.goalContextInset.locator('p').filter({ hasText: 'Aim to achieve this by' })
    this.futureGoalMessage = this.goalContextInset.locator('p').filter({ hasText: 'This is a future goal' })
    this.changeGoalDetailsLink = this.goalContextInset.getByRole('link', { name: 'Update goal details' })
    this.stepsTable = page.locator('table.goal-summary-card__steps')
    this.noStepsMessage = page.locator('.goal-summary-card__steps--empty-no-shadow')
    this.addStepsLink = page
      .locator('.goal-summary-card__steps--empty-no-shadow')
      .getByRole('link', { name: 'Add steps' })
    this.addOrUpdateStepsLink = page.getByRole('link', { name: 'Add or update steps' })
    this.progressNotesTextarea = page.locator('#progress_notes')
    this.progressNotesLabel = page.locator('label[for="progress_notes"]')
    this.progressNotesHint = page.locator('#progress_notes-hint')
    this.viewAllNotesDetails = page.locator('[data-qa="main-form"] details.govuk-details')
    this.viewAllNotesSummary = page.locator('[data-qa="main-form"] summary.govuk-details__summary')
    this.noNotesMessage = page
      .locator('[data-qa="main-form"] .govuk-details__text')
      .getByText('There are no notes on this goal yet.')
    this.saveGoalAndStepsButton = page.getByRole('button', { name: 'Save goal and steps' })
    this.markAsAchievedButton = page.getByRole('button', { name: 'Mark as achieved' })
    this.removeGoalLink = page.getByRole('link', { name: 'Remove goal from plan' })
    this.backLink = page.locator('.govuk-back-link')
  }

  static async verifyOnPage(page: Page): Promise<UpdateGoalAndStepsPage> {
    const updateGoalAndStepsPage = new UpdateGoalAndStepsPage(page)
    await expect(updateGoalAndStepsPage.pageHeading).toContainText('Update goal and steps')
    return updateGoalAndStepsPage
  }

  async getGoalContextInsetText(): Promise<string> {
    return (await this.goalContextInset.textContent()) ?? ''
  }

  async getGoalTitleText(): Promise<string> {
    return (await this.goalTitle.textContent()) ?? ''
  }

  async getTargetDateMessage(): Promise<string> {
    return (await this.targetDateMessage.textContent()) ?? ''
  }

  async getFutureGoalMessage(): Promise<string> {
    return (await this.futureGoalMessage.textContent()) ?? ''
  }

  async clickChangeGoalDetails(): Promise<void> {
    await this.changeGoalDetailsLink.click()
  }

  async clickAddSteps(): Promise<void> {
    await this.addStepsLink.click()
  }

  async clickAddOrChangeSteps(): Promise<void> {
    await this.addOrUpdateStepsLink.click()
  }

  async getStepCount(): Promise<number> {
    const rows = this.stepsTable.locator('tbody tr')
    return rows.count()
  }

  async getStepDescriptionByIndex(index: number): Promise<string> {
    const row = this.stepsTable.locator('tbody tr').nth(index)
    const descriptionCell = row.locator('td').nth(1)
    return (await descriptionCell.textContent()) ?? ''
  }

  async getStepStatusByIndex(index: number): Promise<string> {
    const select = this.page.locator(`select[name="step_status_${index}"]`)
    return select.inputValue()
  }

  async setStepStatusByIndex(index: number, status: string): Promise<void> {
    const select = this.page.locator(`select[name="step_status_${index}"]`)
    await select.selectOption(status)
  }

  async enterProgressNotes(notes: string): Promise<void> {
    await this.progressNotesTextarea.fill(notes)
  }

  async getProgressNotesValue(): Promise<string> {
    return this.progressNotesTextarea.inputValue()
  }

  async getProgressNotesLabelText(): Promise<string> {
    return (await this.progressNotesLabel.textContent()) ?? ''
  }

  async getProgressNotesHintText(): Promise<string> {
    return (await this.progressNotesHint.textContent()) ?? ''
  }

  async expandViewAllNotes(): Promise<void> {
    await this.viewAllNotesSummary.click()
  }

  async isViewAllNotesExpanded(): Promise<boolean> {
    const isOpen = await this.viewAllNotesDetails.getAttribute('open')
    return isOpen !== null
  }

  async getNotesContent(): Promise<string> {
    const content = this.page.locator('[data-qa="main-form"] .govuk-details__text')
    return (await content.textContent()) ?? ''
  }

  async clickSaveGoalAndSteps(): Promise<void> {
    await this.saveGoalAndStepsButton.click()
  }

  async clickMarkAsAchieved(): Promise<void> {
    await this.markAsAchievedButton.click()
  }

  async clickRemoveGoal(): Promise<void> {
    await this.removeGoalLink.click()
  }

  async clickBackLink(): Promise<void> {
    await this.backLink.click()
  }

  async hasStepsTable(): Promise<boolean> {
    return this.stepsTable.isVisible()
  }

  async hasNoStepsMessage(): Promise<boolean> {
    return this.noStepsMessage.isVisible()
  }
}
