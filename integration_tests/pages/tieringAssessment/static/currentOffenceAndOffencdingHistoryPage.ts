import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class CurrentOffenceAndOffencdingHistoryPage extends TieringAssessmentPage {

  readonly firstSanctionDay: Locator

  readonly firstSanctionMonth: Locator

  readonly firstSanctionYear: Locator

  readonly totalSanctions: Locator

  readonly violentSanctions: Locator

  readonly sexualSanctionsYes: Locator

  readonly sexualSanctionsNo: Locator

  constructor(page: Page) {
    super(page)
    this.firstSanctionDay = page.getByRole('textbox', { name: 'Day' })
    this.firstSanctionMonth = page.getByRole('textbox', { name: 'Month' })
    this.firstSanctionYear = page.getByRole('textbox', { name: 'Year' })
    this.totalSanctions = page.getByRole('textbox', { name: 'How many sanctions does' })
    this.violentSanctions = page.getByRole('textbox', { name: 'How many of' })
    this.sexualSanctionsYes = page.getByRole('radio', { name: 'Yes' })
    this.sexualSanctionsNo = page.getByRole('radio', { name: 'No' })
  }

  async fillFirstSanctionDayTextbox(dd: string = '30') {
    await this.firstSanctionDay.fill(dd)
  }

  async fillFirstSanctionMonthTextbox(mm: string = '06') {
    await this.firstSanctionMonth.fill(mm)
  }

  async fillFirstSanctionYearTextbox(yyyy: string = '1990') {
    await this.firstSanctionYear.fill(yyyy)
  }

  async fillTotalSanctionsTextbox(count: string = '8') {
    await this.totalSanctions.fill(count)
  }

  async fillViolentSanctionsTextbox(count: string = '5') {
    await this.violentSanctions.fill(count)
  }

  async clickSexualSanctionsYesRadioOption() {
    await this.sexualSanctionsYes.click()
  }

  async clickSexualSanctionsNoRadioOption() {
    await this.sexualSanctionsNo.click()
  }
}
