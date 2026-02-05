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

  readonly threeMonths: Locator

  private customDateInput: Locator

  constructor(page: Page) {
    this.page = page
    this.options = page.locator('[name="target_date_option"]')
    this.threeMonths = page.locator('input[name="target_date_option"][value="date_in_3_months"]')
    this.customDateInput = page.locator('#custom_target_date')
  }

  async selectOption(option: TargetDateOption): Promise<void> {
    const formValue = OPTION_TO_FORM_VALUE[option]
    const radio = this.page.locator(`[name="target_date_option"][value="${formValue}"]`)
    await radio.waitFor({ state: 'visible' })
    await radio.click()
  }

  async setCustomDate(date: string): Promise<void> {
    await this.customDateInput.fill(date)
  }
}
