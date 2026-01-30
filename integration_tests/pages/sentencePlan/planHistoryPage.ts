import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanHistoryPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly historyEntries: Locator

  readonly updateAgreementLink: Locator

  readonly backToTopLink: Locator

  readonly returnToOasysButton: Locator

  readonly mainContent: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.historyEntries = page.locator('.govuk-\\!-margin-bottom-6')
    this.updateAgreementLink = page.getByRole('link', { name: /Update .+'s agreement/i })
    this.backToTopLink = page.getByRole('link', { name: /Back to top/i })
    this.returnToOasysButton = page.getByRole('button', { name: /Return to OASys/i })
    this.mainContent = page.getByTestId('main-form')
  }

  static async verifyOnPage(page: Page): Promise<PlanHistoryPage> {
    const planHistoryPage = new PlanHistoryPage(page)
    await expect(planHistoryPage.pageHeading).toContainText('Plan history')
    return planHistoryPage
  }

  async getHistoryEntryByIndex(index: number): Promise<Locator> {
    return this.historyEntries.nth(index)
  }

  /**
   * Get the "View goal" or "View latest version" link from a goal entry
   */
  async getViewGoalLink(index: number): Promise<Locator> {
    const entry = await this.getHistoryEntryByIndex(index)
    return entry.getByRole('link', { name: /View (goal|latest version)/i })
  }
}
