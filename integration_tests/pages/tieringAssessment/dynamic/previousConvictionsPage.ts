import { expect, type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class PreviousConvictionsPage extends TieringAssessmentPage {

  readonly previousConvictionsMurder: Locator

  readonly previousConvictionsGBH: Locator

  readonly previousConvictionsChildSexualOffences: Locator

  readonly previousConvictionsChildOffences: Locator

  readonly previousConvictionsCriminalDamage: Locator

  readonly previousConvictionsWeapon: Locator

  readonly previousConvictionsKidnapping: Locator

  readonly previousConvictionsArson: Locator

  readonly previousConvictionsRaciallyMotivated: Locator

  readonly previousConvictionsBurglary: Locator

  readonly previousConvictionsRobbery: Locator

  readonly previousConvictionsSeriousOffences: Locator

  readonly previousConvictionsCustodyOffences: Locator

  readonly previousConvictionsFirearm: Locator

  readonly previousConvictionsNone: Locator

  readonly previousConvictionValidationError: Locator

  constructor(page: Page) {
    super(page)
    this.previousConvictionsMurder = page.getByRole('checkbox', { name: 'Murder, attempted murder,' })
    this.previousConvictionsGBH = page.getByRole('checkbox', { name: 'Wounding or GBH' })
    this.previousConvictionsChildSexualOffences = page.getByRole('checkbox', {
      name: 'Any sexual offence against a child',
    })
    this.previousConvictionsChildOffences = page.getByRole('checkbox', { name: 'Any other offence against a child' })
    this.previousConvictionsCriminalDamage = page.getByRole('checkbox', { name: 'Criminal damage with intent' })
    this.previousConvictionsWeapon = page.getByRole('checkbox', { name: 'Any offence involving' })
    this.previousConvictionsKidnapping = page.getByRole('checkbox', { name: 'Kidnapping or false' })
    this.previousConvictionsArson = page.getByRole('checkbox', { name: 'Arson' })
    this.previousConvictionsRaciallyMotivated = page.getByRole('checkbox', { name: 'Racially motivated or' })
    this.previousConvictionsBurglary = page.getByRole('checkbox', { name: 'Aggravated burglary' })
    this.previousConvictionsRobbery = page.getByRole('checkbox', { name: 'Robbery' })
    this.previousConvictionsSeriousOffences = page.getByRole('checkbox', { name: 'Any other serious offence (' })
    this.previousConvictionsCustodyOffences = page.getByRole('checkbox', { name: 'Any offence committed in custody' })
    this.previousConvictionsFirearm = page.getByRole('checkbox', { name: 'Possession of a firearm with' })
    this.previousConvictionsNone = page.getByRole('checkbox', { name: 'None of these offences' })
    this.previousConvictionValidationError = page.locator('[href="#previous_convictions"]')
  }

  async clickPreviousConvictionsMurderCheckboxOption() {
    await this.previousConvictionsMurder.click()
  }

  async clickPreviousConvictionsGBHCheckboxOption() {
    await this.previousConvictionsGBH.click()
  }

  async clickPreviousConvictionsChildSexualOffencesCheckboxOption() {
    await this.previousConvictionsChildSexualOffences.click()
  }

  async clickPreviousConvictionsChildOffencesCheckboxOption() {
    await this.previousConvictionsChildOffences.click()
  }

  async clickPreviousConvictionsCriminalDamageCheckboxOption() {
    await this.previousConvictionsCriminalDamage.click()
  }

  async clickPreviousConvictionsWeaponCheckboxOption() {
    await this.previousConvictionsWeapon.click()
  }

  async clickPreviousConvictionsKidnappingCheckboxOption() {
    await this.previousConvictionsKidnapping.click()
  }

  async clickPreviousConvictionsArsonCheckboxOption() {
    await this.previousConvictionsArson.click()
  }

  async clickPreviousConvictionsRaciallyMotivatedCheckboxOption() {
    await this.previousConvictionsRaciallyMotivated.click()
  }

  async clickPreviousConvictionsBurglaryCheckboxOption() {
    await this.previousConvictionsBurglary.click()
  }

  async clickPreviousConvictionsRobberyCheckboxOption() {
    await this.previousConvictionsRobbery.click()
  }

  async clickPreviousConvictionsSeriousOffencesCheckboxOption() {
    await this.previousConvictionsSeriousOffences.click()
  }

  async clickPreviousConvictionsCustodyOffencesCheckboxOption() {
    await this.previousConvictionsCustodyOffences.click()
  }

  async clickPreviousConvictionsFirearmCheckboxOption() {
    await this.previousConvictionsFirearm.click()
  }

  async clickPreviousConvictionsNoneCheckboxOption() {
    await this.previousConvictionsNone.click()
  }

  async checkValidationError() {
    await expect(this.previousConvictionValidationError).toContainText(
      "Select all that apply, or select 'None of these offences'.",
    )
  }

}
