import { expect, type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class AlcoholUsePage extends TieringAssessmentPage {

  readonly howOftenOncePerMonth: Locator

  readonly howOften2To4PerMonth: Locator

  readonly howOften2To3PerWeek: Locator

  readonly howOften4PlusPerWeek: Locator

  readonly howOftenUnknown: Locator

  readonly units1To2: Locator

  readonly units3To4: Locator

  readonly units5To6: Locator

  readonly units7To8: Locator

  readonly units10Plus: Locator

  readonly unitsUnknown: Locator

  readonly unitsDetails: Locator

  readonly unitsDetailsRevealedContent: Locator

  readonly bingeDrinkingNoEvidence: Locator

  readonly bingeDrinkingSomeEvidence: Locator

  readonly bingeDrinkingEvidence: Locator

  readonly bingeDrinkingUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.howOftenOncePerMonth = page.getByRole('radio', { name: 'Once a month or less' })
    this.howOften2To4PerMonth = page.getByRole('radio', { name: '2 to 4 times a month' })
    this.howOften2To3PerWeek = page.getByRole('radio', { name: '2 to 3 times a week' })
    this.howOften4PlusPerWeek = page.getByRole('radio', { name: 'More than 4 times a week' })
    this.howOftenUnknown = page
      .getByRole('group', { name: 'drank alcohol in the last 3 months?' })
      .getByLabel('Unknown')
    this.units1To2 = page.getByRole('radio', { name: '1 to 2 units' })
    this.units3To4 = page.getByRole('radio', { name: '3 to 4 units' })
    this.units5To6 = page.getByRole('radio', { name: '5 to 6 units' })
    this.units7To8 = page.getByRole('radio', { name: '7 to 9 units' })
    this.units10Plus = page.getByRole('radio', { name: '10 or more units' })
    this.unitsUnknown = page.getByRole('group', { name: 'How many units of alcohol' }).getByLabel('Unknown')
    this.unitsDetails = page.getByText('Check how many units are')
    this.unitsDetailsRevealedContent = page.getByRole('columnheader', { name: 'Type of drink' })
    this.bingeDrinkingNoEvidence = page.getByRole('radio', { name: 'No evidence of binge drinking' })
    this.bingeDrinkingSomeEvidence = page.getByRole('radio', { name: 'Some evidence of binge' })
    this.bingeDrinkingEvidence = page.getByRole('radio', {
      name: 'Evidence of binge drinking or excessive alcohol use',
      exact: true,
    })
    this.bingeDrinkingUnknown = page
      .getByRole('group', { name: 'evidence of binge drinking or excessive alcohol use in the last 6 months?' })
      .getByLabel('Unknown')
  }

  async clickHowOftenOncePerMonthRadioOption() {
    await this.howOftenOncePerMonth.click()
  }

  async clickHowOften2To4PerMonthRadioOption() {
    await this.howOften2To4PerMonth.click()
  }

  async clickHowOften2To3PerWeekRadioOption() {
    await this.howOften2To3PerWeek.click()
  }

  async clickHowOften4PlusPerWeekRadioOption() {
    await this.howOften4PlusPerWeek.click()
  }

  async clickHowOftenUnknownRadioOption() {
    await this.howOftenUnknown.click()
  }

  async clickUnits1To2RadioOption() {
    await this.units1To2.click()
  }

  async clickUnits3To4RadioOption() {
    await this.units3To4.click()
  }

  async clickUnits5To6RadioOption() {
    await this.units5To6.click()
  }

  async clickUnits7To8RadioOption() {
    await this.units7To8.click()
  }

  async clickUnits10PlusRadioOption() {
    await this.units10Plus.click()
  }

  async clickUnitsUnknownRadioOption() {
    await this.unitsUnknown.click()
  }

  async clickUnitsDetails() {
    await this.unitsDetails.click()
  }

  async checkUnitsDetailsRevealedContentVisible() {
    await expect(this.unitsDetailsRevealedContent).toBeVisible()
  }

  async clickBingeDrinkingNoEvidenceRadioOption() {
    await this.bingeDrinkingNoEvidence.click()
  }

  async clickBingeDrinkingSomeEvidenceRadioOption() {
    await this.bingeDrinkingSomeEvidence.click()
  }

  async clickBingeDrinkingEvidenceRadioOption() {
    await this.bingeDrinkingEvidence.click()
  }

  async clickBingeDrinkingUnknownRadioOption() {
    await this.bingeDrinkingUnknown.click()
  }
}
