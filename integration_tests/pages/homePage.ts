import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class HomePage extends AbstractPage {
  readonly header: Locator

  readonly sideNav: Locator

  readonly formContent: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'This site is under construction...' })
    this.sideNav = page.locator('.moj-side-navigation')
    this.formContent = page.locator('.govuk-heading-m', { hasText: "What you'll need" })
  }

  static async verifyOnPage(page: Page): Promise<HomePage> {
    const homePage = new HomePage(page)
    await expect(homePage.header).toBeVisible()
    await expect(homePage.header).toBeVisible()
    await expect(homePage.sideNav).toBeVisible()
    return homePage
  }
}
