import { expect, type Locator, type Page } from '@playwright/test'
import { drugUse, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class DrugUsePage extends AbstractPage {
  readonly mainSection: Locator

  readonly form: Locator

  readonly selectIfEverMisusedDrugs: Locator

  readonly selectWhichDrugs: Locator

  readonly selectWhyTheyUseDrugs: Locator

  readonly culturalOrReligiousPractice: Locator

  readonly selectHowTheirDrugUse: Locator

  readonly behaviour: Locator

  private constructor(page: Page) {
    super(page)
    this.mainSection = page.getByTestId('main-form')
    this.selectIfEverMisusedDrugs = page.getByRole('link', { name: 'Select if they’ve ever misused drugs' })
    this.selectWhichDrugs = page.getByRole('link', { name: 'Select which drugs they’ve misused' })
    this.form = page.locator('form')
    this.selectWhyTheyUseDrugs = page.getByRole('link', { name: 'Select why they use drugs' })
    this.culturalOrReligiousPractice = page.getByRole('checkbox', { name: 'Cultural or religious practice' })
    this.selectHowTheirDrugUse = page.getByRole('link', { name: 'Select how their drug use has affected their life' })
    this.behaviour = page.getByRole('checkbox', { name: 'Behaviour' })
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
