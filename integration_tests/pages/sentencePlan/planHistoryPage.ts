import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanHistoryPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly mainContent: Locator

  readonly showAllSectionsButton: Locator

  readonly viewGoalLink: Locator

  readonly createGoalButton: Locator

  readonly goalSummaryCards: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.mainContent = page.getByTestId('main-form')
    this.showAllSectionsButton = page.getByRole('button', { name: 'Show all sections' })
    this.viewGoalLink = page.getByRole('link', { name: 'View goal' })
    this.createGoalButton = page.getByRole('button', { name: 'Create goal' })
    this.goalSummaryCards = this.mainContent.locator('[data-qa="goal-summary-card-history"]')
  }

  static async verifyOnPage(page: Page): Promise<PlanHistoryPage> {
    const planHistoryPage = new PlanHistoryPage(page)
    await expect(planHistoryPage.pageHeading).toContainText('Plan history')
    return planHistoryPage
  }

  async clickShowAllSectionsButton(): Promise<void> {
    await this.showAllSectionsButton.click()
  }

  async clickViewGoalLink(): Promise<void> {
    await this.viewGoalLink.first().click()
  }

  async getStepDescription(cardIndex: number, stepIndex: number): Promise<string> {
    const descriptions = this.goalSummaryCards.nth(cardIndex).locator('[data-qa="step-description"]')

    return (await descriptions.nth(stepIndex).textContent())?.trim() ?? ''
  }

}
