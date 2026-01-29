import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PlanHistoryPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly historyEntries: Locator

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
    this.historyEntries = page.locator('.govuk-\\!-margin-bottom-6')
    this.mainContent = page.getByTestId('main-form')
  }

  static async verifyOnPage(page: Page): Promise<PlanHistoryPage> {
    const planHistoryPage = new PlanHistoryPage(page)
    await expect(planHistoryPage.pageHeading).toContainText('Plan history')
    return planHistoryPage
  }

  async getHistoryEntryCount(): Promise<number> {
    return this.historyEntries.count()
  }

  async getHistoryEntryByIndex(index: number): Promise<Locator> {
    return this.historyEntries.nth(index)
  }

  /**
   * Get the status heading text from a history entry (e.g., "Plan agreed", "Plan created", "Agreement updated")
   */
  async getEntryStatusHeading(index: number): Promise<string> {
    const entry = await this.getHistoryEntryByIndex(index)
    const strong = entry.locator('strong').first()
    return (await strong.textContent()) || ''
  }

  /**
   * Get the full header text from a history entry (e.g., "Plan agreed on 23 January 2026 by John Smith and Sam")
   */
  async getEntryHeaderText(index: number): Promise<string> {
    const entry = await this.getHistoryEntryByIndex(index)
    const firstParagraph = entry.locator('p.govuk-body').first()
    return (await firstParagraph.textContent()) || ''
  }

  /**
   * Get the description text from a history entry (e.g., "Sam agreed to this plan.")
   */
  async getEntryDescriptionText(index: number): Promise<string> {
    const entry = await this.getHistoryEntryByIndex(index)
    const paragraphs = entry.locator('p.govuk-body')
    // The description is the second paragraph
    return (await paragraphs.nth(1).textContent()) || ''
  }

  /**
   * Check if an entry contains specific text
   */
  async entryContainsText(index: number, text: string): Promise<boolean> {
    const entry = await this.getHistoryEntryByIndex(index)
    const content = await entry.textContent()
    return content?.includes(text) ?? false
  }

  /**
   * Check if the update agreement link is visible
   */
  async isUpdateAgreementLinkVisible(): Promise<boolean> {
    return this.updateAgreementLink.isVisible()
  }

  /**
   * Check if there are section breaks between entries
   */
  async hasSectionBreakBetweenEntries(): Promise<boolean> {
    const sectionBreaks = this.page.locator('hr.govuk-section-break--visible')
    const count = await sectionBreaks.count()
    // Should have section breaks (at least one if there are multiple entries)
    return count > 0
  }

  /**
   * Get the "View goal" or "View latest version" link from a goal entry
   */
  async getViewGoalLink(index: number): Promise<Locator> {
    const entry = await this.getHistoryEntryByIndex(index)
    return entry.getByRole('link', { name: /View (goal|latest version)/i })
  }

  /**
   * Check if an entry has a "View goal" or "View latest version" link
   */
  async entryHasViewGoalLink(index: number): Promise<boolean> {
    const link = await this.getViewGoalLink(index)
    return link.isVisible()
  }
}
