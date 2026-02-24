import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class HistoricPlanPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly alertHeading: Locator

  readonly goalCards: Locator

  readonly currentGoalsTab: Locator

  readonly futureGoalsTab: Locator

  readonly removedGoalsTab: Locator

  readonly noGoalsMessage: Locator

  readonly noFutureGoalsMessage: Locator

  readonly header: Locator

  readonly footer: Locator

  readonly banner: Locator

  readonly primaryNavigation: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.alertHeading = page.locator('.moj-alert__heading')
    this.goalCards = page.locator('[data-qa="goal-summary-card"]')
    this.currentGoalsTab = page.getByRole('link', { name: /Goals to work on now/i })
    this.futureGoalsTab = page.getByRole('link', { name: /Future goals/i })
    this.removedGoalsTab = page.getByRole('link', { name: /Removed goals/i })
    this.noGoalsMessage = page.getByText(/does not have any goals/i)
    this.noFutureGoalsMessage = page.getByText(/does not have any future goals/i)
    this.header = page.getByTestId('plan-header')
    this.footer = page.locator('footer')
    this.banner = page.getByTestId('hmpps-header')
    this.primaryNavigation = page.getByLabel('Primary navigation')
  }

  static async verifyOnPage(page: Page): Promise<HistoricPlanPage> {
    const historicPlan = new HistoricPlanPage(page)
    await expect(historicPlan.pageHeading).toContainText(/'s plan$/i)
    return historicPlan
  }

  async clickCurrentGoalsTab(): Promise<void> {
    await this.currentGoalsTab.click()
  }

  async clickFutureGoalsTab(): Promise<void> {
    await this.futureGoalsTab.click()
  }

  async getGoalCardByIndex(index: number): Promise<Locator> {
    return this.goalCards.nth(index)
  }

  async getGoalCount(): Promise<number> {
    return this.goalCards.count()
  }

  async getGoalCardTitle(index: number): Promise<string> {
    const card = await this.getGoalCardByIndex(index)
    const title = card.locator('[data-qa="goal-title"]')
    return (await title.textContent()) || ''
  }

  async getGoalCardAreaOfNeed(index: number): Promise<Locator> {
    const card = await this.getGoalCardByIndex(index)
    return card.locator('[data-qa="goal-area-of-need"]')
  }

  async goalCardHasViewDetailsLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const viewDetailsLink = card.getByRole('link', { name: /view details/i })
    return (await viewDetailsLink.count()) > 0
  }

  async getAllGoalTitles(): Promise<string[]> {
    const count = await this.goalCards.count()
    const indices = Array.from({ length: count }, (_, i) => i)
    return Promise.all(indices.map(i => this.getGoalCardTitle(i)))
  }

  async goalCardHasTargetDateText(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const targetDateText = card.getByText(/Aim to achieve this by/i)
    return (await targetDateText.count()) > 0
  }
}
