import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanOverviewPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly createGoalLink: Locator

  readonly createGoalButton: Locator

  readonly currentGoalsSection: Locator

  readonly futureGoalsSection: Locator

  readonly goalCards: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.createGoalLink = page.getByRole('link', { name: /create a goal/i })
    this.createGoalButton = page.getByRole('button', { name: /create goal/i })
    this.currentGoalsSection = page.getByRole(`region`, { name: /Goals to work on now/i })
    this.futureGoalsSection = page.getByRole(`region`, { name: /Future goals/i })
    this.goalCards = page.locator('[data-qa="goal-summary-card"]')
  }

  static async verifyOnPage(page: Page): Promise<PlanOverviewPage> {
    const planOverviewPage = new PlanOverviewPage(page)
    await expect(planOverviewPage.pageHeading).toContainText(/'s plan$/i)
    return planOverviewPage
  }

  async clickCreateGoal(): Promise<void> {
    await this.createGoalButton.click()
  }
}
