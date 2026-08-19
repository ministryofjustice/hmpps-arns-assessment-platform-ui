import { type Locator, Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class StrengthsAndNeedsPage extends AbstractPage {
  readonly complete: Locator

  protected constructor(page: Page) {
    super(page)
    this.complete = page.locator('[data-complete="YES"]')
  }
}
