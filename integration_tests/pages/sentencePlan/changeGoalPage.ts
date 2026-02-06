import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import {
  AssessmentInfoHelper,
  CanStartNowHelper,
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

  readonly saveGoalButton: Locator

  readonly backLink: Locator

  private assessmentInfo: AssessmentInfoHelper

  private canStartNow: CanStartNowHelper

  private validation: ValidationHelper

  private targetDate: TargetDateHelper

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalTitleAutocomplete = page.locator('accessible-autocomplete-wrapper[data-initialized="true"]')
    this.goalTitleInput = this.goalTitleAutocomplete.getByRole('combobox')
    this.isRelatedYes = page.locator('input[name="is_related_to_other_areas"][value="yes"]')
    this.isRelatedNo = page.locator('input[name="is_related_to_other_areas"][value="no"]')
    this.saveGoalButton = page.getByRole('button', { name: 'Save goal' })
    this.backLink = page.locator('.govuk-back-link')
    this.assessmentInfo = new AssessmentInfoHelper(page)
    this.canStartNow = new CanStartNowHelper(page)
    this.validation = new ValidationHelper(page)
    this.targetDate = new TargetDateHelper(page)
  }

  get targetDate3Months(): Locator {
    return this.targetDate.threeMonths
  }

  get assessmentInfoDetails(): Locator {
    return this.assessmentInfo.details
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

  async selectCanStartNow(canStart: boolean): Promise<void> {
    return this.canStartNow.select(canStart)
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
    return this.canStartNow.isYesChecked()
  }

  async isCanStartNowFutureSelected(): Promise<boolean> {
    return this.canStartNow.isNoChecked()
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    return this.validation.hasFieldError(fieldName)
  }

  async clickBackLink(): Promise<void> {
    await this.backLink.click()
  }

  async expandAssessmentInfo(): Promise<void> {
    return this.assessmentInfo.expand()
  }

  async isAssessmentInfoCollapsed(): Promise<boolean> {
    return this.assessmentInfo.isCollapsed()
  }
}
