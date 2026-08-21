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

  readonly selectHowOftenTheyDrunk: Locator

  readonly onceAMonth: Locator

  readonly selectHowManyUnitsOf: Locator

  readonly oneToTwoUnits: Locator

  readonly selectIfTheyHadEightOrMore: Locator

  readonly hasHadEightOrMore: Locator

  readonly selectIfTheresEvidence: Locator

  readonly noEvidenceOfBingeDrinking: Locator

  readonly selectIfTheyHaveAnyPast: Locator

  readonly haveAnyPast: Locator

  readonly selectWhyTheyDrink: Locator

  readonly culturalAndReligious: Locator

  readonly selectTheImpactOf: Locator

  readonly behavioural: Locator

  readonly selectIfAnythingHasHelped: Locator

  readonly hasAnythingHelped: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.mainForm = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Alcohol use')
    this.yesIncludingLastThreeMonths = page.getByLabel('Yes, including the last 3 months')
    this.yesNotInLastThreeMonths = page.getByLabel('Yes, but not in the last 3 months')
    this.no = page.getByLabel('No', { exact: true })
    this.selectOneOption = page.getByRole('link', { name: 'Select if they have ever drunk alcohol' })
    this.selectHowOftenTheyDrunk = page.getByRole('link', { name: 'Select how often they drunk' })
    this.onceAMonth = page.getByRole('radio', { name: 'Once a month or less' })
    this.selectHowManyUnitsOf = page.getByRole('link', { name: 'Select how many units of' })
    this.oneToTwoUnits = page.getByRole('radio', { name: 'to 2 units' })
    this.selectIfTheyHadEightOrMore = page.getByRole('link', { name: 'Select if they had 8 or more' })
    this.hasHadEightOrMore = page.getByRole('group', { name: 'Has Test had 8 or more units' }).getByLabel('Yes')
    this.selectIfTheresEvidence = page.getByRole('link', { name: "Select if there's evidence of" })
    this.noEvidenceOfBingeDrinking = page.getByRole('radio', { name: 'No evidence of binge drinking' })
    this.selectIfTheyHaveAnyPast = page.getByRole('link', { name: 'Select if they have any past' })
    this.haveAnyPast = page.getByRole('group', { name: 'have any past' }).getByLabel('Yes')
    this.selectWhyTheyDrink = page.getByRole('link', { name: 'Select why they drink alcohol' })
    this.culturalAndReligious = page.getByRole('checkbox', { name: 'Cultural or religious practice' })
    this.selectTheImpactOf = page.getByRole('link', { name: 'Select the impact of them' })
    this.behavioural = page.getByRole('checkbox', { name: 'Behavioural' })
    this.selectIfAnythingHasHelped = page.getByRole('link', { name: 'Select if anything has helped' })
    this.hasAnythingHelped = page.getByRole('group', { name: 'Has anything helped' }).getByLabel('Yes')
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
