import { expect, Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from './tieringAssessmentPage'

export default class PredictorScoresPage extends TieringAssessmentPage {

  readonly completeBanner: Locator

  readonly arpScoreType: Locator

  readonly vrpScoreType: Locator

  readonly csrpScoreType: Locator

  readonly svrpScoreType: Locator

  readonly markAsCompleteButton: Locator

  readonly checkAnswersButton: Locator

  constructor(page: Page) {
    super(page)
    this.completeBanner = page.getByTestId('completed-assessment')
    this.arpScoreType = page.locator('[data-test-id="arp-staticOrDynamic"]')
    this.vrpScoreType = page.locator('[data-test-id="vrp-staticOrDynamic"]')
    this.csrpScoreType = page.locator('[data-test-id="csrp-staticOrDynamic"]')
    this.svrpScoreType = page.locator('[data-test-id="svrp-staticOrDynamic"]')
    this.markAsCompleteButton = page.getByRole('button', { name: 'Mark this section complete' })
    this.checkAnswersButton = page.getByRole('button', { name: 'Check answers' })
  }

  async checkCompleteBannerVisible(isVisible: boolean) {
    await expect(this.completeBanner).toBeVisible({ visible: isVisible })
  }

  async checkAllPredictorScoreTypeVisible(value: string = 'Static') {
    await expect(this.arpScoreType).toBeVisible()
    await expect(this.arpScoreType).toContainText(value)
  }

  async checkViolentPredictorScoreTypeVisible(value: string = 'Static') {
    await expect(this.vrpScoreType).toBeVisible()
    await expect(this.vrpScoreType).toContainText(value)
  }

  async checkCombinedSeriousPredictorScoreTypeVisible(value: string = 'Combined') {
    await expect(this.csrpScoreType).toBeVisible()
    await expect(this.csrpScoreType).toContainText(value)
  }

  async checkSeriousViolentPredictorScoreTypeVisible(value: string = 'Static') {
    await expect(this.svrpScoreType).toBeVisible()
    await expect(this.svrpScoreType).toContainText(value)
  }

  async clickMarkAsCompleteButton() {
    await this.markAsCompleteButton.click()
  }

  async clickCheckAnswersButton() {
    await this.checkAnswersButton.click()
  }
}
