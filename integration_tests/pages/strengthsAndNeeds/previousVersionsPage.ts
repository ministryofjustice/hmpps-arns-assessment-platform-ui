import { type Locator, type Page } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class PreviousVersionsPage extends StrengthsAndNeedsPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  readonly table: Locator

  readonly tableCaption: Locator

  public constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.mainContent = page.getByTestId('main-form')
    this.table = page.locator('.previous-versions-table')
    this.tableCaption = this.table.locator('.govuk-table__caption--m')
  }

  async clickViewVersionOnDate(date: string): Promise<void> {
    await this.table.locator('tr', { hasText: date }).locator('a').click()
  }
}
