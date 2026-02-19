import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PreviousVersionsPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  readonly table: Locator

  readonly tableCaption: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.mainContent = page.getByTestId('main-form')
    this.table = page.locator('.previous-versions-table')
    this.tableCaption = this.table.locator('.govuk-table__caption--m')
  }

  static async verifyOnPage(page: Page): Promise<PreviousVersionsPage> {
    const previousVersionsPage = new PreviousVersionsPage(page)
    await expect(previousVersionsPage.pageHeading).toContainText('Previous versions')
    return previousVersionsPage
  }
}
