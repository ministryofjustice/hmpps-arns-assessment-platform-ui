import { expect, type Locator, type Page } from '@playwright/test'
import { employment, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class EmploymentAndEducationPage extends AbstractPage {
  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  readonly mainSection: Locator

  readonly selectTypeOfEmployment: Locator

  readonly fullTime: Locator

  readonly selectOneOption: Locator

  readonly yesHasBeenEmployedBefore: Locator

  readonly selectTheirEmploymentHistory: Locator

  readonly continuousEmploymentHistory: Locator

  readonly selectAdditionalDayToDay: Locator

  readonly caringResponsibilities: Locator

  readonly selectTheHighestLevel: Locator

  readonly entryLevel: Locator

  readonly selectIfTheyHaveAnyProfessional: Locator

  readonly haveAnyProfessional: Locator

  readonly selectIfTheyHaveAnySkills: Locator

  readonly yesHasSkills: Locator

  readonly selectIfTheyHaveDifficulties: Locator

  readonly yesWithReading: Locator

  readonly selectTheirOverall: Locator

  readonly positiveOverall: Locator

  readonly selectTheirExperienceOf: Locator

  readonly positiveExperienceOf: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Employment and education')
    this.selectTypeOfEmployment = page.getByRole('link', { name: 'Select one option' })
    this.fullTime = page.getByLabel('Full-time')
    this.selectOneOption = page.getByRole('link', { name: 'Select one option' })
    this.yesHasBeenEmployedBefore = page.getByRole('radio', { name: 'Yes, has been employed before' })
    this.selectTheirEmploymentHistory = page.getByRole('link', { name: 'Select their employment history' })
    this.continuousEmploymentHistory = page.getByRole('radio', { name: 'Continuous employment history' })
    this.selectAdditionalDayToDay = page.getByRole('link', {
      name: 'Select if they have any additional day-to-day commitments',
    })
    this.caringResponsibilities = page.getByRole('checkbox', { name: 'Caring responsibilities' })
    this.selectTheHighestLevel = page.getByRole('link', { name: 'Select the highest level of' })
    this.entryLevel = page.getByRole('radio', { name: 'Entry level' })
    this.selectIfTheyHaveAnyProfessional = page.getByRole('link', {
      name: 'Select if they have any professional or vocational qualifications',
    })
    this.haveAnyProfessional = page
      .getByRole('group', { name: 'have any professional or vocational qualifications?' })
      .getByLabel('Yes')
    this.selectIfTheyHaveAnySkills = page.getByRole('link', {
      name: 'Select if they have any skills that could help them in a job or to get a job',
    })
    this.yesHasSkills = page.getByRole('radio', {
      name: 'Yes',
      description: 'This includes any completed training, qualifications, work experience or transferable skills.',
      exact: true,
    })
    this.selectIfTheyHaveDifficulties = page.getByRole('link', { name: 'Select if they have difficulties' })
    this.yesWithReading = page.getByRole('checkbox', { name: 'Yes, with reading' })
    this.selectTheirOverall = page.getByRole('link', { name: 'Select their overall' })
    this.positiveOverall = page
      .getByRole('group', { name: "What is Test's overall" })
      .getByLabel('Positive', { exact: true })
    this.selectTheirExperienceOf = page.getByRole('link', { name: 'Select their experience of' })
    this.positiveExperienceOf = page
      .getByRole('group', { name: "What is Test's experience of" })
      .getByLabel('Positive', { exact: true })
  }

  /**
   * Navigates to a employment and education via handover link and handles the privacy screen.
   */
  static async navigateToEmploymentAndEducation(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    subPage: string = 'current-employment',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${employment}/${subPage}`)
    expect(page.url()).toContain(subPage)
  }

  static async verifyOnPage(page: Page, heading: string): Promise<EmploymentAndEducationPage> {
    const employmentAndEducationPage = new EmploymentAndEducationPage(page)
    await expect(page.getByText(heading)).toBeVisible()
    return employmentAndEducationPage
  }
}
