import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class ExamplePage extends AbstractPage {
  readonly header: Locator

  readonly timestamp: Locator

  readonly sideNav: Locator

  readonly formContent: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'This site is under construction...' })
    this.timestamp = page.getByTestId('timestamp')
    this.sideNav = page.locator('.moj-side-navigation')
    this.formContent = page.locator('.govuk-heading-m', { hasText: "What you'll need" })
  }

  static async verifyOnPage(page: Page): Promise<ExamplePage> {
    const examplePage = new ExamplePage(page)
    await expect(examplePage.header).toBeVisible()
    await expect(examplePage.sideNav).toBeVisible()
    return examplePage
  }
}
