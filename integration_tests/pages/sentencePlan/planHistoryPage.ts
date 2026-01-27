import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanHistoryPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly updateAgreementLink: Locator

  readonly backToTopLink: Locator

  readonly returnToOasysButton: Locator

  readonly mainContent: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
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

  /**
   * Check if the update agreement link is visible
   */
  async isUpdateAgreementLinkVisible(): Promise<boolean> {
    return this.updateAgreementLink.isVisible()
  }
}
