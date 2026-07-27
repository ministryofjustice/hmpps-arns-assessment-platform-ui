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
