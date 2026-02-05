import { type Locator, type Page } from '@playwright/test'

/**
 * Helper class for the "Can start now" radio button group.
 * Used on goal creation and modification pages.
 */
export default class CanStartNowHelper {
  readonly yesRadio: Locator

  readonly noRadio: Locator

  constructor(page: Page) {
    const group = page.getByRole('group', { name: /can.*start working on this goal/i })
    this.yesRadio = group.getByRole('radio', { name: 'Yes' })
    this.noRadio = group.getByRole('radio', { name: /no.*future goal/i })
  }

  async selectYes(): Promise<void> {
    await this.yesRadio.click()
  }

  async selectNo(): Promise<void> {
    await this.noRadio.click()
  }

  async select(canStart: boolean): Promise<void> {
    if (canStart) {
      await this.selectYes()
    } else {
      await this.selectNo()
    }
  }

  async isYesChecked(): Promise<boolean> {
    return this.yesRadio.isChecked()
  }

  async isNoChecked(): Promise<boolean> {
    return this.noRadio.isChecked()
  }
}
