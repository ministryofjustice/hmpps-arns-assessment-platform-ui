import { expect, type Locator, type Page } from '@playwright/test'
import { navigateToStrengthsAndNeeds, personal, sanFormPath, thinking, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class ThinkingBehavioursAndAttitudesPage extends AbstractPage {
  readonly mainForm: Locator

  private constructor(page: Page) {
    super(page)
    this.mainForm = page.getByTestId('main-form')
  }

  /**
   * Navigates to thinking behaviours via handover link and handles the privacy screen.
   */
  static async navigateToThinkingBehavioursAndAttitudes(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'thinking-behaviours',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${thinking}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<ThinkingBehavioursAndAttitudesPage> {
    const thinkingBehavioursAndAttitudesPage = new ThinkingBehavioursAndAttitudesPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return thinkingBehavioursAndAttitudesPage
  }
}
