import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { AssessmentInfoHelper } from '../helpers'

export default class AddStepsPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly addStepButton: Locator

  readonly saveAndContinueButton: Locator

  readonly backLink: Locator

  private assessmentInfo: AssessmentInfoHelper

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.addStepButton = page.getByRole('button', { name: /add another step/i })
    this.saveAndContinueButton = page.getByRole('button', { name: /save and continue/i })
    this.backLink = page.locator('.govuk-back-link')
    this.assessmentInfo = new AssessmentInfoHelper(page)
  }

  get assessmentInfoDetails(): Locator {
    return this.assessmentInfo.details
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
    await this.backLink.click()
  }

  async expandAssessmentInfo(): Promise<void> {
    return this.assessmentInfo.expand()
  }

  async isAssessmentInfoCollapsed(): Promise<boolean> {
    return this.assessmentInfo.isCollapsed()
  }
}
