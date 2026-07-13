import { expect, type Locator, type Page } from '@playwright/test'
import { accommodation, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class AccommodationPage extends AbstractPage {
  readonly incomplete: Locator

  readonly whatTypeOfAccommodation: Locator

  readonly mainSection: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.whatTypeOfAccommodation = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Accommodation Incomplete')
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<AccommodationPage> {
    const accommodationPage = new AccommodationPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return accommodationPage
  }
}
