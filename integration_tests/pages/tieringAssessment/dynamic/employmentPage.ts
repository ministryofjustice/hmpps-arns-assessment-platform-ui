import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class EmploymentPage extends TieringAssessmentPage {

  readonly employmentStatusEmployed: Locator

  readonly employmentStatusSelfEmployed: Locator

  readonly employmentStatusRetired: Locator

  readonly employmentStatusUnavailableForWork: Locator

  readonly employmentStatusUnemployedLooking: Locator

  readonly employmentStatusUnemployedNotLooking: Locator

  readonly employmentStatusUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.employmentStatusEmployed = page.getByRole('radio', { name: 'Employed', exact: true })
    this.employmentStatusSelfEmployed = page.getByRole('radio', { name: 'Self-employed' })
    this.employmentStatusRetired = page.getByRole('radio', { name: 'Retired' })
    this.employmentStatusUnavailableForWork = page.getByRole('radio', { name: 'Currently unavailable for work' })
    this.employmentStatusUnemployedLooking = page.getByRole('radio', { name: 'Unemployed - actively looking' })
    this.employmentStatusUnemployedNotLooking = page.getByRole('radio', { name: 'Unemployed - not actively' })
    this.employmentStatusUnknown = page.getByRole('radio', { name: 'Unknown' })
  }

  async clickEmploymentStatusEmployedRadioOption() {
    await this.employmentStatusEmployed.click()
  }

  async clickEmploymentStatusSelfEmployedRadioOption() {
    await this.employmentStatusSelfEmployed.click()
  }

  async clickEmploymentStatusRetiredRadioOption() {
    await this.employmentStatusRetired.click()
  }

  async clickEmploymentStatusUnavailableForWorkRadioOption() {
    await this.employmentStatusUnavailableForWork.click()
  }

  async clickEmploymentStatusUnemployedLookingRadioOption() {
    await this.employmentStatusUnemployedLooking.click()
  }

  async clickEmploymentStatusUnemployedNotLookingRadioOption() {
    await this.employmentStatusUnemployedNotLooking.click()
  }

  async clickEmploymentStatusUnknownRadioOption() {
    await this.employmentStatusUnknown.click()
  }
}
