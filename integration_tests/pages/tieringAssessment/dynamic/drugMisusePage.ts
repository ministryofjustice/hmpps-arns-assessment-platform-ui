import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class DrugMisusePage extends TieringAssessmentPage {

  readonly everMisusedDrugsYes: Locator

  readonly everMisusedDrugsNo: Locator

  readonly everMisusedDrugsUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.everMisusedDrugsYes = page.getByRole('radio', { name: 'Yes' })
    this.everMisusedDrugsNo = page.getByRole('radio', { name: 'No', exact: true })
    this.everMisusedDrugsUnknown = page.getByRole('radio', { name: 'Unknown' })

  }

  async clickEverMisusedDrugsYesRadioOption() {
    await this.everMisusedDrugsYes.click()
  }

  async clickEverMisusedDrugsNoRadioOption() {
    await this.everMisusedDrugsNo.click()
  }

  async clickEverMisusedDrugsUnknownRadioOption() {
    await this.everMisusedDrugsUnknown.click()
  }
}
