import { expect, type Locator, Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class HandoverPage extends AbstractPage {
  readonly hmpps: Locator

  private constructor(page: Page) {
    super(page)
    this.hmpps = page.getByRole('link', { name: 'HMPPS' })
  }

  static async verifyOnPage(page: Page): Promise<HandoverPage> {
    const handoverPage = new HandoverPage(page)
    await expect(handoverPage.hmpps).toBeVisible()
    return handoverPage
  }
}
