import { expect, type Locator, type Page } from '@playwright/test'

export default class HomePage {
  readonly page: Page

  readonly header: Locator

  readonly usersName: Locator

  readonly signoutLink: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('h1', { hasText: 'This site is under construction...' })
    this.usersName = page.getByTestId('header-user-name')
    this.signoutLink = page.getByText('Sign out')
  }

  static async verifyOnPage(page: Page): Promise<HomePage> {
    const homePage = new HomePage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }

  async signOut() {
    await this.signoutLink.first().click()
  }
}
