import { type Locator, type Page } from '@playwright/test'

export default class AbstractPage {
  readonly page: Page

  /** user name that appear in header */
  readonly usersName: Locator

  /** phase banner that appear in header */
  readonly phaseBanner: Locator

  /** link to sign out */
  readonly signoutLink: Locator

  /** account type text shown under username in header */
  readonly accountType: Locator

  readonly saveAndContinue: Locator

  readonly summary: Locator

  readonly errorEnterDetails: Locator

  readonly enterDetails: Locator

  readonly goToPractitionerAnalysis: Locator

  readonly practitionerAnalysis: Locator

  readonly returnToOASys: Locator

  readonly markComplete: Locator

  readonly linkedToRiskOfReoffending: Locator

  readonly alert: Locator

  readonly errorWantsToMakeChanges: Locator

  readonly yesAlreadyMadePositiveChanges: Locator

  readonly yes: Locator

  protected constructor(page: Page) {
    this.page = page
    this.phaseBanner = page.getByTestId('header-phase-banner')
    this.usersName = page.getByTestId('header-user-name')
    this.signoutLink = page.getByText('Sign out')
    this.accountType = page.locator('.arns-common-header__menu-toggle-label, .arns-common-header__oasys-account-label')
    this.saveAndContinue = page.getByRole('button', { name: 'Save and continue' })
    this.summary = page.getByRole('tabpanel', { name: 'Summary' })
    this.errorEnterDetails = page.getByRole('link', { name: 'Enter details' })
    this.enterDetails = page.getByRole('textbox', { description: 'Enter details' })
    this.goToPractitionerAnalysis = page.getByRole('button', { name: 'Go to practitioner analysis' })
    this.practitionerAnalysis = page.getByRole('link', { name: 'Practitioner analysis' })
    this.returnToOASys = page.getByRole('link', { name: 'Go to the OASys homepage' })
    this.markComplete = page.getByRole('button', { name: 'Mark as complete' })
    this.linkedToRiskOfReoffending = page
      .getByRole('group', { name: 'linked to risk of reoffending?' })
      .getByLabel('No')
    this.alert = page.getByRole('alert')
    this.errorWantsToMakeChanges = page.getByRole('link', {
      name: 'Select if they want to make changes to their',
    })
    this.yesAlreadyMadePositiveChanges = page.getByRole('radio', {
      name: 'I have already made positive changes and want to maintain them',
    })
    this.yes = page.getByRole('radio', { name: 'Yes' })
  }

  async signOut() {
    const menuToggle = this.page.locator('.arns-common-header__user-menu-toggle')

    if (await menuToggle.isVisible()) {
      await menuToggle.click()
    }

    await this.signoutLink.first().click()
  }
}
