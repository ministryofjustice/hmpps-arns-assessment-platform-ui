import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanOverviewPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly createGoalLink: Locator

  readonly createGoalButton: Locator

  readonly goalCards: Locator

  readonly currentGoalsTab: Locator

  readonly futureGoalsTab: Locator

  readonly removedGoalsTab: Locator

  readonly noGoalsMessage: Locator

  readonly noFutureGoalsMessage: Locator

  readonly agreePlanButton: Locator

  readonly updateAgreementLink: Locator

  readonly header: Locator

  readonly footer: Locator

  readonly banner: Locator

  readonly primaryNavigation: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.createGoalLink = page.getByRole('link', { name: /create a goal/i })
    this.createGoalButton = page.getByRole('button', { name: /create goal/i })
    this.goalCards = page.locator('[data-qa="goal-summary-card"]')
    this.currentGoalsTab = page.getByRole('link', { name: /Goals to work on now/i })
    this.futureGoalsTab = page.getByRole('link', { name: /Future goals/i })
    this.removedGoalsTab = page.getByRole('link', { name: /Removed goals/i })
    this.noGoalsMessage = page.getByText(/does not have any goals/i)
    this.updateAgreementLink = page.getByRole('link', { name: /update .+'s agreement/i })
    this.noFutureGoalsMessage = page.getByText(/does not have any future goals/i)
    this.agreePlanButton = page.getByRole('button', { name: /agree plan/i })
    this.header = page.getByTestId('plan-header')
    this.footer = page.locator('footer')
    this.banner = page.getByTestId('hmpps-header')
    this.primaryNavigation = page.getByLabel('Primary navigation')
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

  async goalCardHasUpdateLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const updateLink = card.getByRole('link', { name: /update/i })
    return (await updateLink.count()) > 0
  }

  async goalCardHasViewDetailsLink(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const viewDetailsLink = card.getByRole('link', { name: /view details/i })
    return (await viewDetailsLink.count()) > 0
  }

  async goalCardHasMoveUpButton(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const moveUpButton = card.locator('[data-qa="move-goal-up"]')
    return (await moveUpButton.count()) > 0
  }

  async goalCardHasMoveDownButton(index: number): Promise<boolean> {
    const card = await this.getGoalCardByIndex(index)
    const moveDownButton = card.locator('[data-qa="move-goal-down"]')
    return (await moveDownButton.count()) > 0
  }

  async clickMoveGoalUp(index: number): Promise<void> {
    const card = await this.getGoalCardByIndex(index)
    const moveUpButton = card.locator('[data-qa="move-goal-up"]')
    await moveUpButton.click()
  }

  async clickMoveGoalDown(index: number): Promise<void> {
    const card = await this.getGoalCardByIndex(index)
    const moveDownButton = card.locator('[data-qa="move-goal-down"]')
    await moveDownButton.click()
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

  async clickAddOrChangeSteps(index: number): Promise<void> {
    const card = await this.getGoalCardByIndex(index)
    const addStepsLink = card.getByRole('link', { name: /add or change steps/i })
    await addStepsLink.click()
  }

  async clickUpdateGoal(index: number): Promise<void> {
    const card = await this.getGoalCardByIndex(index)
    const updateLink = card.getByRole('link', { name: /update/i })
    await updateLink.click()
  }
}
