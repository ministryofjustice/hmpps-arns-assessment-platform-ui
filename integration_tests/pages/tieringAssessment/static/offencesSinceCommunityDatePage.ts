import { expect, type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class OffencesSinceCommunityDatePage extends TieringAssessmentPage {

  readonly offencesSinceCommunityYes: Locator

  readonly recentOffenceDay: Locator

  readonly recentOffenceMonth: Locator

  readonly recentOffenceYear: Locator

  readonly offencesSinceCommunityNo: Locator

  constructor(page: Page) {
    super(page)
    this.offencesSinceCommunityYes = page.getByRole('radio', { name: 'Yes' })
    this.recentOffenceDay = page.getByRole('textbox', { name: 'Day' })
    this.recentOffenceMonth = page.getByRole('textbox', { name: 'Month' })
    this.recentOffenceYear = page.getByRole('textbox', { name: 'Year' })
    this.offencesSinceCommunityNo = page.getByRole('radio', { name: 'No' })
  }

  async checkRevealRecentOffenceDateVisible(isVisible: boolean) {
    await expect(this.recentOffenceDay).toBeVisible({ visible: isVisible })
    await expect(this.recentOffenceMonth).toBeVisible({ visible: isVisible })
    await expect(this.recentOffenceYear).toBeVisible({ visible: isVisible })
  }

  async clickOffencesSinceCommunityYesRadioOption() {
    await this.offencesSinceCommunityYes.click()
  }

  async fillRecentOffenceDayTextbox(dd: string = '30') {
    await this.recentOffenceDay.fill(dd)
  }

  async fillRecentOffenceMonthTextbox(mm: string = '06') {
    await this.recentOffenceMonth.fill(mm)
  }

  async fillRecentOffenceYearTextbox(yyyy: string = '2026') {
    await this.recentOffenceYear.fill(yyyy)
  }

  async clickOffencesSinceCommunityNoRadioOption() {
    await this.offencesSinceCommunityNo.click()
  }
}
