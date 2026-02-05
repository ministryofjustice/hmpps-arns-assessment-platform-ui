import { type Locator, type Page } from '@playwright/test'

/**
 * Helper class for interacting with goal summary card components.
 * Used on confirmation pages that display a goal being modified.
 */
export default class GoalSummaryCardHelper {
  readonly card: Locator

  readonly title: Locator

  constructor(page: Page) {
    this.card = page.locator('[data-qa="goal-summary-card"]')
    this.title = page.locator('[data-qa="goal-title"]')
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? ''
  }

  async isVisible(): Promise<boolean> {
    return this.card.isVisible()
  }
}
