import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { AssessmentInfoHelper, CanStartNowHelper, TargetDateHelper, type TargetDateOption } from '../helpers'

export default class CreateGoalPage extends AbstractPage {
  readonly pageHeading: Locator

  readonly goalTitleAutocomplete: Locator

  readonly goalTitleInput: Locator

  readonly isRelatedYes: Locator

  readonly isRelatedNo: Locator

  readonly addStepsButton: Locator

  readonly saveWithoutStepsButton: Locator

  readonly goalTitles: Locator

  readonly findAccomodationGoal: Locator

  readonly errorSummary: Locator

  private assessmentInfo: AssessmentInfoHelper

  private canStartNow: CanStartNowHelper

  private targetDate: TargetDateHelper

  public constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.goalTitleAutocomplete = page.locator('accessible-autocomplete-wrapper[data-initialized="true"]')
    this.goalTitleInput = this.goalTitleAutocomplete.getByRole('combobox')
    this.isRelatedYes = page
      .getByRole('group', { name: /related to any other area/i })
      .getByRole('radio', { name: 'Yes' })
    this.isRelatedNo = page
      .getByRole('group', { name: /related to any other area/i })
      .getByRole('radio', { name: 'No' })
    this.addStepsButton = page.getByRole('button', { name: /add steps/i })
    this.saveWithoutStepsButton = page.getByRole('button', { name: /save without steps/i })
    this.goalTitles = page.getByTestId('autocomplete-data-goal_title')
    this.findAccomodationGoal = page.getByRole('option', { name: 'I will find accommodation' })
    this.errorSummary = page.locator('[data-module="govuk-error-summary"]')
    this.assessmentInfo = new AssessmentInfoHelper(page)
    this.canStartNow = new CanStartNowHelper(page)
    this.targetDate = new TargetDateHelper(page)
  }

  get canStartNowYes(): Locator {
    return this.canStartNow.yesRadio
  }

  get targetDateOptions(): Locator {
    return this.targetDate.options
  }

  get assessmentInfoDetails(): Locator {
    return this.assessmentInfo.details
  }

  get assessmentInfoContent(): Locator {
    return this.assessmentInfo.content
  }

  static async verifyOnPage(page: Page): Promise<CreateGoalPage> {
    const createGoalPage = new CreateGoalPage(page)
    await expect(createGoalPage.pageHeading).toContainText(/create a goal/i)
    return createGoalPage
  }

  async enterGoalTitle(title: string): Promise<void> {
    await this.goalTitleInput.fill(title)
  }

  async selectIsRelated(isRelated: boolean): Promise<void> {
    if (isRelated) {
      await this.isRelatedYes.click()
    } else {
      await this.isRelatedNo.click()
    }
  }

  async selectRelatedArea(areaSlug: string): Promise<void> {
    await this.page.locator(`[name="related_areas_of_need"][value="${areaSlug}"]`).click()
  }

  async selectCanStartNow(canStart: boolean): Promise<void> {
    return this.canStartNow.select(canStart)
  }

  async selectTargetDateOption(option: TargetDateOption): Promise<void> {
    return this.targetDate.selectOption(option)
  }

  async clickAddSteps(): Promise<void> {
    await this.addStepsButton.click()
  }

  async clickSaveWithoutSteps(): Promise<void> {
    await this.saveWithoutStepsButton.click()
  }

  async expandAssessmentInfo(): Promise<void> {
    return this.assessmentInfo.expand()
  }

  async isAssessmentInfoCollapsed(): Promise<boolean> {
    return this.assessmentInfo.isCollapsed()
  }
}
