import { expect, type Locator, type Page } from '@playwright/test'
import { finances, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class FinancesPage extends StrengthsAndNeedsPage {
  readonly mainSection: Locator

  readonly selectWhereTheyCurrently: Locator

  readonly selectIfHaveOwn: Locator

  readonly selectHowGoodTheyAreAtManaging: Locator

  readonly carersAllowance: Locator

  readonly yes: Locator

  readonly ableToManageTheirMoney: Locator

  readonly selectIfAffectedByGambling: Locator

  readonly selectIfAffectedByDebt: Locator

  readonly yesTheirOwnGambling: Locator

  readonly yesTheirOwnDebt: Locator

  private constructor(page: Page) {
    super(page)
    this.mainSection = page.getByTestId('main-form')
    this.selectWhereTheyCurrently = page.getByRole('link', { name: 'Select where they currently get their money from' })
    this.carersAllowance = page.getByRole('checkbox', { name: 'Carer’s allowance' })
    this.selectIfHaveOwn = page.getByRole('link', { name: 'Select if they have their own personal' })
    this.yes = page.getByRole('radio', { name: 'Yes' })
    this.selectHowGoodTheyAreAtManaging = page.getByRole('link', { name: 'Select how good they are at managing' })
    this.ableToManageTheirMoney = page.getByRole('radio', { name: 'Able to manage their money well and is a strength' })
    this.selectIfAffectedByGambling = page.getByRole('link', { name: 'Select if they are affected by gambling' })
    this.selectIfAffectedByDebt = page.getByRole('link', { name: 'Select if they are affected by debt' })
    this.yesTheirOwnGambling = page.getByRole('checkbox', { name: 'Yes, their own gambling' }).first()
    this.yesTheirOwnDebt = page.getByRole('checkbox', { name: 'Yes, their own debt' }).first()
  }

  /**
   * Navigates to finances via handover link and handles the privacy screen.
   */
  static async navigateToFinances(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    subPage: string = 'finance',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${finances}/${subPage}`)
    expect(page.url()).toContain(subPage)
  }

  static async verifyOnPage(page: Page, heading: string): Promise<FinancesPage> {
    const financesPage = new FinancesPage(page)
    await expect(page.getByText(heading)).toBeVisible()
    return financesPage
  }
}
