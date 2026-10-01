import { expect, Locator, type Page } from '@playwright/test'
import TieringAssessmentPage from './tieringAssessmentPage'

export default class CheckAnswersPage extends TieringAssessmentPage {

  readonly staticHeader: Locator

  readonly currentOffenceSubHeader: Locator

  // todo add the 3 current offence row answers
  readonly currentOffenceAndOffendingHistorySubHeading: Locator

  readonly firstSanctionDateAnswer: Locator

  readonly totalSanctionsAnswer: Locator

  readonly violentSanctionsAnswer: Locator

  readonly sexualSanctionsAnswer: Locator

  readonly sexualOffendingSubHeading: Locator

  readonly currentOffenceSexualAnswer: Locator

  readonly mostRecentSexualDateAnswer: Locator

  readonly directContactCountAnswer: Locator

  readonly directContactChildCountAnswer: Locator

  readonly victimStrangerAnswer: Locator

  readonly indecentImagesCountAnswer: Locator

  readonly nonContactCountAnswer: Locator

  readonly currentSupervisionDateSubHeading: Locator

  readonly currentSupervisionDateAnswer: Locator

  readonly offencesSinceSupervisionSubHeading: Locator

  readonly offencesSinceSupervisionAnswer: Locator
  // todo add mostRecentOffenceDateAnswer row answer (requires a large change to revealed question answer rows)

  readonly interviewSubHeading: Locator

  readonly interviewAnswer: Locator

  readonly dynamicHeader: Locator

  readonly accommodationSubHeading: Locator

  readonly livingWithAnswer: Locator

  readonly accommodationSuitableAnswer: Locator

  readonly employmentSubHeading: Locator

  readonly employmentStatusAnswer: Locator

  readonly drugUseSubHeading: Locator

  readonly everUsedDrugsAnswer: Locator

  readonly whichDrugsAnswer: Locator

  readonly motivationToStopAnswer: Locator

  readonly alcoholUseSubHeading: Locator

  readonly everUsedAlcoholAnswer: Locator

  readonly alcoholHowOftenAnswer: Locator

  readonly alcoholUnitsAnswer: Locator

  readonly bingeDrinkingAnswer: Locator

  readonly personalRelationshipsSubHeading: Locator

  readonly importantPeopleAnswer: Locator

  readonly happyWithStatusAnswer: Locator

  readonly ThinkingAttitudesBehavioursSubHeading: Locator

  readonly offendingLinkedActivitiesAnswer: Locator

  readonly temperManagementAnswer: Locator

  readonly impulseAnswer: Locator

  readonly proCrimeAnswer: Locator

  readonly offenceAnalysisSubHeading: Locator

  readonly currentOffenceElementsAnswer: Locator

  readonly domesticAbuseAnswer: Locator

  readonly domesticAbuseAgainstAnswer: Locator

  readonly riskOfSeriousHarmSubHeading: Locator

  readonly previousConvictionsAnswer: Locator

  readonly viewPredictorsButton: Locator

  constructor(page: Page) {
    super(page)
    /** Static */
    this.staticHeader = page.getByRole('heading', { name: 'Static factors' })
    this.currentOffenceSubHeader = page.getByTestId('heading_current_offence')
    // todo add the 3 current offence row answers
    this.currentOffenceAndOffendingHistorySubHeading = page.getByTestId('heading_current_offence_and_offending_history')
    this.firstSanctionDateAnswer = page.getByTestId('answer_date_at_first_sanction')
    this.totalSanctionsAnswer = page.getByTestId('answer_number_of_sanctions_for_all_offences')
    this.violentSanctionsAnswer = page.getByTestId('answer_number_of_violent_sanctions')
    this.sexualSanctionsAnswer = page.getByTestId('answer_has_ever_committed_sexual_offence')
    this.sexualOffendingSubHeading = page.getByTestId('heading_sexual_offending')
    this.currentOffenceSexualAnswer = page.getByTestId('answer_current_offence_sexually_motivated')
    this.mostRecentSexualDateAnswer = page.getByTestId('answer_date_of_most_recent_sexual_offence')
    this.directContactCountAnswer = page.getByTestId('answer_number_of_contact_sexual_sanctions')
    this.directContactChildCountAnswer = page.getByTestId('answer_number_of_contact_child_sexual_sanctions')
    this.victimStrangerAnswer = page.getByTestId('answer_victim_stranger')
    this.indecentImagesCountAnswer = page.getByTestId('answer_indecent_child_images')
    this.nonContactCountAnswer = page.getByTestId('answer_non_contact')
    this.currentSupervisionDateSubHeading = page.getByTestId('heading_date_of_current_supervision')
    this.currentSupervisionDateAnswer = page.getByTestId('answer_date_of_current_supervision')
    this.offencesSinceSupervisionSubHeading = page.getByTestId('heading_offences_since_community_date')
    this.offencesSinceSupervisionAnswer = page.getByTestId('answer_has_committed_offence_since_supervision_date')
    // todo add mostRecentOffenceDateAnswer row answer (requires a large change to revealed question answer rows)
    this.interviewSubHeading = page.getByTestId('heading_interview_question')
    this.interviewAnswer = page.getByTestId('answer_have_you_done_an_interview')
    /** Dynamic */
    this.dynamicHeader = page.getByRole('heading', { name: 'Dynamic factors' })
    this.accommodationSubHeading = page.getByTestId('heading_accommodation')
    this.livingWithAnswer = page.getByTestId('answer_who_are_they_living_with')
    this.accommodationSuitableAnswer = page.getByTestId('answer_suitability_of_accommodation')
    this.employmentSubHeading = page.getByTestId('heading_employment')
    this.employmentStatusAnswer = page.getByTestId('answer_is_unemployed')
    this.drugUseSubHeading = page.getByTestId('heading_drug_misuse')
    this.everUsedDrugsAnswer = page.getByTestId('answer_ever_misused_drugs')
    this.whichDrugsAnswer = page.getByTestId('answer_drug_use')
    this.motivationToStopAnswer = page.getByTestId('answer_motivation_to_tackle_drug_misuse')
    this.alcoholUseSubHeading = page.getByTestId('heading_alcohol_ever_used')
    this.everUsedAlcoholAnswer = page.getByTestId('answer_has_ever_drunk_alcohol')
    this.alcoholHowOftenAnswer = page.getByTestId('answer_current_alcohol_use')
    this.alcoholUnitsAnswer = page.getByTestId('answer_units_of_alcohol')
    this.bingeDrinkingAnswer = page.getByTestId('answer_alcohol_use_binge_drinking')
    this.personalRelationshipsSubHeading = page.getByTestId('heading_personal_relationships_and_community')
    this.importantPeopleAnswer = page.getByTestId('answer_important_relationships')
    this.happyWithStatusAnswer = page.getByTestId('answer_relationship_satisfaction')
    this.ThinkingAttitudesBehavioursSubHeading = page.getByTestId('heading_thinking_attitudes_and_behaviours')
    this.offendingLinkedActivitiesAnswer = page.getByTestId('answer_regular_offending_activities')
    this.temperManagementAnswer = page.getByTestId('answer_temper_control')
    this.impulseAnswer = page.getByTestId('answer_impulsivity_problems')
    this.proCrimeAnswer = page.getByTestId('answer_pro_criminal_attitudes')
    this.offenceAnalysisSubHeading = page.getByTestId('heading_offence_analysis')
    this.currentOffenceElementsAnswer = page.getByTestId('answer_offence_elements')
    this.domesticAbuseAnswer = page.getByTestId('answer_evidence_of_domestic_abuse')
    this.domesticAbuseAgainstAnswer = page.getByTestId('answer_domestic_abuse_against')
    this.riskOfSeriousHarmSubHeading = page.getByTestId('heading_previous_convictions')
    this.previousConvictionsAnswer = page.getByTestId('answer_previous_convictions')
    /** Button */
    this.viewPredictorsButton = page.getByRole('button', { name: 'View reoffending predictors' })
  }

  /** Current offence */

  async checkStaticFactorsHeaderVisible() {
    await expect(this.staticHeader).toBeVisible()
  }

  async checkCurrentOffenceSubHeaderVisible() {
    await expect(this.currentOffenceSubHeader).toBeVisible()
  }

  /** Current offence and Offending history */

  async checkCurrentOffenceAndOffendingHistorySubHeadingVisible() {
    await expect(this.currentOffenceAndOffendingHistorySubHeading).toBeVisible()
  }

  async checkFirstSanctionDateAnswerValue(value: string = '30 June 1990') {
    await expect(this.firstSanctionDateAnswer).toBeVisible()
    await expect(this.firstSanctionDateAnswer).toContainText(value)
  }

  async checkTotalSanctionsAnswerValue(value: string = '8') {
    await expect(this.totalSanctionsAnswer).toBeVisible()
    await expect(this.totalSanctionsAnswer).toContainText(value)
  }

  async checkViolentSanctionsAnswerValue(value: string = '5') {
    await expect(this.violentSanctionsAnswer).toBeVisible()
    await expect(this.violentSanctionsAnswer).toContainText(value)
  }

  async checkSexualSanctionsAnswerValue(value: string = 'Yes') {
    await expect(this.sexualSanctionsAnswer).toBeVisible()
    await expect(this.sexualSanctionsAnswer).toContainText(value)
  }

  /** Sexual offending */

  async checkSexualOffendingSubHeadingVisible(isVisible: boolean = true) {
    await expect(this.sexualOffendingSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkCurrentOffenceSexualAnswerValue(value: string = 'Yes') {
    await expect(this.currentOffenceSexualAnswer).toBeVisible()
    await expect(this.currentOffenceSexualAnswer).toContainText(value)
  }

  async checkMostRecentSexualDateAnswerValue(value: string = '30 June 2015') {
    await expect(this.mostRecentSexualDateAnswer).toBeVisible()
    await expect(this.mostRecentSexualDateAnswer).toContainText(value)
  }

  async checkDirectContactCountAnswerValue(value: string = '1') {
    await expect(this.directContactCountAnswer).toBeVisible()
    await expect(this.directContactCountAnswer).toContainText(value)
  }

  async checkDirectContactChildCountAnswerValue(value: string = '1') {
    await expect(this.directContactChildCountAnswer).toBeVisible()
    await expect(this.directContactChildCountAnswer).toContainText(value)
  }

  async checkVictimStrangerAnswerValue(value: string = 'Yes') {
    await expect(this.victimStrangerAnswer).toBeVisible()
    await expect(this.victimStrangerAnswer).toContainText(value)
  }

  async checkIndecentImagesCountAnswerValue(value: string = '1') {
    await expect(this.indecentImagesCountAnswer).toBeVisible()
    await expect(this.indecentImagesCountAnswer).toContainText(value)
  }

  async checkNonContactCountAnswerValue(value: string = '1') {
    await expect(this.nonContactCountAnswer).toBeVisible()
    await expect(this.nonContactCountAnswer).toContainText(value)
  }

  /** Current supervision date */

  async checkCurrentSupervisionDateSubHeadingVisible(isVisible: boolean = true) {
    await expect(this.currentSupervisionDateSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkCurrentSupervisionDateAnswerValue(value: string = '30 June 2025') {
    await expect(this.currentSupervisionDateAnswer).toBeVisible()
    await expect(this.currentSupervisionDateAnswer).toContainText(value)
  }

  /** Offences since community date */

  async checkOffencesSinceSupervisionSubHeadingVisible(isVisible: boolean = true) {
    await expect(this.offencesSinceSupervisionSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkOffencesSinceSupervisionAnswerValue(value: string = 'Yes') {
    await expect(this.offencesSinceSupervisionAnswer).toBeVisible()
    await expect(this.offencesSinceSupervisionAnswer).toContainText(value)
  }

  /** Interview */

  async checkInterviewSubHeadingVisible(isVisible: boolean = true) {
    await expect(this.interviewSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkInterviewAnswerValue(value: string = 'No') {
    await expect(this.interviewAnswer).toBeVisible()
    await expect(this.interviewAnswer).toContainText(value)
  }

  /** Dynamic factors */

  async checkDynamicHeaderVisible(isVisible: boolean = false) {
    await expect(this.dynamicHeader).toBeVisible({ visible: isVisible })
  }

  /** Accommodation */

  async checkAccommodationSubHeadingVisible(isVisible: boolean) {
    await expect(this.accommodationSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkLivingWithAnswer(values: string | string[]) {
    const expectedArray = Array.isArray(values) ? values : [values]
    await expect(this.livingWithAnswer).toHaveText(expectedArray)
  }

  async checkAccommodationSuitableAnswer(value: string) {
    await expect(this.accommodationSuitableAnswer).toBeVisible()
    await expect(this.accommodationSuitableAnswer).toContainText(value)
  }

  /** Employment */

  async checkEmploymentSubHeadingVisible(isVisible: boolean) {
    await expect(this.employmentSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkEmploymentStatusAnswer(value: string) {
    await expect(this.employmentStatusAnswer).toBeVisible()
    await expect(this.employmentStatusAnswer).toContainText(value)
  }

  /** Drug use */

  async checkDrugUseSubHeadingVisible(isVisible: boolean) {
    await expect(this.drugUseSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkEverUsedDrugsAnswer(value: string) {
    await expect(this.everUsedDrugsAnswer).toBeVisible()
    await expect(this.everUsedDrugsAnswer).toContainText(value)
  }

  async checkWhichDrugsAnswer(values: string | string[]) {
    const expectedArray = Array.isArray(values) ? values : [values]
    await expect(this.whichDrugsAnswer).toHaveText(expectedArray)
  }

  async checkMotivationToStopAnswer(value: string) {
    await expect(this.motivationToStopAnswer).toBeVisible()
    await expect(this.motivationToStopAnswer).toContainText(value)
  }

  /** Alcohol use */

  async checkAlcoholUseSubHeadingVisible(isVisible: boolean) {
    await expect(this.alcoholUseSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkEverUsedAlcoholAnswer(value: string) {
    await expect(this.everUsedAlcoholAnswer).toBeVisible()
    await expect(this.everUsedAlcoholAnswer).toContainText(value)
  }

  async checkAlcoholHowOftenAnswer(value: string) {
    await expect(this.alcoholHowOftenAnswer).toBeVisible()
    await expect(this.alcoholHowOftenAnswer).toContainText(value)
  }

  async checkAlcoholUnitsAnswer(value: string) {
    await expect(this.alcoholUnitsAnswer).toBeVisible()
    await expect(this.alcoholUnitsAnswer).toContainText(value)
  }

  async checkBingeDrinkingAnswer(value: string) {
    await expect(this.bingeDrinkingAnswer).toBeVisible()
    await expect(this.bingeDrinkingAnswer).toContainText(value)
  }

  /** Personal relationships and community */

  async checkPersonalRelationshipsSubHeadingVisible(isVisible: boolean) {
    await expect(this.personalRelationshipsSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkImportantPeopleAnswer(values: string | string[]) {
    const expectedArray = Array.isArray(values) ? values : [values]
    await expect(this.importantPeopleAnswer).toHaveText(expectedArray)
  }

  async checkHappyWithStatusAnswer(value: string) {
    await expect(this.happyWithStatusAnswer).toBeVisible()
    await expect(this.happyWithStatusAnswer).toContainText(value)
  }

  /** Thinking, attitudes and behaviours */

  async checkThinkingAttitudesBehavioursSubHeadingVisible(isVisible: boolean) {
    await expect(this.ThinkingAttitudesBehavioursSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkOffendingLinkedActivitiesAnswer(value: string) {
    await expect(this.offendingLinkedActivitiesAnswer).toBeVisible()
    await expect(this.offendingLinkedActivitiesAnswer).toContainText(value)
  }

  async checkTemperManagementAnswer(value: string) {
    await expect(this.temperManagementAnswer).toBeVisible()
    await expect(this.temperManagementAnswer).toContainText(value)
  }

  async checkImpulseAnswer(value: string) {
    await expect(this.impulseAnswer).toBeVisible()
    await expect(this.impulseAnswer).toContainText(value)
  }

  async checkProCrimeAnswer(value: string) {
    await expect(this.proCrimeAnswer).toBeVisible()
    await expect(this.proCrimeAnswer).toContainText(value)
  }

  /** Offence analysis */

  async checkOffenceAnalysisSubHeadingVisible(isVisible: boolean) {
    await expect(this.offenceAnalysisSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkCurrentOffenceElementsAnswer(values: string | string[]) {
    const expectedArray = Array.isArray(values) ? values : [values]
    await expect(this.currentOffenceElementsAnswer).toHaveText(expectedArray)
  }

  // look here
  async checkDomesticAbuseAnswer(value: string) {
    await expect(this.domesticAbuseAnswer).toBeVisible()
    await expect(this.domesticAbuseAnswer).toContainText(value)
  }

  async checkDomesticAbuseAgainstAnswer(value: string) {
    await expect(this.domesticAbuseAgainstAnswer).toBeVisible()
    await expect(this.domesticAbuseAgainstAnswer).toContainText(value)
  }

  /** Risk of serious harm */

  async checkRiskOfSeriousHarmSubHeadingVisible(isVisible: boolean) {
    await expect(this.riskOfSeriousHarmSubHeading).toBeVisible({ visible: isVisible })
  }

  async checkPreviousConvictionsAnswer(values: string | string[]) {
    const expectedArray = Array.isArray(values) ? values : [values]
    await expect(this.previousConvictionsAnswer).toHaveText(expectedArray)
  }

  /** Button */

  async clickViewPredictorsButton() {
    await this.viewPredictorsButton.click()
  }
}
