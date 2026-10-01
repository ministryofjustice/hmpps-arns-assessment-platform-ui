import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../../abstractPage'
import { tieringAssessmentV1URLs } from '../../../specs/tieringAssessment/tieringAssessmentUtils'

export default class StartTieringAssessmentPage extends AbstractPage {

  readonly forename: Locator

  readonly genderMale: Locator

  readonly genderFemale: Locator

  readonly dobDay: Locator

  readonly dobMonth: Locator

  readonly dobYear: Locator

  readonly dateOfConvictionDay: Locator

  readonly dateOfConvictionMonth: Locator

  readonly dateOfConvictionYear: Locator

  readonly supervisionCustody: Locator

  readonly supervisionCommunity: Locator

  readonly supervisionRemand: Locator

  readonly offenceCode: Locator

  readonly continue: Locator

  constructor(page: Page) {
    super(page)
    this.forename = page.getByRole('textbox', { name: 'Forename' })
    this.genderMale = page.getByRole('radio', { name: 'Male', exact: true })
    this.genderFemale = page.getByRole('radio', { name: 'Female' })
    this.dobDay = page.getByRole('group', { name: 'Date of birth' }).getByLabel('Day')
    this.dobMonth = page.getByRole('group', { name: 'Date of birth' }).getByLabel('Month')
    this.dobYear = page.getByRole('group', { name: 'Date of birth' }).getByLabel('Year')
    this.dateOfConvictionDay = page.getByRole('group', { name: 'Date of current conviction' }).getByLabel('Day')
    this.dateOfConvictionMonth = page.getByRole('group', { name: 'Date of current conviction' }).getByLabel('Month')
    this.dateOfConvictionYear = page.getByRole('group', { name: 'Date of current conviction' }).getByLabel('Year')
    this.supervisionCustody = page.getByRole('radio', { name: 'Custody' })
    this.supervisionCommunity = page.getByRole('radio', { name: 'Community' })
    this.supervisionRemand = page.getByRole('radio', { name: 'Remand' })
    this.offenceCode = page.getByRole('textbox', { name: 'Offence code' })
    this.continue = page.getByRole('button', { name: 'Continue' })
  }

  async checkStartPageLoaded() {
    await expect(this.page).toHaveURL(tieringAssessmentV1URLs.START_TIERING_ASSESSMENT)
  }

  async fillForenameTextbox(forename: string = 'Charles') {
    await this.forename.fill(forename)
  }

  async clickMaleRadioOption() {
    await this.genderMale.click()
  }

  async clickFemaleRadioOption() {
    await this.genderFemale.click()
  }

  async fillDobDayTextbox(dd: string = '30') {
    await this.dobDay.fill(dd)
  }

  async fillDobMonthTextbox(mm: string = '06') {
    await this.dobMonth.fill(mm)
  }

  async fillDobYearTextbox(yyyy: string = '1975') {
    await this.dobYear.fill(yyyy)
  }

  async fillDateOfConvictionDayTextbox(dd: string = '30') {
    await this.dateOfConvictionDay.fill(dd)
  }

  async fillDateOfConvictionMonthTextbox(mm: string = '06') {
    await this.dateOfConvictionMonth.fill(mm)
  }

  async fillDateOfConvictionYearTextbox(yyyy: string = '2020') {
    await this.dateOfConvictionYear.fill(yyyy)
  }

  async clickSupervisionCustodyRadioOption() {
    await this.supervisionCustody.click()
  }

  async clickSupervisionCommunityRadioOption() {
    await this.supervisionCommunity.click()
  }

  async clickSupervisionRemandRadioOption() {
    await this.supervisionRemand.click()
  }

  async fillOffenceCodeTextbox(offenceCode: string = '00404') {
    await this.offenceCode.fill(offenceCode)
  }

  async clickContinue() {
    await this.continue.click()
  }

}
