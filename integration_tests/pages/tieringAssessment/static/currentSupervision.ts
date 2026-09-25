import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class CurrentSupervisionPage extends TieringAssessmentPage {

  readonly currentSupervisionDay: Locator

  readonly currentSupervisionMonth: Locator

  readonly currentSupervisionYear: Locator

  constructor(page: Page) {
    super(page)
    this.currentSupervisionDay = page.getByRole('textbox', { name: 'Day' })
    this.currentSupervisionMonth = page.getByRole('textbox', { name: 'Month' })
    this.currentSupervisionYear = page.getByRole('textbox', { name: 'Year' })
  }

  async fillCurrentSupervisionDayTextbox(dd: string = '30') {
    await this.currentSupervisionDay.fill(dd)
  }

  async fillCurrentSupervisionMonthTextbox(mm: string = '06') {
    await this.currentSupervisionMonth.fill(mm)
  }

  async fillCurrentSupervisionYearTextbox(yyyy: string = '2025') {
    await this.currentSupervisionYear.fill(yyyy)
  }
}
