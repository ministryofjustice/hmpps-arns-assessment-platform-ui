import { type Locator, type Page } from '@playwright/test'

/**
 * Helper class for interacting with the AssessmentInfoDetails component.
 * Use composition to add assessment info support to any page object.
 *
 * @example
 * class MyPage extends AbstractPage {
 *   private assessmentInfo: AssessmentInfoHelper
 *
 *   constructor(page: Page) {
 *     super(page)
 *     this.assessmentInfo = new AssessmentInfoHelper(page)
 *   }
 *
 *   // Delegate properties and methods
 *   get assessmentInfoDetails() { return this.assessmentInfo.details }
 *   get assessmentInfoContent() { return this.assessmentInfo.content }
 *   expandAssessmentInfo() { return this.assessmentInfo.expand() }
 *   isAssessmentInfoCollapsed() { return this.assessmentInfo.isCollapsed() }
 * }
 */
export default class AssessmentInfoHelper {
  readonly details: Locator

  readonly summary: Locator

  readonly content: Locator

  constructor(page: Page) {
    this.details = page.locator('[data-qa="assessment-info-details"]')
    this.summary = this.details.locator('summary')
    this.content = this.details.locator('.govuk-details__text')
  }

  async expand(): Promise<void> {
    const isOpen = await this.details.getAttribute('open')
    if (isOpen === null) {
      await this.summary.click()
    }
  }

  async isCollapsed(): Promise<boolean> {
    const isOpen = await this.details.getAttribute('open')
    return isOpen === null
  }
}
