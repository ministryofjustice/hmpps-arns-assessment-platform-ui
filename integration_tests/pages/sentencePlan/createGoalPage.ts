import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CreateGoalPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly goalTitleInput: Locator

  readonly isRelatedYes: Locator

  readonly isRelatedNo: Locator

  readonly relatedAreasCheckboxes: Locator

  readonly canStartNowYes: Locator

  readonly canStartNowNo: Locator

  readonly targetDateOptions: Locator

  readonly customTargetDateInput: Locator

  readonly addStepsButton: Locator

  readonly saveWithoutStepsButton: Locator

  readonly areaOfNeedNav: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.goalTitleInput = page.getByRole('combobox', { name: /what goal should.*try to achieve/i })
    this.isRelatedYes = page
      .getByRole('group', { name: /related to any other area/i })
      .getByRole('radio', { name: 'Yes' })
    this.isRelatedNo = page
      .getByRole('group', { name: /related to any other area/i })
      .getByRole('radio', { name: 'No' })
    this.relatedAreasCheckboxes = page.locator('[name="related_areas_of_need"]')
    this.canStartNowYes = page
      .getByRole('group', { name: /can.*start working on this goal/i })
      .getByRole('radio', { name: 'Yes' })
    this.canStartNowNo = page
      .getByRole('group', { name: /can.*start working on this goal/i })
      .getByRole('radio', { name: /no.*future goal/i })
    this.targetDateOptions = page.locator('[name="target_date_option"]')
    this.customTargetDateInput = page.locator('#custom_target_date')
    this.addStepsButton = page.getByRole('button', { name: /add steps/i })
    this.saveWithoutStepsButton = page.getByRole('button', { name: /save without steps/i })
    this.areaOfNeedNav = page.locator('.moj-side-navigation')
  }

  static async verifyOnPage(page: Page): Promise<CreateGoalPage> {
    const createGoalPage = new CreateGoalPage(page)
    await expect(createGoalPage.pageHeading).toContainText(/create a goal/i)
    return createGoalPage
  }

  async enterGoalTitle(title: string): Promise<void> {
    await this.goalTitleInput.fill(title)
  }

  async selectIsRelated(isRelated: boolean): Promise<void> {
    if (isRelated) {
      await this.isRelatedYes.click()
    } else {
      await this.isRelatedNo.click()
    }
  }

  async selectRelatedArea(areaSlug: string): Promise<void> {
    await this.page.locator(`[name="related_areas_of_need"][value="${areaSlug}"]`).click()
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

  async clickAddSteps(): Promise<void> {
    await this.addStepsButton.click()
  }

  async clickSaveWithoutSteps(): Promise<void> {
    await this.saveWithoutStepsButton.click()
  }
}
