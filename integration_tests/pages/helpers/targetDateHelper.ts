import { type Locator, type Page } from '@playwright/test'

/** Valid target date option values */
export type TargetDateOption = '3_months' | '6_months' | '12_months' | 'custom'

/** Maps user-friendly option names to form field values */
const OPTION_TO_FORM_VALUE: Record<TargetDateOption, string> = {
  '3_months': 'date_in_3_months',
  '6_months': 'date_in_6_months',
  '12_months': 'date_in_12_months',
  custom: 'set_another_date',
}

/**
 * Helper class for target date selection radio buttons and custom date input.
 * Used on goal creation and modification pages.
 */
export default class TargetDateHelper {
  private page: Page

  readonly options: Locator

  readonly customDateInput: Locator

  readonly threeMonths: Locator

  readonly sixMonths: Locator

  readonly twelveMonths: Locator

  readonly custom: Locator

  constructor(page: Page) {
    this.page = page
    this.options = page.locator('[name="target_date_option"]')
    this.customDateInput = page.locator('#custom_target_date')
    this.threeMonths = page.locator('input[name="target_date_option"][value="date_in_3_months"]')
    this.sixMonths = page.locator('input[name="target_date_option"][value="date_in_6_months"]')
    this.twelveMonths = page.locator('input[name="target_date_option"][value="date_in_12_months"]')
    this.custom = page.locator('input[name="target_date_option"][value="set_another_date"]')
  }

  async selectOption(option: TargetDateOption): Promise<void> {
    const formValue = OPTION_TO_FORM_VALUE[option]
    const radio = this.page.locator(`[name="target_date_option"][value="${formValue}"]`)
    await radio.waitFor({ state: 'visible' })
    await radio.click()
  }

  async selectThreeMonths(): Promise<void> {
    await this.threeMonths.check()
  }

  async selectSixMonths(): Promise<void> {
    await this.sixMonths.check()
  }

  async selectTwelveMonths(): Promise<void> {
    await this.twelveMonths.check()
  }

  async selectCustom(): Promise<void> {
    await this.custom.check()
  }

  async setCustomDate(date: string): Promise<void> {
    await this.customDateInput.fill(date)
  }

  async getSelectedOption(): Promise<TargetDateOption | null> {
    const [is3Months, is6Months, is12Months, isCustom] = await Promise.all([
      this.threeMonths.isChecked(),
      this.sixMonths.isChecked(),
      this.twelveMonths.isChecked(),
      this.custom.isChecked(),
    ])

    if (is3Months) return '3_months'
    if (is6Months) return '6_months'
    if (is12Months) return '12_months'
    if (isCustom) return 'custom'
    return null
  }
}
