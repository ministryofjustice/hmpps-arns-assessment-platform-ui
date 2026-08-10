import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AccommodationPage extends AbstractPage {
  readonly incomplete: Locator

  readonly whatTypeOfAccommodation: Locator

  readonly mainSection: Locator

  readonly homeowner: Locator

  readonly approvedPremises: Locator

  readonly campsite: Locator

  readonly selectWhoTheyAreLivingWith: Locator

  readonly family: Locator

  readonly selectIfTheLocation: Locator

  readonly isTheLocationOf: Locator

  readonly selectIfTheAccommodation: Locator

  readonly yesAccommodationSuitable: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.whatTypeOfAccommodation = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Accommodation Incomplete')
    this.homeowner = page.getByLabel('Homeowner')
    this.approvedPremises = page.getByLabel('Approved premises')
    this.campsite = page.getByLabel('Campsite')
    this.selectWhoTheyAreLivingWith = page.getByRole('link', { name: 'Select who they are living with' })
    this.family = page.getByRole('checkbox', { name: 'Family' })
    this.selectIfTheLocation = page.getByRole('link', { name: 'Select if the location of the' })
    this.isTheLocationOf = page.getByRole('group', { name: 'Is the location of' }).getByLabel('Yes')
    this.selectIfTheAccommodation = page.getByRole('link', { name: 'Select if the accommodation' })
    this.yesAccommodationSuitable = page
      .getByRole('group', { name: "Is Test's accommodation" })
      .getByLabel('Yes', { exact: true })
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<AccommodationPage> {
    const accommodationPage = new AccommodationPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return accommodationPage
  }

  async selectTypeOfAccommodation(type: string) {
    await this.page.getByRole('link', { name: `Select the type of ${type}` }).click()
  }
}
