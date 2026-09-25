import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class DrugUsePage extends TieringAssessmentPage {

  readonly drugsUsedAmphetamines: Locator

  readonly amphetaminesRadioLast6Months: Locator

  readonly drugsUsedBenzodiazepines: Locator

  readonly drugsUsedCannabis: Locator

  readonly cannabisMoreThan6Months: Locator

  readonly drugsUsedCocaineHydrochloride: Locator

  readonly drugsUsedCrackOrCocaine: Locator

  readonly drugsUsedEcstasy: Locator

  readonly drugsUsedHallucinogens: Locator

  readonly drugsUsedHeroin: Locator

  readonly heroinUnknown: Locator

  readonly drugsUsedKetamine: Locator

  readonly drugsUsedMethadone: Locator

  readonly drugsUsedMisusedPrescribedDrugs: Locator

  readonly drugsUsedOtherOpiates: Locator

  readonly drugsUsedSolvents: Locator

  readonly drugsUsedSpice: Locator

  readonly drugsUsedSteroids: Locator

  readonly drugsUsedOther: Locator

  readonly drugsUsedOtherRevealedTextbox: Locator

  readonly otherRadioLast6Months: Locator

  readonly motivationToStopNoMotivation: Locator

  readonly motivationToStopSomeMotivation: Locator

  readonly motivationToStopFullMotivation: Locator

  readonly motivationToStopUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.drugsUsedAmphetamines = page.getByRole('checkbox', { name: 'Amphetamines' })
    this.amphetaminesRadioLast6Months = page.locator('#AMPHETAMINES_RADIO')
    this.drugsUsedBenzodiazepines = page.getByRole('checkbox', { name: 'Benzodiazepines' })
    this.drugsUsedCannabis = page.getByRole('checkbox', { name: 'Cannabis' })
    this.cannabisMoreThan6Months = page.locator('#CANNABIS_RADIO-2')
    this.drugsUsedCocaineHydrochloride = page.getByRole('checkbox', { name: 'Cocaine hydrochloride' })
    this.drugsUsedCrackOrCocaine = page.getByRole('checkbox', { name: 'Crack or cocaine' })
    this.drugsUsedEcstasy = page.getByRole('checkbox', { name: 'Ecstasy (also known as MDMA)' })
    this.drugsUsedHallucinogens = page.getByRole('checkbox', { name: 'Hallucinogens' })
    this.drugsUsedHeroin = page.getByRole('checkbox', { name: 'Heroin' })
    this.heroinUnknown = page.locator('#HEROIN_RADIO-4')
    this.drugsUsedKetamine = page.getByRole('checkbox', { name: 'Ketamine' })
    this.drugsUsedMethadone = page.getByRole('checkbox', { name: 'Methadone (not prescribed)' })
    this.drugsUsedMisusedPrescribedDrugs = page.getByRole('checkbox', { name: 'Misused prescribed drugs' })
    this.drugsUsedOtherOpiates = page.getByRole('checkbox', { name: 'Other opiates' })
    this.drugsUsedSolvents = page.getByRole('checkbox', { name: 'Solvents (including gases and' })
    this.drugsUsedSpice = page.getByRole('checkbox', { name: 'Spice' })
    this.drugsUsedSteroids = page.getByRole('checkbox', { name: 'Steroids' })
    this.drugsUsedOther = page.getByRole('checkbox', { name: 'Other', exact: true })
    this.drugsUsedOtherRevealedTextbox = page.getByRole('textbox', { name: 'Other drug name' })
    this.otherRadioLast6Months = page.locator('#OTHER_DRUGS_RADIO')
    this.motivationToStopNoMotivation = page.getByRole('radio', { name: 'Does not show motivation to' })
    this.motivationToStopSomeMotivation = page.getByRole('radio', { name: 'Shows some motivation to stop' })
    this.motivationToStopFullMotivation = page.getByRole('radio', { name: 'Motivated to stop or reduce' })
    this.motivationToStopUnknown = page.locator('#motivation_to_tackle_drug_misuse-5')
  }

  async clickDrugsUsedAmphetaminesCheckboxOption() {
    await this.drugsUsedAmphetamines.click()
  }

  async clickAmphetaminesRadioLast6MonthsRadioOption() {
    await this.amphetaminesRadioLast6Months.click()
  }

  async clickDrugsUsedCannabisCheckboxOption() {
    await this.drugsUsedCannabis.click()
  }

  async clickCannabisMoreThan6MonthsRadioOption() {
    await this.cannabisMoreThan6Months.click()
  }

  async clickDrugsUsedHeroinCheckboxOption() {
    await this.drugsUsedHeroin.click()
  }

  async clickHeroinUnknownRadioOption() {
    await this.heroinUnknown.click()
  }

  async clickDrugsUsedOtherCheckboxOption() {
    await this.drugsUsedOther.click()
  }

  async fillDrugsUsedOtherRevealedTextbox(drugName: string = 'New drug') {
    await this.drugsUsedOtherRevealedTextbox.fill(drugName)
  }

  async clickOtherRadioLast6MonthsRadioOption() {
    await this.otherRadioLast6Months.click()
  }

  async clickMotivationToStopNoMotivationRadioOption() {
    await this.motivationToStopNoMotivation.click()
  }
}
