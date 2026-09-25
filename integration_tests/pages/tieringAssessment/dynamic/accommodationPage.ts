import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class AccommodationPage extends TieringAssessmentPage {

  readonly livingWithFamily: Locator

  readonly livingWithFriends: Locator

  readonly livingWithPartner: Locator

  readonly livingWithUnder18: Locator

  readonly livingWithOther: Locator

  readonly livingWithAlone: Locator

  readonly livingWithUnknown: Locator

  readonly accommodationSuitableYes: Locator

  readonly accommodationSuitableWithConcerns: Locator

  readonly accommodationSuitableNo: Locator

  readonly accommodationSuitableUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.livingWithFamily = page.getByRole('checkbox', { name: 'Family' })
    this.livingWithFriends = page.getByRole('checkbox', { name: 'Friends' })
    this.livingWithPartner = page.getByRole('checkbox', { name: 'Partner' })
    this.livingWithUnder18 = page.getByRole('checkbox', { name: 'Person under 18 years old' })
    this.livingWithOther = page.getByRole('checkbox', { name: 'Other' })
    this.livingWithAlone = page.getByRole('checkbox', { name: 'Alone' })
    this.livingWithUnknown = page.getByRole('checkbox', { name: 'Unknown' })
    this.accommodationSuitableYes = page.getByRole('radio', { name: 'Yes', exact: true })
    this.accommodationSuitableWithConcerns = page.getByRole('radio', { name: 'Yes, with concerns' })
    this.accommodationSuitableNo = page.getByRole('radio', { name: 'No', exact: true })
    this.accommodationSuitableUnknown = page.getByRole('radio', { name: 'Unknown' })
  }

  async clickLivingWithFamilyCheckboxOption() {
    await this.livingWithFamily.click()
  }

  async clickLivingWithFriendsCheckboxOption() {
    await this.livingWithFriends.click()
  }

  async clickLivingWithPartnerCheckboxOption() {
    await this.livingWithPartner.click()
  }

  async clickLivingWithUnder18CheckboxOption() {
    await this.livingWithUnder18.click()
  }

  async clickLivingWithOtherCheckboxOption() {
    await this.livingWithOther.click()
  }

  async clickLivingWithAloneCheckboxOption() {
    await this.livingWithAlone.click()
  }

  async clickLivingWithUnknownCheckboxOption() {
    await this.livingWithUnknown.click()
  }

  async clickAccommodationSuitableYesRadioOption() {
    await this.accommodationSuitableYes.click()
  }

  async clickAccommodationSuitableWithConcernsRadioOption() {
    await this.accommodationSuitableWithConcerns.click()
  }

  async clickAccommodationSuitableNoRadioOption() {
    await this.accommodationSuitableNo.click()
  }

  async clickAccommodationSuitableUnknownRadioOption() {
    await this.accommodationSuitableUnknown.click()
  }
}
