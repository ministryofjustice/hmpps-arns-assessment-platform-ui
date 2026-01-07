import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ChangeGoalPage extends AbstractPage {
  readonly header: Locator

  readonly goalTitleInput: Locator

  readonly isRelatedYes: Locator

  readonly isRelatedNo: Locator

  readonly canStartNowYes: Locator

  readonly canStartNowNo: Locator

  readonly targetDate3Months: Locator

  readonly targetDate6Months: Locator

  readonly targetDate12Months: Locator

  readonly targetDateCustom: Locator

  readonly customDateInput: Locator

  readonly saveGoalButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.goalTitleInput = page.locator('#goal_title')
    this.isRelatedYes = page.locator('input[name="is_related_to_other_areas"][value="yes"]')
    this.isRelatedNo = page.locator('input[name="is_related_to_other_areas"][value="no"]')
    this.canStartNowYes = page.locator('input[name="can_start_now"][value="yes"]')
    this.canStartNowNo = page.locator('input[name="can_start_now"][value="no"]')
    this.targetDate3Months = page.locator('input[name="target_date_option"][value="date_in_3_months"]')
    this.targetDate6Months = page.locator('input[name="target_date_option"][value="date_in_6_months"]')
    this.targetDate12Months = page.locator('input[name="target_date_option"][value="date_in_12_months"]')
    this.targetDateCustom = page.locator('input[name="target_date_option"][value="set_another_date"]')
    this.customDateInput = page.locator('#custom_target_date')
    this.saveGoalButton = page.getByRole('button', { name: 'Save goal' })
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

  async selectTargetDateOption(option: '3_months' | '6_months' | '12_months' | 'custom'): Promise<void> {
    switch (option) {
      case '3_months':
        await this.targetDate3Months.check()
        break
      case '6_months':
        await this.targetDate6Months.check()
        break
      case '12_months':
        await this.targetDate12Months.check()
        break
      case 'custom':
        await this.targetDateCustom.check()
        break
      default:
        throw new Error(`Invalid target date option. Use one of: '3_months', '6_months', '12_months', or 'custom'`)
    }
  }

  async setCustomTargetDate(date: string): Promise<void> {
    await this.customDateInput.fill(date)
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
    let result: string | null = null

    if (await this.targetDate3Months.isChecked()) {
      result = '3_months'
    } else if (await this.targetDate6Months.isChecked()) {
      result = '6_months'
    } else if (await this.targetDate12Months.isChecked()) {
      result = '12_months'
    } else if (await this.targetDateCustom.isChecked()) {
      result = 'custom'
    }

    return result
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    const errorMessage = this.page.locator(`#${fieldName}-error`)
    return errorMessage.isVisible()
  }

  async getValidationErrorMessage(fieldName: string): Promise<string> {
    const errorMessage = this.page.locator(`#${fieldName}-error`)
    return (await errorMessage.textContent()) ?? ''
  }
}
