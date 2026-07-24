import { expect, type Locator, type Page } from '@playwright/test'
import { drugUse, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class DrugUsePage extends AbstractPage {
  readonly mainSection: Locator

  readonly form: Locator

  readonly selectIfEverMisusedDrugs: Locator

  readonly selectWhichDrugs: Locator

  readonly yes: Locator

  private constructor(page: Page) {
    super(page)
    this.mainSection = page.getByTestId('main-form')
    this.selectIfEverMisusedDrugs = page.getByRole('link', { name: "Select if they've ever misused drugs" })
    this.selectWhichDrugs = page.getByRole('link', { name: "Select which drugs they've misused" })
    this.yes = page.getByLabel('Yes')
    this.form = page.locator('form')
  }

  /**
   * Navigates to drug use via handover link and handles the privacy screen.
   */
  static async navigateToDrugUse(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'drug-use',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${drugUse}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<DrugUsePage> {
    const drugUsePage = new DrugUsePage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return drugUsePage
  }
}
