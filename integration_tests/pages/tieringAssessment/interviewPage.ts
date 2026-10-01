import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from './tieringAssessmentPage'

export default class InterviewPage extends TieringAssessmentPage {

  readonly interviewYes: Locator

  readonly interviewNo: Locator

  constructor(page: Page) {
    super(page)
    this.interviewYes = page.getByRole('radio', { name: 'Yes' })
    this.interviewNo = page.getByRole('radio', { name: 'No' })
  }

  async clickInterviewYesRadioOption() {
    await this.interviewYes.click()
  }

  async clickInterviewNoRadioOption() {
    await this.interviewNo.click()
  }
}
