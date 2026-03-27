import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class MpopPage extends AbstractPage {
  readonly crn: string

  public constructor(page: Page, crn: string) {
    super(page)
    this.crn = crn
  }
}
