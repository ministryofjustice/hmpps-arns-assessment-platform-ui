import { expect, type Locator, type Page } from '@playwright/test'
import { health, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class HealthAndWellbeingPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.getByText('any physical health conditions')
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
  }

  /**
   * Navigates to health and wellbeing via handover link and handles the privacy screen.
   */
  static async navigateToHealthAndWellbeing(page: Page, handoverLink: string, baseUrl: string): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${health}/health-wellbeing`)
    await expect(page).toHaveURL(/health-wellbeing/)
  }

  static async verifyOnPage(page: Page): Promise<HealthAndWellbeingPage> {
    const healthAndWellbeingPage = new HealthAndWellbeingPage(page)
    await expect(healthAndWellbeingPage.pageHeading).toBeVisible()
    return healthAndWellbeingPage
  }
}
