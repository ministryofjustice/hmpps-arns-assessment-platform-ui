import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class MergedPlanWarningPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly warningContent: Locator

  readonly oasysLink: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.warningContent = page.locator('.govuk-grid-column-two-thirds')
    this.oasysLink = page.getByRole('link', { name: 'Go to OASys to access the sentence plan.' })
  }

  static async verifyOnPage(page: Page): Promise<MergedPlanWarningPage> {
    const warningPage = new MergedPlanWarningPage(page)
    await expect(warningPage.pageHeading).toContainText('You need to use OASys to access this plan')

    return warningPage
  }
}
