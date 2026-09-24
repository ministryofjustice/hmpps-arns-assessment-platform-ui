import { type Locator, type Page } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class PreviousVersionsPage extends StrengthsAndNeedsPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  readonly table: Locator

  readonly tableCaption: Locator

  public constructor(page: Page) {
    super(page)
    this.pageHeading = page.getByRole('heading')
    this.mainContent = page.getByTestId('main-form')
    this.table = page.locator('[data-qa="previous-versions-table"]')
    this.tableCaption = page.getByRole('caption')
  }

  async clickViewVersionOnDate(date: string): Promise<void> {
    await this.table.first().getByRole('row', { name: date }).getByRole('link', { name: 'View' }).first().click()
  }
}
