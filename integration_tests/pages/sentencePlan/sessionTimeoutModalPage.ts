import { type Locator, type Page } from '@playwright/test'

export default class SessionTimeoutModalPage {
  readonly page: Page

  readonly modal: Locator

  readonly heading: Locator

  readonly countdown: Locator

  readonly continueButton: Locator

  readonly deleteLink: Locator

  private constructor(page: Page) {
    this.page = page
    this.modal = page.locator('.moj-session-timeout-modal')
    this.heading = page.locator('#session-timeout-title')
    this.countdown = page.locator('.moj-session-timeout-modal__countdown')
    this.continueButton = page.getByRole('button', { name: 'Continue using sentence plan' })
    this.deleteLink = page.getByRole('link', { name: 'Delete unsaved information' })
  }

  static getInstance(page: Page): SessionTimeoutModalPage {
    return new SessionTimeoutModalPage(page)
  }

  async getCountdownText(): Promise<string> {
    return (await this.countdown.textContent()) || ''
  }
}
