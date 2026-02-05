import { type Locator, type Page } from '@playwright/test'

/**
 * Helper class for the GOV.UK back link component.
 */
export default class BackLinkHelper {
  readonly link: Locator

  constructor(page: Page) {
    this.link = page.locator('.govuk-back-link')
  }

  async click(): Promise<void> {
    await this.link.click()
  }

  async isVisible(): Promise<boolean> {
    return this.link.isVisible()
  }

  async getText(): Promise<string> {
    return (await this.link.textContent()) ?? ''
  }
}
