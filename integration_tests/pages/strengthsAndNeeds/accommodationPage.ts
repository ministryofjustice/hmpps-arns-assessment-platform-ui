import { expect, type Locator, type Page } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AccommodationPage extends StrengthsAndNeedsPage {
  readonly incomplete: Locator

  readonly whatTypeOfAccommodation: Locator

  readonly mainSection: Locator

  readonly homeowner: Locator

  readonly approvedPremises: Locator

  readonly campsite: Locator

  constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.whatTypeOfAccommodation = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Accommodation Incomplete')
    this.homeowner = page.getByLabel('Homeowner')
    this.approvedPremises = page.getByLabel('Approved premises')
    this.campsite = page.getByLabel('Campsite')
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
