import { expect, type Locator, type Page } from '@playwright/test'
import { employment, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class EmploymentAndEducationPage extends AbstractPage {
  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  readonly mainSection: Locator

  readonly selectTypeOfEmployment: Locator

  readonly fullTime: Locator

  readonly selectOneOption: Locator

  readonly yesHasBeenEmployedBefore: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Employment and education')
    this.selectTypeOfEmployment = page.getByRole('link', { name: 'Select the type of employment' })
    this.fullTime = page.getByLabel('Full-time')
    this.selectOneOption = page.getByRole('link', { name: 'Select one option' })
    this.yesHasBeenEmployedBefore = page.getByRole('radio', { name: 'Yes, has been employed before' })
  }

  /**
   * Navigates to a employment and education via handover link and handles the privacy screen.
   */
  static async navigateToEmploymentAndEducation(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    subPage: string = 'current-employment',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${employment}/${subPage}`)
    expect(page.url()).toContain(subPage)
  }

  static async verifyOnPage(page: Page, heading: string): Promise<EmploymentAndEducationPage> {
    const employmentAndEducationPage = new EmploymentAndEducationPage(page)
    await expect(page.getByText(heading)).toBeVisible()
    return employmentAndEducationPage
  }
}
