import { expect, type Locator, type Page } from '@playwright/test'
import { health, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class HealthAndWellbeingPage extends AbstractPage {
  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  readonly mainSection: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Health and wellbeing')
  }

  /**
   * Navigates to health and wellbeing via handover link and handles the privacy screen.
   */
  static async navigateToHealthAndWellbeing(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'health-wellbeing',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${health}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<HealthAndWellbeingPage> {
    const healthAndWellbeingPage = new HealthAndWellbeingPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return healthAndWellbeingPage
  }
}
