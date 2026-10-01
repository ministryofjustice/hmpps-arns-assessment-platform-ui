import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class SexualOffendingPage extends TieringAssessmentPage {

  readonly currentOffenceSexualYes: Locator

  readonly currentOffenceSexualNo: Locator

  readonly mostRecentSexualDay: Locator

  readonly mostRecentSexualMonth: Locator

  readonly mostRecentSexualYear: Locator

  readonly directContact: Locator

  readonly directContactChild: Locator

  readonly victimStrangerYes: Locator

  readonly victimStrangerNo: Locator

  readonly indecentImages: Locator

  readonly nonContact: Locator

  constructor(page: Page) {
    super(page)
    this.currentOffenceSexualYes = page
      .getByRole('group', { name: 'current offence have a sexual motivation?' })
      .getByLabel('Yes')
    this.currentOffenceSexualNo = page
      .getByRole('group', { name: 'current offence have a sexual motivation?' })
      .getByLabel('No')
    this.mostRecentSexualDay = page.getByRole('textbox', { name: 'Day' })
    this.mostRecentSexualMonth = page.getByRole('textbox', { name: 'Month' })
    this.mostRecentSexualYear = page.getByRole('textbox', { name: 'Year' })
    this.directContact = page.getByRole('textbox', { name: 'contact adult sexual' })
    this.directContactChild = page.getByRole('textbox', { name: 'direct contact child sexual' })
    this.victimStrangerYes = page
      .getByRole('group', { name: 'contact against a victim who was a stranger' })
      .getByLabel('Yes')
    this.victimStrangerNo = page
      .getByRole('group', { name: 'contact against a victim who was a stranger' })
      .getByLabel('No')
    this.indecentImages = page.getByRole('textbox', { name: 'indecent child image, or indirect' })
    this.nonContact = page.getByRole('textbox', { name: 'non-contact sexual' })
  }

  async clickCurrentOffenceSexualYesRadioOption() {
    await this.currentOffenceSexualYes.click()
  }

  async clickCurrentOffenceSexualNoRadioOption() {
    await this.currentOffenceSexualNo.click()
  }

  async fillMostRecentSexualDayTextbox(dd: string = '30') {
    await this.mostRecentSexualDay.fill(dd)
  }

  async fillMostRecentSexualMonthTextbox(mm: string = '06') {
    await this.mostRecentSexualMonth.fill(mm)
  }

  async fillMostRecentSexualYearTextbox(yyyy: string = '2015') {
    await this.mostRecentSexualYear.fill(yyyy)
  }

  async fillDirectContactTextbox(count: string = '1') {
    await this.directContact.fill(count)
  }

  async fillDirectContactChildTextbox(count: string = '1') {
    await this.directContactChild.fill(count)
  }

  async clickVictimStrangerYesRadioOption() {
    await this.victimStrangerYes.click()
  }

  async clickVictimStrangerNoRadioOption() {
    await this.victimStrangerNo.click()
  }

  async fillIndecentImagesTextbox(count: string = '1') {
    await this.indecentImages.fill(count)
  }

  async fillNonContactTextbox(count: string = '1') {
    await this.nonContact.fill(count)
  }
}
