import { expect, type Locator, type Page } from '@playwright/test'
import { navigateToStrengthsAndNeeds, personal, sanFormPath, v1Path } from 'specs/strengthsAndNeeds/sanUtils'
import AbstractPage from '../abstractPage'

export default class PersonalRelationshipsAndCommunityPage extends AbstractPage {
  readonly mainForm: Locator

  readonly errorChildrenThatLive: Locator

  readonly enterDetailsChildrenThatLive: Locator

  readonly errorChildrenThatDoNotLive: Locator

  readonly enterDetailsChildrenThatDoNotLive: Locator

  readonly errorChildrenThatVisit: Locator

  readonly enterDetailsChildrenThatVisit: Locator

  readonly selectIfTheyAreHappy: Locator

  readonly happyAndPositive: Locator

  readonly selectTheirHistory: Locator

  readonly historyOfStable: Locator

  readonly isAbleToResolve: Locator

  readonly selectWhatTheirCurrent: Locator

  readonly stableSupportive: Locator

  readonly selectTheirExperience: Locator

  readonly positiveExperience: Locator

  readonly selectIfTheyHadChildhood: Locator

  private constructor(page: Page) {
    super(page)
    this.mainForm = page.getByTestId('main-form')
    this.errorChildrenThatLive = page.getByRole('link', { name: 'Enter details of any children that live with them' })
    this.errorChildrenThatDoNotLive = page.getByRole('link', {
      name: 'Enter details of any children that do not live with them',
    })
    this.errorChildrenThatVisit = page.getByRole('link', {
      name: 'Enter details of any children that visit them regularly',
    })
    this.enterDetailsChildrenThatLive = page.getByRole('textbox', {
      description: 'Enter details of any children that live with them',
    })
    this.enterDetailsChildrenThatDoNotLive = page.getByRole('textbox', {
      description: 'Enter details of any children that do not live with them',
    })
    this.enterDetailsChildrenThatVisit = page.getByRole('textbox', {
      description: 'Enter details of any children that visit them regularly',
    })
    this.selectIfTheyAreHappy = page.getByRole('link', { name: 'Select if they are happy with' })
    this.happyAndPositive = page.getByRole('radio', { name: 'Happy and positive about' })
    this.selectTheirHistory = page.getByRole('link', { name: 'Select their history of' })
    this.historyOfStable = page.getByRole('radio', { name: 'History of stable, supportive' })
    this.isAbleToResolve = page.getByRole('textbox', { name: 'Is Test able to resolve any' })
    this.selectWhatTheirCurrent = page.getByRole('link', { name: 'Select what their current' })
    this.stableSupportive = page.getByRole('radio', {
      name: 'Stable, supportive, positive and rewarding relationship',
      exact: true,
    })
    this.selectTheirExperience = page.getByRole('link', { name: 'Select their experience of' })
    this.positiveExperience = page.getByRole('radio', { name: 'Positive experience' })
    this.selectIfTheyHadChildhood = page.getByRole('link', { name: 'Select if they had childhood' })
  }

  /**
   * Navigates to health and wellbeing via handover link and handles the privacy screen.
   */
  static async navigateToPersonalRelationshipsAndCommunity(
    page: Page,
    handoverLink: string,
    baseUrl: string,
    url: string = 'personal-relationships-children-information',
  ): Promise<void> {
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseUrl}${sanFormPath}${v1Path}${personal}/${url}`)
    expect(page.url()).toContain(url)
  }

  static async verifyOnPage(page: Page, pageHeading: string): Promise<PersonalRelationshipsAndCommunityPage> {
    const personalRelationshipsAndCommunityPage = new PersonalRelationshipsAndCommunityPage(page)
    await expect(page.getByText(pageHeading)).toBeVisible()
    return personalRelationshipsAndCommunityPage
  }
}
