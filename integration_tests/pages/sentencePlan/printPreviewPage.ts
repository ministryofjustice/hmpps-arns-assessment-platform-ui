import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PrintPreviewPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly goalCards: Locator

  readonly draftWatermark: Locator

  readonly primaryNavigation: Locator

  readonly serviceHeaderName: Locator

  readonly serviceHeaderLink: Locator

  readonly previousVersionsLink: Locator

  readonly feedbackPhaseBanner: Locator

  readonly backToTopLink: Locator

  readonly exportAsPdfButton: Locator

  readonly printButton: Locator

  readonly printAllGoalsButton: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.getByRole('heading', { level: 1 })
    this.goalCards = page.locator('[data-qa="print-goal-summary-card"]')
    this.draftWatermark = page.locator('.draft-plan-watermark')
    this.primaryNavigation = page.getByLabel('Primary navigation')
    this.serviceHeaderName = page.locator('.arns-common-header__title__organisation-name')
    this.serviceHeaderLink = page.locator('a.arns-common-header__title__organisation-name')
    this.previousVersionsLink = page.getByRole('link', { name: /View previous versions/i })
    this.feedbackPhaseBanner = page.locator('[data-qa="phase-banner"]')
    this.backToTopLink = page.locator('[data-ai-id="back-to-top"]')
    this.exportAsPdfButton = page.getByRole('button', { name: 'Export as PDF' })
    this.printButton = page.getByRole('button', { name: 'Print', exact: true })
    this.printAllGoalsButton = page.getByRole('button', { name: 'Print all goals' })
  }

  static async verifyOnPage(page: Page): Promise<PrintPreviewPage> {
    const printPreviewPage = new PrintPreviewPage(page)
    await expect(printPreviewPage.pageHeading).toContainText(/'s plan$/i)
    return printPreviewPage
  }

  async getGoalTitles(): Promise<string[]> {
    return this.goalCards.locator('[data-qa="goal-title"]').allTextContents()
  }
}
