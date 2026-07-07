import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AccommodationPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly incomplete: Locator

  readonly whatTypeOfAccommodation: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.getByText('What type of accommodation')
    this.incomplete = page.getByText('Incomplete')
    this.whatTypeOfAccommodation = page.getByTestId('main-form')
  }

  static async verifyOnPage(page: Page): Promise<AccommodationPage> {
    const accommodationPage = new AccommodationPage(page)
    await expect(accommodationPage.pageHeading).toBeVisible()
    return accommodationPage
  }
}
