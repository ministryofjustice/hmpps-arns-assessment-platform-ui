import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class EverDrunkAlcoholPage extends TieringAssessmentPage {

  readonly everDrunkAlcoholYesLast3Months: Locator

  readonly everDrunkAlcoholYesMoreThan3MonthsAgo: Locator

  readonly everDrunkAlcoholNo: Locator

  readonly everDrunkAlcoholUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.everDrunkAlcoholYesLast3Months = page.getByRole('radio', { name: 'Yes, including in the last 3' })
    this.everDrunkAlcoholYesMoreThan3MonthsAgo = page.getByRole('radio', { name: 'Yes, but not in the last 3' })
    this.everDrunkAlcoholNo = page.getByRole('radio', { name: 'No', exact: true })
    this.everDrunkAlcoholUnknown = page.getByRole('radio', { name: 'Unknown' })
  }

  async clickEverDrunkAlcoholYesLast3MonthsRadioOption() {
    await this.everDrunkAlcoholYesLast3Months.click()
  }

  async clickEverDrunkAlcoholYesMoreThan3MonthsAgoRadioOption() {
    await this.everDrunkAlcoholYesMoreThan3MonthsAgo.click()
  }

  async clickEverDrunkAlcoholNoRadioOption() {
    await this.everDrunkAlcoholNo.click()
  }

  async clickEverDrunkAlcoholUnknownRadioOption() {
    await this.everDrunkAlcoholUnknown.click()
  }
}
