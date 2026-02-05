import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import {
  AssessmentInfoHelper,
  BackLinkHelper,
  ValidationHelper,
  TargetDateHelper,
  type TargetDateOption,
} from '../helpers'

export default class ChangeGoalPage extends AbstractPage {
  readonly header: Locator

  readonly goalTitleAutocomplete: Locator

  readonly goalTitleInput: Locator

  readonly isRelatedYes: Locator

  readonly isRelatedNo: Locator

  readonly canStartNowYes: Locator

  readonly canStartNowNo: Locator

  readonly saveGoalButton: Locator

  private assessmentInfo: AssessmentInfoHelper

  private backLinkHelper: BackLinkHelper

  private validation: ValidationHelper

  private targetDate: TargetDateHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalTitleAutocomplete = page.locator('accessible-autocomplete-wrapper[data-initialized="true"]')
    this.goalTitleInput = this.goalTitleAutocomplete.getByRole('combobox')
    this.isRelatedYes = page.locator('input[name="is_related_to_other_areas"][value="yes"]')
    this.isRelatedNo = page.locator('input[name="is_related_to_other_areas"][value="no"]')
    this.canStartNowYes = page.locator('input[name="can_start_now"][value="yes"]')
    this.canStartNowNo = page.locator('input[name="can_start_now"][value="no"]')
    this.saveGoalButton = page.getByRole('button', { name: 'Save goal' })
    this.assessmentInfo = new AssessmentInfoHelper(page)
    this.backLinkHelper = new BackLinkHelper(page)
    this.validation = new ValidationHelper(page)
    this.targetDate = new TargetDateHelper(page)
  }

  get targetDate3Months(): Locator {
    return this.targetDate.threeMonths
  }

  get targetDate6Months(): Locator {
    return this.targetDate.sixMonths
  }

  get targetDate12Months(): Locator {
    return this.targetDate.twelveMonths
  }

  get targetDateCustom(): Locator {
    return this.targetDate.custom
  }

  get customDateInput(): Locator {
    return this.targetDate.customDateInput
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

  static async verifyOnPage(page: Page): Promise<ChangeGoalPage> {
    const changeGoalPage = new ChangeGoalPage(page)
    await expect(changeGoalPage.header).toContainText('Change goal')
    return changeGoalPage
  }

  async getGoalTitle(): Promise<string> {
    return this.goalTitleInput.inputValue()
  }

  async setGoalTitle(title: string): Promise<void> {
    await this.goalTitleInput.clear()
    await this.goalTitleInput.fill(title)
  }

  async selectIsRelatedToOtherAreas(isRelated: boolean): Promise<void> {
    if (isRelated) {
      await this.isRelatedYes.check()
    } else {
      await this.isRelatedNo.check()
    }
  }

  async selectRelatedArea(areaSlug: string): Promise<void> {
    const checkbox = this.page.locator(`input[name="related_areas_of_need"][value="${areaSlug}"]`)
    await checkbox.check()
  }

  async unselectRelatedArea(areaSlug: string): Promise<void> {
    const checkbox = this.page.locator(`input[name="related_areas_of_need"][value="${areaSlug}"]`)
    await checkbox.uncheck()
  }

  async selectCanStartNow(canStart: boolean): Promise<void> {
    if (canStart) {
      await this.canStartNowYes.check()
    } else {
      await this.canStartNowNo.check()
    }
  }

  async selectTargetDateOption(option: TargetDateOption): Promise<void> {
    return this.targetDate.selectOption(option)
  }

  async setCustomTargetDate(date: string): Promise<void> {
    return this.targetDate.setCustomDate(date)
  }

  async saveGoal(): Promise<void> {
    await this.saveGoalButton.click()
  }

  async isCanStartNowSelected(): Promise<boolean> {
    return this.canStartNowYes.isChecked()
  }

  async isCanStartNowFutureSelected(): Promise<boolean> {
    return this.canStartNowNo.isChecked()
  }

  async getSelectedTargetDateOption(): Promise<string | null> {
    return this.targetDate.getSelectedOption()
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    return this.validation.hasFieldError(fieldName)
  }

  async getValidationErrorMessage(fieldName: string): Promise<string> {
    return this.validation.getFieldErrorMessage(fieldName)
  }

  async clickBackLink(): Promise<void> {
    return this.backLinkHelper.click()
  }

  async expandAssessmentInfo(): Promise<void> {
    return this.assessmentInfo.expand()
  }

  async isAssessmentInfoCollapsed(): Promise<boolean> {
    return this.assessmentInfo.isCollapsed()
  }
}
