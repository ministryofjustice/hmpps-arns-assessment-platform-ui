import { expect, Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class LoginPage extends AbstractPage {

  readonly heading: Locator

  readonly username: Locator

  readonly password: Locator

  readonly signin: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Sign in' })
    this.username = page.getByRole('textbox', { name: 'Username' })
    this.password = page.getByRole('textbox', { name: 'Password' })
    this.signin = page.getByRole('button', { name: 'Sign in' })
  }

  async checkLoginPageLoaded() {
    await expect(this.heading).toBeVisible()
  }

  async fillUsernameTextbox(username = 'AUTH_USER') {
    await this.username.fill(username)
  }

  async fillPasswordTextbox(password = 'password123456') {
    await this.password.fill(password)
  }

  async clickSigninButton() {
    await this.signin.click()
  }
}
