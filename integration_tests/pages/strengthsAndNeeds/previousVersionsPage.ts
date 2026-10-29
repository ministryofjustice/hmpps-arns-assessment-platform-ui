import { expect, type Locator, type Page } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class PreviousVersionsPage extends StrengthsAndNeedsPage {

  readonly table: Locator

  readonly tableCaption: Locator

  public constructor(page: Page) {
    super(page)
    this.table = page.getByTestId('previous-versions-table')
    this.tableCaption = page.getByRole('caption')
  }

  async viewVersionOnDate(date: string): Promise<void> {
    await this.table.last().getByRole('row', { name: date }).getByRole('link', { name: 'View' }).first().click()
  }

  async verifyOnPage(page: Page): Promise<PreviousVersionsPage> {
    const previousVersionsPage = new PreviousVersionsPage(page)
    await expect(previousVersionsPage.pageHeading).toContainText('Previous versions')
    return previousVersionsPage
  }
}
