import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class BingeDrinkingUsePage extends TieringAssessmentPage {

  readonly bingeDrinkingNoEvidence: Locator

  readonly bingeDrinkingSomeEvidence: Locator

  readonly bingeDrinkingEvidence: Locator

  readonly bingeDrinkingUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.bingeDrinkingNoEvidence = page.getByRole('radio', { name: 'No evidence of binge drinking' })
    this.bingeDrinkingSomeEvidence = page.getByRole('radio', { name: 'Some evidence of binge' })
    this.bingeDrinkingEvidence = page.getByRole('radio', {
      name: 'Evidence of binge drinking or excessive alcohol use',
      exact: true,
    })
    this.bingeDrinkingUnknown = page.getByRole('radio', { name: 'Unknown' })
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
