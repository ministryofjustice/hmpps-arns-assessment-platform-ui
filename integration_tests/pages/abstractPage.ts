import { type Locator, type Page } from '@playwright/test'

export default class AbstractPage {
  readonly page: Page

  /** user name that appear in header */
  readonly usersName: Locator

  /** phase banner that appear in header */
  readonly phaseBanner: Locator

  /** link to sign out */
  readonly signoutLink: Locator

  /** account type text shown under username in header */
  readonly accountType: Locator

  protected constructor(page: Page) {
    this.page = page
    this.phaseBanner = page.getByTestId('header-phase-banner')
    this.usersName = page.getByTestId('header-user-name')
    this.signoutLink = page.getByText('Sign out')
    this.accountType = page.locator('.arns-common-header__menu-toggle-label, .arns-common-header__oasys-account-label')
  }

  async signOut() {
    const menuToggle = this.page.locator('.arns-common-header__user-menu-toggle')

    if (await menuToggle.isVisible()) {
      await menuToggle.click()
    }

    await this.signoutLink.first().click()
  }
}
