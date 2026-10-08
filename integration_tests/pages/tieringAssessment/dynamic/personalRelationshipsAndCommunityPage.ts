import { expect, type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class PersonalRelationshipsAndCommunityPage extends TieringAssessmentPage {

  readonly importantPeoplePartner: Locator

  readonly importantPeopleChildrenOrWards: Locator

  readonly importantPeopleOtherChildren: Locator

  readonly importantPeopleFamily: Locator

  readonly importantPeopleFriends: Locator

  readonly importantPeopleOther: Locator

  readonly importantPeopleUnknown: Locator

  readonly relationshipStatusHappy: Locator

  readonly relationshipStatusConcerns: Locator

  readonly relationshipStatusUnHappy: Locator

  readonly relationshipStatusUnknown: Locator

  readonly relationshipFirstQuestionError: Locator

  readonly relationshipSecondQuestionError: Locator

  constructor(page: Page) {
    super(page)
    this.importantPeoplePartner = page.getByRole('checkbox', { name: "Partner or someone they're in" })
    this.importantPeopleChildrenOrWards = page.getByRole('checkbox', { name: 'Their children or anyone they' })
    this.importantPeopleOtherChildren = page.getByRole('checkbox', { name: 'Other children' })
    this.importantPeopleFamily = page.getByRole('checkbox', { name: 'Family members' })
    this.importantPeopleFriends = page.getByRole('checkbox', { name: 'Friends' })
    this.importantPeopleOther = page.getByRole('checkbox', { name: 'Other', exact: true })
    this.importantPeopleUnknown = page.getByRole('checkbox', { name: 'Unknown' })
    this.relationshipStatusHappy = page.getByRole('radio', { name: 'Happy and positive about' })
    this.relationshipStatusConcerns = page.getByRole('radio', { name: 'Has some concerns about their' })
    this.relationshipStatusUnHappy = page.getByRole('radio', { name: 'Unhappy about their' })
    this.relationshipStatusUnknown = page.getByRole('radio', { name: 'Unknown' })
    this.relationshipFirstQuestionError = page.locator('[href="#important_relationships"]')
    this.relationshipSecondQuestionError = page.locator('[href="#relationship_satisfaction"]')
  }

  async clickImportantPeoplePartnerCheckboxOption() {
    await this.importantPeoplePartner.click()
  }

  async clickImportantPeopleChildrenOrWardsCheckboxOption() {
    await this.importantPeopleChildrenOrWards.click()
  }

  async clickImportantPeopleOtherChildrenCheckboxOption() {
    await this.importantPeopleOtherChildren.click()
  }

  async clickImportantPeopleFamilyCheckboxOption() {
    await this.importantPeopleFamily.click()
  }

  async clickImportantPeopleFriendsCheckboxOption() {
    await this.importantPeopleFriends.click()
  }

  async clickImportantPeopleOtherCheckboxOption() {
    await this.importantPeopleOther.click()
  }

  async clickImportantPeopleUnknownCheckboxOption() {
    await this.importantPeopleUnknown.click()
  }

  async clickRelationshipStatusHappyRadioOption() {
    await this.relationshipStatusHappy.click()
  }

  async clickRelationshipStatusConcernsRadioOption() {
    await this.relationshipStatusConcerns.click()
  }

  async clickRelationshipStatusUnHappyRadioOption() {
    await this.relationshipStatusUnHappy.click()
  }

  async clickRelationshipStatusUnknownRadioOption() {
    await this.relationshipStatusUnknown.click()
  }

  async checkFirstQuestionError() {
    await expect(this.relationshipFirstQuestionError).toContainText(
      '"\\"Select·who·the·important·people·in·Charles\'·life·are,·or·select·\'Unknown\'\\""',
    )
  }

  async checkSecondQuestionError() {
    await expect(this.relationshipSecondQuestionError).toContainText(
      '"\\"Select·whether·Charles\'·is·happy·with·their·current·relationship·status,·or·select·\'Unknown\'\\""',
    )
  }

}
