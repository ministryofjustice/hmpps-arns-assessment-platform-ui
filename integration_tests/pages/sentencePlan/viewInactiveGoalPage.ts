import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ViewInactiveGoalPage extends AbstractPage {
  readonly header: Locator

  readonly goalHeading: Locator

  readonly caption: Locator

  readonly statusText: Locator

  readonly stepsTable: Locator

  readonly viewAllNotesDetails: Locator

  readonly addToPlanButton: Locator

  readonly backLink: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalHeading = page.locator('h2')
    this.caption = page.locator('.govuk-caption-l')
    this.statusText = page.locator('.govuk-body').first()
    this.stepsTable = page.locator('.govuk-table')
    this.viewAllNotesDetails = page.locator('.govuk-details')
    this.addToPlanButton = page.getByRole('button', { name: 'Add to plan' })
    this.backLink = page.locator('.govuk-back-link')
  }

  static async verifyOnPage(page: Page): Promise<ViewInactiveGoalPage> {
    const viewInactiveGoalPage = new ViewInactiveGoalPage(page)
    await expect(viewInactiveGoalPage.header).toContainText('View goal details')
    return viewInactiveGoalPage
  }

  async getHeaderText(): Promise<string> {
    return (await this.header.textContent()) ?? ''
  }

  async getGoalHeading(): Promise<string> {
    return (await this.goalHeading.textContent()) ?? ''
  }

  async getCaptionText(): Promise<string> {
    return (await this.caption.textContent()) ?? ''
  }

  async getStatusText(): Promise<string> {
    return (await this.statusText.textContent()) ?? ''
  }

  async isStepsTableVisible(): Promise<boolean> {
    return this.stepsTable.isVisible()
  }

  async getStepCount(): Promise<number> {
    const rows = this.stepsTable.locator('tbody tr')
    return rows.count()
  }

  async getStepDescription(index: number): Promise<string> {
    const row = this.stepsTable.locator('tbody tr').nth(index)
    const descriptionCell = row.locator('td').nth(1)
    return (await descriptionCell.textContent()) ?? ''
  }

  async isViewAllNotesVisible(): Promise<boolean> {
    return this.viewAllNotesDetails.isVisible()
  }

  async expandViewAllNotes(): Promise<void> {
    const summary = this.viewAllNotesDetails.locator('summary')
    await summary.click()
  }

  async getNoteCount(): Promise<number> {
    await this.expandViewAllNotes()
    const notes = this.viewAllNotesDetails.locator('.goal-note')
    return notes.count()
  }

  async getNoteText(index: number): Promise<string> {
    await this.expandViewAllNotes()
    const note = this.viewAllNotesDetails.locator('.goal-note').nth(index)
    return (await note.textContent()) ?? ''
  }

  async isAddToPlanButtonVisible(): Promise<boolean> {
    return this.addToPlanButton.isVisible()
  }

  async clickBackLink(): Promise<void> {
    await this.backLink.click()
  }

  async clickAddToPlan(): Promise<void> {
    await this.addToPlanButton.click()
  }
}
