import { expect, type Locator, type Page } from '@playwright/test'
import { health, navigateToStrengthsAndNeeds, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class HealthAndWellbeingPage extends AbstractPage {
  readonly incomplete: Locator

  readonly currentEmploymentStatus: Locator

  readonly mainSection: Locator

  readonly selectIfTheyAreCurrently: Locator

  readonly isCurrentlyHaving: Locator

  readonly selectIfTheyHaveHad: Locator

  readonly hadAHeadInjury: Locator

  readonly selectIfTheyHaveAny: Locator

  readonly haveAnyNeurodiverse: Locator

  readonly selectIfTheyAreAbleTo: Locator

  readonly yesAbleToCope: Locator

  readonly selectTheirAttitude: Locator

  readonly positiveAndResonably: Locator

  readonly selectIfTheyHaveEver: Locator

  readonly hasSelfHarmed: Locator

  readonly selectIfAttempted: Locator

  readonly hasEverAttempted: Locator

  readonly selectHowOptimistic: Locator

  readonly optimistic: Locator

  private constructor(page: Page) {
    super(page)
    this.incomplete = page.getByText('Incomplete')
    this.currentEmploymentStatus = page.getByTestId('main-form')
    this.mainSection = page.getByText('Back Health and wellbeing')
    this.selectIfTheyAreCurrently = page.getByRole('link', { name: 'Select if they are currently' })
    this.isCurrentlyHaving = page.getByRole('group', { name: 'Is Test currently having' }).getByLabel('Yes')
    this.selectIfTheyHaveHad = page.getByRole('link', { name: 'Select if they have had a' })
    this.hadAHeadInjury = page.getByRole('group', { name: 'Has Test had a head injury or' }).getByLabel('Yes')
    this.selectIfTheyHaveAny = page.getByRole('link', { name: 'Select if they have any' })
    this.haveAnyNeurodiverse = page
      .getByRole('group', { name: 'Does Test have any neurodiverse conditions?' })
      .getByLabel('Yes')
    this.selectIfTheyAreAbleTo = page.getByRole('link', { name: 'Select if they are able to' })
    this.yesAbleToCope = page.getByRole('radio', { name: 'Yes, able to cope well' })
    this.selectTheirAttitude = page.getByRole('link', { name: 'Select their attitude towards' })
    this.positiveAndResonably = page.getByRole('radio', { name: 'Positive and reasonably happy' })
    this.selectIfTheyHaveEver = page.getByRole('link', { name: 'Select if they have ever self' })
    this.hasSelfHarmed = page
      .getByRole('group', { name: 'Has Test ever self-harmed?' })
      .getByLabel('Yes', { exact: true })
    this.selectIfAttempted = page.getByRole('link', {
      name: 'Select if they have ever attempted suicide or had suicidal thoughts',
    })
    this.hasEverAttempted = page
      .getByRole('group', { name: 'Has Test ever attempted' })
      .getByLabel('Yes', { exact: true })
    this.selectHowOptimistic = page.getByRole('link', { name: 'Select how optimistic they' })
    this.optimistic = page.getByRole('radio', { name: 'Optimistic and has a positive' })
  }

  /**
   * Navigates to health and wellbeing via handover link and handles the privacy screen.
   */
  static async navigateToHealthAndWellbeing(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'health-wellbeing',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${health}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<HealthAndWellbeingPage> {
    const healthAndWellbeingPage = new HealthAndWellbeingPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return healthAndWellbeingPage
  }

  async giveDetailsCharacterError(count: string) {
    return this.page.getByText(`You have ${count} characters too many`).first()
  }
}
