import { expect, type Locator, type Page } from '@playwright/test'
import { employment, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class EmploymentAndEducationPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.getByText('current employment status')
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
  }

  /**
   * Navigates to a employment and education via handover link and handles the privacy screen.
   */
  static async navigateToEmploymentAndEducation(page: Page, handoverLink: string, baseUrl: string): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${employment}/current-employment`)
    await expect(page).toHaveURL(/current-employment/)
  }

  static async verifyOnPage(page: Page): Promise<EmploymentAndEducationPage> {
    const employmentAndEducationPage = new EmploymentAndEducationPage(page)
    await expect(employmentAndEducationPage.pageHeading).toBeVisible()
    return employmentAndEducationPage
  }
}
