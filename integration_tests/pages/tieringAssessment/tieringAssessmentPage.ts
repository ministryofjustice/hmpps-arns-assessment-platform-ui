import { expect, type Locator, Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class TieringAssessmentPage extends AbstractPage {

  readonly backLink: Locator

  readonly pageHeading: Locator

  readonly saveAndContinue: Locator

  protected constructor(page: Page) {
    super(page)
    this.backLink = page.getByTestId('tiering-assessment-header').getByRole('link', { name: 'Back' })
    this.pageHeading = page.getByTestId('page-title')
    this.saveAndContinue = page.getByRole('button', { name: 'Save and continue' })
  }

  async clickBackLink() {
    await this.backLink.click()
  }

  async checkPageUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  async checkPageHeading(heading: string) {
    await expect(this.pageHeading).toContainText(heading)
  }

  async clickSaveAndContinue() {
    await this.saveAndContinue.click()
  }

}
