import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanHistoryPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.mainContent = page.getByTestId('main-form')
  }

  static async verifyOnPage(page: Page): Promise<PlanHistoryPage> {
    const planHistoryPage = new PlanHistoryPage(page)
    await expect(planHistoryPage.pageHeading).toContainText('Plan history')
    return planHistoryPage
  }
}
