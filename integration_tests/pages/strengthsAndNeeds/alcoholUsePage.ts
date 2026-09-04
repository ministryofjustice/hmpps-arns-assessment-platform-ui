import { expect, type Locator, type Page } from '@playwright/test'
import { alcohol, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AlcoholUsePage extends StrengthsAndNeedsPage {
  readonly incomplete: Locator

  readonly mainForm: Locator

  readonly mainSection: Locator

  readonly yesIncludingLastThreeMonths: Locator

  readonly yesNotInLastThreeMonths: Locator

  readonly no: Locator

  readonly selectOneOption: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.mainForm = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Alcohol use')
    this.yesIncludingLastThreeMonths = page.getByLabel('Yes, including the last 3 months')
    this.yesNotInLastThreeMonths = page.getByLabel('Yes, but not in the last 3 months')
    this.no = page.getByLabel('No', { exact: true })
    this.selectOneOption = page.getByRole('link', { name: 'Select if they have ever drunk alcohol' })
  }

  /**
   * Navigates to alcohol use via handover link and handles the privacy screen.
   */
  static async navigateToAlcoholUse(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    subPage: string = 'alcohol-use',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${alcohol}/${subPage}`)
    expect(page.url()).toContain(subPage)
  }

  static async verifyOnPage(page: Page, heading: string): Promise<AlcoholUsePage> {
    const alcoholUsePage = new AlcoholUsePage(page)
    await expect(page.getByText(heading)).toBeVisible()
    return alcoholUsePage
  }
}
