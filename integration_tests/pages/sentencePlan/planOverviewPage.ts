import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanOverviewPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly createGoalLink: Locator

  readonly createGoalButton: Locator

  readonly currentGoalsSection: Locator

  readonly futureGoalsSection: Locator

  readonly goalCards: Locator

  readonly tabNavigation: Locator

  readonly currentGoalsTab: Locator

  readonly futureGoalsTab: Locator

  readonly noGoalsMessage: Locator

  readonly noFutureGoalsMessage: Locator

  readonly goalCardTitles: Locator

  readonly agreePlanButton: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.createGoalLink = page.getByRole('link', { name: /create a goal/i })
    this.createGoalButton = page.getByRole('button', { name: /create goal/i })
    this.currentGoalsSection = page.getByRole(`region`, { name: /Goals to work on now/i })
    this.futureGoalsSection = page.getByRole(`region`, { name: /Future goals/i })
    this.goalCards = page.locator('[data-qa="goal-summary-card"]')
    this.tabNavigation = page.locator('.moj-sub-navigation')
    this.currentGoalsTab = page.getByRole('link', { name: /Goals to work on now/i })
    this.futureGoalsTab = page.getByRole('link', { name: /Future goals/i })
    this.noGoalsMessage = page.getByText(/does not have any goals/i)
    this.noFutureGoalsMessage = page.getByText(/does not have any future goals/i)
    this.goalCardTitles = page.locator('[data-qa="goal-title"]')
    this.agreePlanButton = page.getByRole('button', { name: /agree plan/i })
  }

  static async verifyOnPage(page: Page): Promise<PlanOverviewPage> {
    const planOverviewPage = new PlanOverviewPage(page)
    await expect(planOverviewPage.pageHeading).toContainText(/'s plan$/i)
    return planOverviewPage
  }

  async clickCreateGoal(): Promise<void> {
    await this.createGoalButton.click()
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

  async goalCardHasChangeLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const changeLink = card.getByRole('link', { name: /change goal/i })
    return (await changeLink.count()) > 0
  }

  async goalCardHasAddStepsLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const addStepsLink = card.getByRole('link', { name: /add or change steps/i })
    return (await addStepsLink.count()) > 0
  }

  async goalCardHasDeleteLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const deleteLink = card.getByRole('link', { name: /delete/i })
    return (await deleteLink.count()) > 0
  }
}
