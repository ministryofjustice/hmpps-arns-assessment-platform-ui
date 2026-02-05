import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { AssessmentInfoHelper, BackLinkHelper } from '../helpers'

export default class AddStepsPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly stepRows: Locator

  readonly addStepButton: Locator

  readonly saveAndContinueButton: Locator

  private assessmentInfo: AssessmentInfoHelper

  private backLinkHelper: BackLinkHelper

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.stepRows = page.locator('[data-qa="step-row"]')
    this.addStepButton = page.getByRole('button', { name: /add another step/i })
    this.saveAndContinueButton = page.getByRole('button', { name: /save and continue/i })
    this.assessmentInfo = new AssessmentInfoHelper(page)
    this.backLinkHelper = new BackLinkHelper(page)
  }

  get backLink(): Locator {
    return this.backLinkHelper.link
  }

  get assessmentInfoDetails(): Locator {
    return this.assessmentInfo.details
  }

  get assessmentInfoSummary(): Locator {
    return this.assessmentInfo.summary
  }

  get assessmentInfoContent(): Locator {
    return this.assessmentInfo.content
  }

  static async verifyOnPage(page: Page): Promise<AddStepsPage> {
    const addStepsPage = new AddStepsPage(page)
    await expect(addStepsPage.pageHeading).toContainText(/Add or change steps/i)
    return addStepsPage
  }

  async getStepActorSelect(index: number): Promise<Locator> {
    return this.page.locator(`#step_actor_${index}`)
  }

  async getStepDescriptionInput(index: number): Promise<Locator> {
    return this.page.locator(`#step_description_${index}`)
  }

  async getRemoveStepButton(index: number): Promise<Locator> {
    return this.page.locator(`button[name="action"][value="remove_${index}"]`)
  }

  async enterStep(index: number, actor: string, description: string): Promise<void> {
    const actorSelect = await this.getStepActorSelect(index)
    const descriptionInput = await this.getStepDescriptionInput(index)

    await actorSelect.selectOption(actor)
    await descriptionInput.fill(description)
  }

  async clickAddStep(): Promise<void> {
    await this.addStepButton.click()
  }

  async clickRemoveStep(index: number): Promise<void> {
    const removeButton = await this.getRemoveStepButton(index)
    await removeButton.click()
  }

  async clickSaveAndContinue(): Promise<void> {
    await this.saveAndContinueButton.click()
  }

  async clickBack(): Promise<void> {
    return this.backLinkHelper.click()
  }

  async expandAssessmentInfo(): Promise<void> {
    return this.assessmentInfo.expand()
  }

  async isAssessmentInfoCollapsed(): Promise<boolean> {
    return this.assessmentInfo.isCollapsed()
  }
}
