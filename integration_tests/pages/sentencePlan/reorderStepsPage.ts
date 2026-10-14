import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { getDatePlusDaysAsISO } from '../../specs/sentencePlan/sentencePlanUtils'

export default class ReorderStepsPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly saveAndContinueButton: Locator

  readonly cancelButton: Locator

  readonly backLink: Locator

  readonly goalContextInset: Locator

  readonly stepRows: Locator

  readonly columnHeaders: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.saveAndContinueButton = page.getByRole('button', { name: /save and continue/i })
    this.cancelButton = page.getByRole('button', { name: /cancel/i })
    this.backLink = page.locator('.govuk-back-link')
    this.goalContextInset = page.locator('.govuk-inset-text').filter({ hasText: 'Area of need' })
    this.stepRows = page.locator('.reorder-steps-table__data-row')
    this.columnHeaders = page.locator('.reorder-steps-table .govuk-table__head')
  }

  static async verifyOnPage(page: Page): Promise<ReorderStepsPage> {
    const reorderStepsPage = new ReorderStepsPage(page)
    await expect(reorderStepsPage.pageHeading).toContainText('Reorder steps')

    return reorderStepsPage
  }

  async getStepCount(): Promise<number> {
    return this.stepRows.count()
  }

  async getStepDescription(index: number): Promise<string> {
    const row = this.stepRows.nth(index)
    const descriptionCell = row.locator('.govuk-table__cell').nth(2)

    return (await descriptionCell.textContent())?.trim() ?? ''
  }

  async getStepStatus(index: number): Promise<string> {
    const row = this.stepRows.nth(index)
    const statusCell = row.locator('.govuk-table__cell').nth(3)

    return (await statusCell.locator('.govuk-tag').textContent())?.trim() ?? ''
  }

  async getAllStepDescriptions(): Promise<string[]> {
    const count = await this.getStepCount()
    const indices = Array.from({ length: count }, (_, i) => i)

    return Promise.all(indices.map(i => this.getStepDescription(i)))
  }

  async clickMoveUp(index: number): Promise<void> {
    const button = this.page.locator(`[data-ai-id="reorder-steps-move-up-${index}"]`)
    await button.click()
  }

  async clickMoveDown(index: number): Promise<void> {
    const button = this.page.locator(`[data-ai-id="reorder-steps-move-down-${index}"]`)
    await button.click()
  }

  async hasMoveUpButton(index: number): Promise<boolean> {
    const button = this.page.locator(`[data-ai-id="reorder-steps-move-up-${index}"]`)

    return (await button.count()) > 0
  }

  async hasMoveDownButton(index: number): Promise<boolean> {
    const button = this.page.locator(`[data-ai-id="reorder-steps-move-down-${index}"]`)

    return (await button.count()) > 0
  }

  async clickSaveAndContinue(): Promise<void> {
    await this.saveAndContinueButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click()
  }

  async clickBack(): Promise<void> {
    await this.backLink.click()
  }
}

// ---- shared goal and target date for reorder steps page tests ----
export const targetDate = getDatePlusDaysAsISO(90)
export const threeStepGoal = {
  title: 'Find stable accommodation',
  areaOfNeed: 'accommodation',
  status: 'ACTIVE' as const,
  targetDate,
  steps: [
    { actor: 'probation_practitioner', description: 'Contact housing services', status: 'NOT_STARTED' as const },
    { actor: 'person_on_probation', description: 'Register with local council', status: 'IN_PROGRESS' as const },
    { actor: 'probation_practitioner', description: 'Attend housing appointment', status: 'NOT_STARTED' as const },
  ],
}
