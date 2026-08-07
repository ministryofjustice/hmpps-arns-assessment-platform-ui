import { expect, type Locator, type Page } from '@playwright/test'
import { navigateToStrengthsAndNeeds, sanFormPath, thinking, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class ThinkingBehavioursAndAttitudesPage extends AbstractPage {
  readonly mainForm: Locator

  readonly no: Locator

  readonly errorConsequences: Locator

  readonly errorStableBehaviour: Locator

  readonly errorEngagesInOffendingActivities: Locator

  readonly errorResilientToPeerPressure: Locator

  readonly errorAbleToSolveProblems: Locator

  readonly errorUnderstandsPeoplesViews: Locator

  readonly errorManipulativeOrPredatory: Locator

  readonly errorManagesTemper: Locator

  readonly errorUsesViolenceOrAggression: Locator

  readonly errorActsOnImpulse: Locator

  readonly errorPositiveAttitudeCJStaff: Locator

  readonly errorHostileOrientation: Locator

  readonly errorAcceptsSupervision: Locator

  readonly errorSupportsCriminalBehaviour: Locator

  readonly yesAwareOfTheConsequences: Locator

  readonly yesShowsStableBehaviour: Locator

  readonly yesEngagesInProSocialActivities: Locator

  readonly yesResilientTowardsPeerPressure: Locator

  readonly yesAbleToSolveProblems: Locator

  readonly yesUnderstandsPeoplesViews: Locator

  readonly yesHonestAccountNoManipulative: Locator

  readonly yesAbleToManageTemper: Locator

  readonly yesDoesNotUseViolence: Locator

  readonly yesConsidersAllAspectsBeforeActing: Locator

  readonly yesConstructiveConversationsAndForgives: Locator

  readonly yesHasAPositiveAttitude: Locator

  readonly yesAcceptsSupervision: Locator

  readonly yesDoesNotSupportCriminalBehaviour: Locator

  private constructor(page: Page) {
    super(page)
    this.mainForm = page.getByTestId('main-form')
    this.no = page.getByRole('radio', { name: 'No' })
    this.errorConsequences = page.getByRole('link', {
      name: 'Select if they are aware of the consequences of their actions',
    })
    this.errorStableBehaviour = page.getByRole('link', { name: 'Select if they show stable behaviour' })
    this.errorEngagesInOffendingActivities = page.getByRole('link', {
      name: 'Select if they engage in activities that could link to offending',
    })
    this.errorResilientToPeerPressure = page.getByRole('link', {
      name: 'Select if they’re resilient towards peer pressure or influence by criminal associates',
    })
    this.errorAbleToSolveProblems = page.getByRole('link', {
      name: 'Select if they are able to solve problems in a positive way',
    })
    this.errorUnderstandsPeoplesViews = page.getByRole('link', {
      name: 'Select if they understand other people’s views',
    })
    this.errorManipulativeOrPredatory = page.getByRole('link', {
      name: 'Select if they show manipulative behaviour or a predatory lifestyle',
    })
    this.errorManagesTemper = page.getByRole('link', { name: 'Select if they are able to manage their temper' })
    this.errorUsesViolenceOrAggression = page.getByRole('link', {
      name: 'Select if they use violence, aggressive or controlling behaviour to get their own way',
    })
    this.errorActsOnImpulse = page.getByRole('link', { name: 'Select if they act on impulse' })
    this.errorPositiveAttitudeCJStaff = page.getByRole('link', {
      name: 'Select if they have a positive attitude towards any criminal justice staff they have come into contact with',
    })
    this.errorHostileOrientation = page.getByRole('link', {
      name: 'Select if they have hostile orientation to others or to general rules',
    })
    this.errorAcceptsSupervision = page.getByRole('link', {
      name: 'Select if they accept supervision and their licence conditions',
    })
    this.errorSupportsCriminalBehaviour = page.getByRole('link', {
      name: 'Select if they support or excuse criminal behaviour',
    })
    this.yesAwareOfTheConsequences = page.getByRole('radio', {
      name: 'Yes, is aware of the consequences of their actions',
    })
    this.yesShowsStableBehaviour = page.getByRole('radio', { name: 'Yes, shows stable behaviour' })
    this.yesEngagesInProSocialActivities = page.getByRole('radio', {
      name: 'Engages in pro-social activities and understands the link to offending',
    })
    this.yesResilientTowardsPeerPressure = page.getByRole('radio', {
      name: 'Yes, resilient towards peer pressure or influence by criminal associates',
    })
    this.yesAbleToSolveProblems = page.getByRole('radio', {
      name: 'Yes, is able to solve problems and identify appropriate solutions',
    })
    this.yesUnderstandsPeoplesViews = page.getByRole('radio', {
      name: 'Yes, understands other people’s views and is able to distinguish between their own feelings and those of others',
    })
    this.yesHonestAccountNoManipulative = page.getByRole('radio', {
      name: 'Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle',
    })
    this.yesAbleToManageTemper = page.getByRole('radio', { name: 'Yes, is able to manage their temper well' })
    this.yesDoesNotUseViolence = page.getByRole('radio', {
      name: 'Does not use violence, aggressive or controlling behaviour to get their own way',
    })
    this.yesConsidersAllAspectsBeforeActing = page.getByRole('radio', {
      name: 'Considers all aspects of a situation before acting on or making a decision',
    })
    this.yesHasAPositiveAttitude = page.getByRole('radio', { name: 'Yes, has a positive attitude' })
    this.yesConstructiveConversationsAndForgives = page.getByRole('radio', {
      name: 'They’re able to have constructive conversations when they disagree with others and can forgive past wrongs',
    })
    this.yesAcceptsSupervision = page.getByRole('radio', {
      name: 'Accepts supervision and has responded well to supervision in the past',
    })
    this.yesDoesNotSupportCriminalBehaviour = page.getByRole('radio', {
      name: 'Does not support or excuse criminal behaviour',
    })
  }

  /**
   * Navigates to thinking behaviours via handover link and handles the privacy screen.
   */
  static async navigateToThinkingBehavioursAndAttitudes(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'thinking-behaviours',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${thinking}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<ThinkingBehavioursAndAttitudesPage> {
    const thinkingBehavioursAndAttitudesPage = new ThinkingBehavioursAndAttitudesPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return thinkingBehavioursAndAttitudesPage
  }
}
