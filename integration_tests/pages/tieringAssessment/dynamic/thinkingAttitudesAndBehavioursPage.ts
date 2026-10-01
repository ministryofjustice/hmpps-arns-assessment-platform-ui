import { type Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from '../tieringAssessmentPage'

export default class ThinkingAttitudesAndBehavioursPage extends TieringAssessmentPage {

  readonly offendingLinkedActivitiesProSocial: Locator

  readonly offendingLinkedActivitiesSometimesEngages: Locator

  readonly offendingLinkedActivitiesRegularEngagement: Locator

  readonly offendingLinkedActivitiesUnknown: Locator

  readonly temperManagementManagesTemper: Locator

  readonly temperManagementSomeOutbreaks: Locator

  readonly temperManagementLosesTemper: Locator

  readonly temperManagementUnknown: Locator

  readonly impulseControlConsidersAllActions: Locator

  readonly impulseControlSometimesActsOnImpulse: Locator

  readonly impulseControlActsOnImpulseProblems: Locator

  readonly impulseControlUnknown: Locator

  readonly proCriminalAttitudesNoSupport: Locator

  readonly proCriminalAttitudesSometimesExcuses: Locator

  readonly proCriminalAttitudesSupportsCriminalBehaviour: Locator

  readonly proCriminalAttitudesUnknown: Locator

  constructor(page: Page) {
    super(page)
    this.offendingLinkedActivitiesProSocial = page.getByRole('radio', { name: 'Engages in pro-social' })
    this.offendingLinkedActivitiesSometimesEngages = page.getByRole('radio', { name: 'Sometimes engages in' })
    this.offendingLinkedActivitiesRegularEngagement = page.getByRole('radio', { name: 'Regularly engages in' })
    this.offendingLinkedActivitiesUnknown = page
      .getByRole('group', { name: 'engage in activities that could link to offending?' })
      .getByLabel('Unknown')
    this.temperManagementManagesTemper = page.getByRole('radio', { name: 'Yes, is able to manage their' })
    this.temperManagementSomeOutbreaks = page.getByRole('radio', { name: 'Sometimes has outbreaks of' })
    this.temperManagementLosesTemper = page.getByRole('radio', { name: 'No, easily loses their temper' })
    this.temperManagementUnknown = page
      .getByRole('group', { name: 'able to manage their temper?' })
      .getByLabel('Unknown')
    this.impulseControlConsidersAllActions = page.getByRole('radio', { name: 'Considers all aspects of a' })
    this.impulseControlSometimesActsOnImpulse = page.getByRole('radio', { name: 'Sometimes acts on impulse' })
    this.impulseControlActsOnImpulseProblems = page.getByRole('radio', {
      name: 'Acts on impulse which causes significant problems',
    })
    this.impulseControlUnknown = page.getByRole('group', { name: 'act on impulse?' }).getByLabel('Unknown')
    this.proCriminalAttitudesNoSupport = page.getByRole('radio', { name: 'Does not support or excuse' })
    this.proCriminalAttitudesSometimesExcuses = page.getByRole('radio', { name: 'Sometimes supports or excuses' })
    this.proCriminalAttitudesSupportsCriminalBehaviour = page.getByRole('radio', {
      name: 'Supports or excuses criminal behaviour or their pattern of behaviour and other',
    })
    this.proCriminalAttitudesUnknown = page
      .getByRole('group', { name: 'support or excuse criminal behaviour?' })
      .getByLabel('Unknown')
  }

  async clickOffendingLinkedActivitiesProSocialRadioOption() {
    await this.offendingLinkedActivitiesProSocial.click()
  }

  async clickOffendingLinkedActivitiesSometimesEngagesRadioOption() {
    await this.offendingLinkedActivitiesSometimesEngages.click()
  }

  async clickOffendingLinkedActivitiesRegularEngagementRadioOption() {
    await this.offendingLinkedActivitiesRegularEngagement.click()
  }

  async clickOffendingLinkedActivitiesUnknownRadioOption() {
    await this.offendingLinkedActivitiesUnknown.click()
  }

  async clickTemperManagementManagesTemperRadioOption() {
    await this.temperManagementManagesTemper.click()
  }

  async clickTemperManagementSomeOutbreaksRadioOption() {
    await this.temperManagementSomeOutbreaks.click()
  }

  async clickTemperManagementLosesTemperRadioOption() {
    await this.temperManagementLosesTemper.click()
  }

  async clickTemperManagementUnknownRadioOption() {
    await this.temperManagementUnknown.click()
  }

  async clickImpulseControlConsidersAllActionsRadioOption() {
    await this.impulseControlConsidersAllActions.click()
  }

  async clickImpulseControlSometimesActsOnImpulseRadioOption() {
    await this.impulseControlSometimesActsOnImpulse.click()
  }

  async clickImpulseControlActsOnImpulseProblemsRadioOption() {
    await this.impulseControlConsidersAllActions.click()
  }

  async clickImpulseControlUnknownRadioOption() {
    await this.impulseControlUnknown.click()
  }

  async clickProCriminalAttitudesNoSupportRadioOption() {
    await this.proCriminalAttitudesNoSupport.click()
  }

  async clickProCriminalAttitudesSometimesExcusesRadioOption() {
    await this.proCriminalAttitudesSometimesExcuses.click()
  }

  async clickProCriminalAttitudesSupportsCriminalBehaviourRadioOption() {
    await this.proCriminalAttitudesSupportsCriminalBehaviour.click()
  }

  async clickProCriminalAttitudesUnknownRadioOption() {
    await this.proCriminalAttitudesUnknown.click()
  }
}
