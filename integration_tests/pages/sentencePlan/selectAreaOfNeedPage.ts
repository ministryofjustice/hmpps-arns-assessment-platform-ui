import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class SelectAreaOfNeedPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly areaOfNeedFieldset: Locator

  readonly areaOfNeedRadios: Locator

  readonly continueButton: Locator

  readonly backLink: Locator

  readonly errorSummary: Locator

  readonly fieldError: Locator

  private constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.areaOfNeedFieldset = page.getByRole('group', { name: /what is the area of need/i })
    this.areaOfNeedRadios = page.locator('[name="area_of_need"]')
    this.continueButton = page.getByRole('button', { name: /continue/i })
    this.backLink = page.locator('.govuk-back-link')
    this.errorSummary = page.locator('[data-module="govuk-error-summary"]')
    this.fieldError = page.locator('#area_of_need-error')
  }

  static async verifyOnPage(page: Page): Promise<SelectAreaOfNeedPage> {
    const selectAreaOfNeedPage = new SelectAreaOfNeedPage(page)
    await expect(selectAreaOfNeedPage.areaOfNeedFieldset).toBeVisible()

    return selectAreaOfNeedPage
  }

  areaRadio(areaSlug: string): Locator {
    return this.page.locator(`[name="area_of_need"][value="${areaSlug}"]`)
  }

  async selectArea(areaSlug: string): Promise<void> {
    await this.areaRadio(areaSlug).click()
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click()
  }

  async selectAreaAndContinue(areaSlug: string): Promise<void> {
    await this.selectArea(areaSlug)
    await this.clickContinue()
  }
}
