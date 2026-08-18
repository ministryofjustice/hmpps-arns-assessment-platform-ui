import { expect, type Locator, type Page } from '@playwright/test'
import { navigateToStrengthsAndNeeds, offence, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class OffenceAnalysisPage extends AbstractPage {
  readonly mainSection: Locator

  readonly enterDetails: Locator

  readonly enterDetailsWhy: Locator

  readonly enterDescription: Locator

  readonly enterWhy: Locator

  readonly selectIfTheOffence: Locator

  readonly arson: Locator

  readonly selectIfTheOffenceInvolved: Locator

  readonly addictions: Locator

  readonly selectWhoOffenceWas: Locator

  readonly selectWhoTheVictim: Locator

  readonly oneOrMore: Locator

  readonly stranger: Locator

  readonly selectAge: Locator

  readonly zeroToFour: Locator

  readonly selectSex: Locator

  readonly male: Locator

  readonly selectEthnicity: Locator

  readonly victimsEthnicity: Locator

  private constructor(page: Page) {
    super(page)
    this.mainSection = page.getByTestId('main-form')
    this.enterDetails = page.getByRole('link', { name: 'Enter details' }).first()
    this.enterDetailsWhy = page.getByRole('link', { name: 'Enter details' }).nth(1)
    this.enterDescription = page.getByRole('textbox', { name: 'Enter a brief description of' })
    this.enterWhy = page.getByRole('textbox', { name: 'Why did the current index' })
    this.selectIfTheOffence = page.getByRole('link', { name: 'Select if the offence(s) had' })
    this.arson = page.getByRole('checkbox', { name: 'Arson' })
    this.selectIfTheOffenceInvolved = page.getByRole('link', {
      name: 'Select if the offence(s) involved any of the following motivations',
    })
    this.addictions = page.getByRole('checkbox', { name: 'Addictions or perceived needs' })
    this.selectWhoTheVictim = page.getByRole('link', { name: 'Select who the victim is' })
    this.oneOrMore = page.getByRole('checkbox', { name: 'One or more people' })
    this.stranger = page.getByRole('radio', { name: 'A stranger' })
    this.selectAge = page.getByRole('link', { name: 'Select approximate age' })
    this.zeroToFour = page.getByRole('radio', { name: 'to 4 years' })
    this.selectSex = page.getByRole('link', { name: 'Select sex' })
    this.male = page.getByRole('radio', { name: 'Male', exact: true })
    this.selectEthnicity = page.getByRole('link', { name: "Select the victim's ethnicity" })
    this.victimsEthnicity = page.getByLabel("What is the victim's")
    this.selectWhoOffenceWas = page.getByRole('link', { name: 'Select who the offence was' })
  }

  /**
   * Navigates to offence analysis via handover link and handles the privacy screen.
   */
  static async navigateToOffenceAnalysis(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'offence-analysis',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${offence}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<OffenceAnalysisPage> {
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return offenceAnalysisPage
  }

  async giveDetailsCharacterError(count: string) {
    const s = count.includes('1') ? '' : 's'
    return this.page.getByText(`You have ${count} character${s} too many`).first()
  }
}
