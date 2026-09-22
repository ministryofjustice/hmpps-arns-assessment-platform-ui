import { type Locator, type Page } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class HistoricAssessmentPage extends StrengthsAndNeedsPage {
  readonly pageHeading: Locator

  readonly alertHeading: Locator

  readonly returnToOasysButton: Locator

  public constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.alertHeading = page.locator('.moj-alert__heading')
    this.returnToOasysButton = page.getByRole('button', { name: /return to oasys/i })
  }
}
