import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class OffenceAnalysisPage extends TieringAssessmentPage {

  readonly currentOffenceArson: Locator

  readonly currentOffenceDomesticAbuse: Locator

  readonly currentOffenceExcessiveViolence: Locator

  readonly currentOffenceHatedGroup: Locator

  readonly currentOffenceChildViolence: Locator

  readonly currentOffenceSexual: Locator

  readonly currentOffenceStalking: Locator

  readonly currentOffenceWeaponViolence: Locator

  readonly currentOffenceWeapon: Locator

  readonly currentOffenceNone: Locator

  readonly domesticViolenceYes: Locator

  readonly domesticViolenceYesAgainstFamily: Locator

  readonly domesticViolenceYesAgainstIntimate: Locator

  readonly domesticViolenceYesAgainstBoth: Locator

  readonly domesticViolenceNo: Locator

  readonly domesticViolenceUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.currentOffenceArson = page.getByRole('checkbox', { name: 'Arson' })
    this.currentOffenceDomesticAbuse = page.getByRole('checkbox', { name: 'Domestic abuse' })
    this.currentOffenceExcessiveViolence = page.getByRole('checkbox', { name: 'Excessive violence or' })
    this.currentOffenceHatedGroup = page.getByRole('checkbox', { name: 'Hatred of identifiable groups' })
    this.currentOffenceChildViolence = page.getByRole('checkbox', { name: 'Physical violence against a' })
    this.currentOffenceSexual = page.getByRole('checkbox', { name: 'Sexual element' })
    this.currentOffenceStalking = page.getByRole('checkbox', { name: 'Stalking element' })
    this.currentOffenceWeaponViolence = page.getByRole('checkbox', { name: 'Violent or threat of violence' })
    this.currentOffenceWeapon = page.getByRole('checkbox', { name: 'Weapon', exact: true })
    this.currentOffenceNone = page.getByRole('checkbox', { name: 'None of these elements' })
    this.domesticViolenceYes = page.getByRole('radio', { name: 'Yes' })
    this.domesticViolenceYesAgainstFamily = page.getByRole('radio', { name: 'Family member', exact: true })
    this.domesticViolenceYesAgainstIntimate = page.getByRole('radio', { name: 'Intimate partner', exact: true })
    this.domesticViolenceYesAgainstBoth = page.getByRole('radio', { name: 'Family member and intimate' })
    this.domesticViolenceNo = page.getByRole('radio', { name: 'No', exact: true })
    this.domesticViolenceUnknown = page.getByRole('radio', { name: 'Unknown' })
  }

  async clickCurrentOffenceArsonCheckboxOption() {
    await this.currentOffenceArson.click()
  }

  async clickCurrentOffenceDomesticAbuseCheckboxOption() {
    await this.currentOffenceDomesticAbuse.click()
  }

  async clickCurrentOffenceExcessiveViolenceCheckboxOption() {
    await this.currentOffenceExcessiveViolence.click()
  }

  async clickCurrentOffenceHatedGroupCheckboxOption() {
    await this.currentOffenceHatedGroup.click()
  }

  async clickCurrentOffenceChildViolenceCheckboxOption() {
    await this.currentOffenceChildViolence.click()
  }

  async clickCurrentOffenceSexualCheckboxOption() {
    await this.currentOffenceSexual.click()
  }

  async clickCurrentOffenceStalkingCheckboxOption() {
    await this.currentOffenceStalking.click()
  }

  async clickCurrentOffenceWeaponViolenceCheckboxOption() {
    await this.currentOffenceWeaponViolence.click()
  }

  async clickCurrentOffenceWeaponCheckboxOption() {
    await this.currentOffenceWeapon.click()
  }

  async clickCurrentOffenceNoneCheckboxOption() {
    await this.currentOffenceNone.click()
  }

  async clickDomesticViolenceYesRadioOption() {
    await this.domesticViolenceYes.click()
  }

  async clickDomesticViolenceYesAgainstFamilyRadioOption() {
    await this.domesticViolenceYesAgainstFamily.click()
  }

  async clickDomesticViolenceYesAgainstIntimateRadioOption() {
    await this.domesticViolenceYesAgainstIntimate.click()
  }

  async clickDomesticViolenceYesAgainstBothRadioOption() {
    await this.domesticViolenceYesAgainstBoth.click()
  }

  async clickDomesticViolenceNoRadioOption() {
    await this.domesticViolenceNo.click()
  }

  async clickDomesticViolenceUnknownRadioOption() {
    await this.domesticViolenceUnknown.click()
  }
}
