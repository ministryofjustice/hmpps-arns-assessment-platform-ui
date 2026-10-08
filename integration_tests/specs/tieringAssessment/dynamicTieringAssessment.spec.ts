import { test } from '../../support/fixtures'
import LoginPage from '../../pages/tieringAssessment/loginPage'
import StartTieringAssessmentPage from '../../pages/tieringAssessment/static/startTieringAssessmentPage'
import { tieringAssessmentPageTitles, tieringAssessmentV1URLs } from './tieringAssessmentUtils'
import CurrentOffenceAndOffencdingHistoryPage from '../../pages/tieringAssessment/static/currentOffenceAndOffencdingHistoryPage'
import SexualOffendingPage from '../../pages/tieringAssessment/static/sexualOffendingPage'
import CurrentSupervisionPage from '../../pages/tieringAssessment/static/currentSupervision'
import InterviewPage from '../../pages/tieringAssessment/interviewPage'
import OffencesSinceCommunityDatePage from '../../pages/tieringAssessment/static/offencesSinceCommunityDatePage'
import AccommodationPage from '../../pages/tieringAssessment/dynamic/accommodationPage'
import EmploymentPage from '../../pages/tieringAssessment/dynamic/employmentPage'
import DrugMisusePage from '../../pages/tieringAssessment/dynamic/drugMisusePage'
import DrugUsePage from '../../pages/tieringAssessment/dynamic/drugUsePage'
import EverDrunkAlcoholPage from '../../pages/tieringAssessment/dynamic/alcoholEverUsedPage'
import AlcoholUsePage from '../../pages/tieringAssessment/dynamic/alcoholUsePage'
import BingeDrinkingUsePage from '../../pages/tieringAssessment/dynamic/bingeDrinkingPage'
import PersonalRelationshipsAndCommunityPage from '../../pages/tieringAssessment/dynamic/personalRelationshipsAndCommunityPage'
import ThinkingAttitudesAndBehavioursPage from '../../pages/tieringAssessment/dynamic/thinkingAttitudesAndBehavioursPage'
import OffenceAnalysisPage from '../../pages/tieringAssessment/dynamic/offenceAnalysisPage'
import PreviousConvictionsPage from '../../pages/tieringAssessment/dynamic/previousConvictionsPage'
import CheckAnswersPage from '../../pages/tieringAssessment/checkAnswersPage'
import PredictorScoresPage from '../../pages/tieringAssessment/predictorScoresPage'

test.describe('Assessment Dynamic', () => {
  test('Tiering assessment Dynamic Happy Path', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const setupPage = new StartTieringAssessmentPage(page)
    const offenceHistoryPage = new CurrentOffenceAndOffencdingHistoryPage(page)
    const sexualOffendingPage = new SexualOffendingPage(page)
    const currentSupervisionDatePage = new CurrentSupervisionPage(page)
    const offencesSinceCommunityDatePage = new OffencesSinceCommunityDatePage(page)
    const interviewPage = new InterviewPage(page)
    const accommodationPage = new AccommodationPage(page)
    const employmentPage = new EmploymentPage(page)
    const drugMisusePage = new DrugMisusePage(page)
    const drugUsePage = new DrugUsePage(page)
    const everDrunkAlcoholPage = new EverDrunkAlcoholPage(page)
    const bingeDrinking = new BingeDrinkingUsePage(page)
    const alcoholUsePage = new AlcoholUsePage(page)
    const personalRelationshipsAndCommunityPage = new PersonalRelationshipsAndCommunityPage(page)
    const thinkingAttitudesAndBehavioursPage = new ThinkingAttitudesAndBehavioursPage(page)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const previousConvictionsPage = new PreviousConvictionsPage(page)
    const checkAnswersPage = new CheckAnswersPage(page)
    const predictorScoresPage = new PredictorScoresPage(page)

    /** Login */
    await page.goto(tieringAssessmentV1URLs.LOGIN)
    await loginPage.checkLoginPageLoaded()
    await loginPage.fillUsernameTextbox()
    await loginPage.fillPasswordTextbox()
    await loginPage.clickSigninButton()

    /** Start Tiering assessment dummy page */
    await setupPage.checkStartPageLoaded()
    await setupPage.fillForenameTextbox()
    await setupPage.clickMaleRadioOption()
    await setupPage.fillDobDayTextbox()
    await setupPage.fillDobMonthTextbox()
    await setupPage.fillDobYearTextbox()
    await setupPage.fillDateOfConvictionDayTextbox()
    await setupPage.fillDateOfConvictionMonthTextbox()
    await setupPage.fillDateOfConvictionYearTextbox()
    await setupPage.clickSupervisionCommunityRadioOption()
    await setupPage.fillOffenceCodeTextbox()
    await setupPage.clickContinue()

    /** Current offence and Offending history page */
    await offenceHistoryPage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_HISTORY)
    await offenceHistoryPage.checkPageHeading(tieringAssessmentPageTitles.offenceHistory)
    await offenceHistoryPage.fillFirstSanctionDayTextbox()
    await offenceHistoryPage.fillFirstSanctionMonthTextbox()
    await offenceHistoryPage.fillFirstSanctionYearTextbox()
    await offenceHistoryPage.fillTotalSanctionsTextbox()
    await offenceHistoryPage.fillViolentSanctionsTextbox()
    await offenceHistoryPage.clickSexualSanctionsYesRadioOption()
    await offenceHistoryPage.clickSaveAndContinue()

    /** Sexual offending page */
    await sexualOffendingPage.checkPageUrl(tieringAssessmentV1URLs.SEXUAL_OFFENDING)
    await sexualOffendingPage.checkPageHeading(tieringAssessmentPageTitles.sexualOffending)
    await sexualOffendingPage.clickCurrentOffenceSexualYesRadioOption()
    await sexualOffendingPage.fillMostRecentSexualDayTextbox()
    await sexualOffendingPage.fillMostRecentSexualMonthTextbox()
    await sexualOffendingPage.fillMostRecentSexualYearTextbox()
    await sexualOffendingPage.fillDirectContactTextbox()
    await sexualOffendingPage.fillDirectContactChildTextbox()
    await sexualOffendingPage.clickVictimStrangerYesRadioOption()
    await sexualOffendingPage.fillIndecentImagesTextbox()
    await sexualOffendingPage.fillNonContactTextbox()
    await sexualOffendingPage.clickSaveAndContinue()

    /** Current supervision date page */
    await currentSupervisionDatePage.checkPageUrl(tieringAssessmentV1URLs.CURRENT_SUPERVISION)
    await currentSupervisionDatePage.checkPageHeading(tieringAssessmentPageTitles.currentSupervision)
    await currentSupervisionDatePage.fillCurrentSupervisionDayTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionMonthTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionYearTextbox()
    await currentSupervisionDatePage.clickSaveAndContinue()

    /** Offences since community date page */
    await offencesSinceCommunityDatePage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_SINCE_SUPERVISION)
    await offencesSinceCommunityDatePage.checkPageHeading(tieringAssessmentPageTitles.offencesSinceSupervision)
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(false)
    await offencesSinceCommunityDatePage.clickOffencesSinceCommunityYesRadioOption()
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(true)
    await offencesSinceCommunityDatePage.fillRecentOffenceDayTextbox()
    await offencesSinceCommunityDatePage.fillRecentOffenceMonthTextbox()
    await offencesSinceCommunityDatePage.fillRecentOffenceYearTextbox()
    await offencesSinceCommunityDatePage.clickSaveAndContinue()

    /** Interview page */
    await interviewPage.checkPageUrl(tieringAssessmentV1URLs.INTERVIEW)
    await interviewPage.checkPageHeading(tieringAssessmentPageTitles.interview)
    await interviewPage.clickInterviewYesRadioOption()
    await interviewPage.clickSaveAndContinue()

    /** Accommodation page */
    await accommodationPage.checkPageUrl(tieringAssessmentV1URLs.ACCOMMODATION)
    await accommodationPage.checkPageHeading(tieringAssessmentPageTitles.accommodation)
    await accommodationPage.clickLivingWithFamilyCheckboxOption()
    await accommodationPage.clickLivingWithFriendsCheckboxOption()
    await accommodationPage.clickLivingWithPartnerCheckboxOption()
    await accommodationPage.clickLivingWithUnder18CheckboxOption()
    await accommodationPage.clickLivingWithOtherCheckboxOption()
    await accommodationPage.clickAccommodationSuitableNoRadioOption()
    await accommodationPage.clickSaveAndContinue()

    /** Employment */
    await employmentPage.checkPageUrl(tieringAssessmentV1URLs.EMPLOYMENT)
    await employmentPage.checkPageHeading(tieringAssessmentPageTitles.employment)
    await employmentPage.clickEmploymentStatusUnemployedNotLookingRadioOption()
    await employmentPage.clickSaveAndContinue()

    /** Drug misuse page */
    await drugMisusePage.checkPageUrl(tieringAssessmentV1URLs.DRUG_MISUSE)
    await drugMisusePage.checkPageHeading(tieringAssessmentPageTitles.drugUse)
    await drugMisusePage.clickEverMisusedDrugsYesRadioOption()
    await employmentPage.clickSaveAndContinue()

    /** Drug use page */
    await drugUsePage.checkPageUrl(tieringAssessmentV1URLs.DRUG_USE)
    await drugUsePage.checkPageHeading(tieringAssessmentPageTitles.drugUse)
    await drugUsePage.clickDrugsUsedAmphetaminesCheckboxOption()
    await drugUsePage.clickAmphetaminesRadioLast6MonthsRadioOption()
    await drugUsePage.clickDrugsUsedCannabisCheckboxOption()
    await drugUsePage.clickCannabisMoreThan6MonthsRadioOption()
    await drugUsePage.clickDrugsUsedOtherCheckboxOption()
    await drugUsePage.fillDrugsUsedOtherRevealedTextbox()
    await drugUsePage.clickOtherRadioLast6MonthsRadioOption()
    await drugUsePage.clickMotivationToStopNoMotivationRadioOption()
    await drugUsePage.clickSaveAndContinue()

    /** Alcohol ever used more than 3 months ago */
    await everDrunkAlcoholPage.checkPageUrl(tieringAssessmentV1URLs.EVER_DRUNK_ALCOHOL)
    await everDrunkAlcoholPage.checkPageHeading(tieringAssessmentPageTitles.alcohol)
    await everDrunkAlcoholPage.clickEverDrunkAlcoholYesMoreThan3MonthsAgoRadioOption()
    await everDrunkAlcoholPage.clickSaveAndContinue()

    /** Binge-drinking sub-page */
    await bingeDrinking.checkPageUrl(tieringAssessmentV1URLs.BINGE_DRINKING)
    await bingeDrinking.checkPageHeading(tieringAssessmentPageTitles.alcohol)
    await bingeDrinking.clickBingeDrinkingEvidenceRadioOption()
    await bingeDrinking.clickSaveAndContinue()

    /** Check on personal relationships and community page and nav back to Binge-drinking sub-page */
    await personalRelationshipsAndCommunityPage.checkPageUrl(
      tieringAssessmentV1URLs.PERSONAL_RELATIONSHIPS_AND_COMMUNITY,
    )
    await personalRelationshipsAndCommunityPage.checkPageHeading(
      tieringAssessmentPageTitles.personalRelationshipsAndCommunity,
    )
    await personalRelationshipsAndCommunityPage.clickBackLink()

    /** nav back to alcohol ever used page */
    await bingeDrinking.clickBackLink()

    /** Alcohol ever used last 3 months ago */
    await everDrunkAlcoholPage.checkPageUrl(tieringAssessmentV1URLs.EVER_DRUNK_ALCOHOL)
    await everDrunkAlcoholPage.checkPageHeading(tieringAssessmentPageTitles.alcohol)
    await everDrunkAlcoholPage.clickEverDrunkAlcoholYesLast3MonthsRadioOption()
    await everDrunkAlcoholPage.clickSaveAndContinue()

    /** Alcohol use main page */
    await alcoholUsePage.checkPageUrl(tieringAssessmentV1URLs.ALCOHOL_USE)
    await alcoholUsePage.checkPageHeading(tieringAssessmentPageTitles.alcohol)
    await alcoholUsePage.clickHowOften4PlusPerWeekRadioOption()
    await alcoholUsePage.clickUnits10PlusRadioOption()
    await alcoholUsePage.clickUnitsDetails()
    await alcoholUsePage.checkUnitsDetailsRevealedContentVisible()
    await alcoholUsePage.clickBingeDrinkingEvidenceRadioOption()
    await alcoholUsePage.clickSaveAndContinue()

    /** Personal relationships and community page */
    await personalRelationshipsAndCommunityPage.checkPageUrl(
      tieringAssessmentV1URLs.PERSONAL_RELATIONSHIPS_AND_COMMUNITY,
    )
    await personalRelationshipsAndCommunityPage.checkPageHeading(
      tieringAssessmentPageTitles.personalRelationshipsAndCommunity,
    )
    await personalRelationshipsAndCommunityPage.clickImportantPeoplePartnerCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickImportantPeopleChildrenOrWardsCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickImportantPeopleOtherChildrenCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickImportantPeopleFamilyCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickImportantPeopleFriendsCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickImportantPeopleOtherCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickRelationshipStatusUnHappyRadioOption()
    await personalRelationshipsAndCommunityPage.clickSaveAndContinue()

    /** Thinking, attitudes and behaviours page */
    await thinkingAttitudesAndBehavioursPage.checkPageUrl(tieringAssessmentV1URLs.THINKING_ATTITUDES_AND_BEHAVIOURS)
    await thinkingAttitudesAndBehavioursPage.checkPageHeading(
      tieringAssessmentPageTitles.thinkingAttitudesAndBehaviours,
    )
    await thinkingAttitudesAndBehavioursPage.clickOffendingLinkedActivitiesRegularEngagementRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickTemperManagementLosesTemperRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickImpulseControlActsOnImpulseProblemsRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickProCriminalAttitudesSupportsCriminalBehaviourRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickSaveAndContinue()

    /** Offence analysis page */
    await offenceAnalysisPage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_ANALYSIS)
    await offenceAnalysisPage.checkPageHeading(tieringAssessmentPageTitles.offenceAnalysis)
    await offenceAnalysisPage.clickCurrentOffenceArsonCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceDomesticAbuseCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceExcessiveViolenceCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceHatedGroupCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceChildViolenceCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceSexualCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceStalkingCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceWeaponViolenceCheckboxOption()
    await offenceAnalysisPage.clickCurrentOffenceWeaponCheckboxOption()
    await offenceAnalysisPage.clickDomesticViolenceYesRadioOption()
    await offenceAnalysisPage.clickDomesticViolenceYesAgainstIntimateRadioOption()
    await offenceAnalysisPage.clickSaveAndContinue()

    /** Risk of serious harm (previous convictions) page */
    await previousConvictionsPage.checkPageUrl(tieringAssessmentV1URLs.PREVIOUS_CONVICTIONS)
    await previousConvictionsPage.checkPageHeading(tieringAssessmentPageTitles.riskOfSeriousHarm)
    await previousConvictionsPage.clickPreviousConvictionsMurderCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsGBHCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsChildSexualOffencesCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsChildOffencesCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsCriminalDamageCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsWeaponCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsKidnappingCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsArsonCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsRaciallyMotivatedCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsBurglaryCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsRobberyCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsSeriousOffencesCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsCustodyOffencesCheckboxOption()
    await previousConvictionsPage.clickPreviousConvictionsFirearmCheckboxOption()
    await previousConvictionsPage.clickSaveAndContinue()

    /** Check answer page static factors */
    await checkAnswersPage.checkPageUrl(tieringAssessmentV1URLs.CHECK_ANSWERS)
    await checkAnswersPage.checkPageHeading(tieringAssessmentPageTitles.checkAnswers)
    await checkAnswersPage.checkStaticFactorsHeaderVisible()
    await checkAnswersPage.checkCurrentOffenceSubHeaderVisible()
    await checkAnswersPage.checkCurrentOffenceAndOffendingHistorySubHeadingVisible()
    await checkAnswersPage.checkFirstSanctionDateAnswerValue()
    await checkAnswersPage.checkTotalSanctionsAnswerValue()
    await checkAnswersPage.checkViolentSanctionsAnswerValue()
    await checkAnswersPage.checkSexualSanctionsAnswerValue()
    await checkAnswersPage.checkSexualOffendingSubHeadingVisible()
    await checkAnswersPage.checkCurrentOffenceSexualAnswerValue()
    await checkAnswersPage.checkMostRecentSexualDateAnswerValue()
    await checkAnswersPage.checkDirectContactCountAnswerValue()
    await checkAnswersPage.checkDirectContactChildCountAnswerValue()
    await checkAnswersPage.checkVictimStrangerAnswerValue()
    await checkAnswersPage.checkIndecentImagesCountAnswerValue()
    await checkAnswersPage.checkNonContactCountAnswerValue()
    await checkAnswersPage.checkCurrentSupervisionDateSubHeadingVisible()
    await checkAnswersPage.checkCurrentSupervisionDateAnswerValue()
    await checkAnswersPage.checkOffencesSinceSupervisionSubHeadingVisible()
    await checkAnswersPage.checkOffencesSinceSupervisionAnswerValue()
    await checkAnswersPage.checkInterviewSubHeadingVisible()
    await checkAnswersPage.checkInterviewAnswerValue('Yes, continue assessment')

    /** Check answer page dynamic factors */
    await checkAnswersPage.checkDynamicHeaderVisible(true)
    await page.pause()
    await checkAnswersPage.checkAccommodationSubHeadingVisible(true)
    await checkAnswersPage.checkLivingWithAnswer(['Family', 'Friends', 'Partner', 'Person under 18 years old', 'Other'])
    await checkAnswersPage.checkAccommodationSuitableAnswer('No')
    await checkAnswersPage.checkEmploymentSubHeadingVisible(true)
    await checkAnswersPage.checkEmploymentStatusAnswer('Unemployed - not actively looking for work')
    await checkAnswersPage.checkDrugUseSubHeadingVisible(true)
    await checkAnswersPage.checkEverUsedDrugsAnswer('Yes')
    await checkAnswersPage.checkWhichDrugsAnswer([
      'Amphetamines - Used in the last 6 months',
      'Cannabis - Used more than 6 months ago',
      'Other - New drug',
      'Other - Used in the last 6 months',
    ])
    await checkAnswersPage.checkMotivationToStopAnswer('Does not show motivation to stop or reduce')
    await checkAnswersPage.checkAlcoholUseSubHeadingVisible(true)
    await checkAnswersPage.checkEverUsedAlcoholAnswer('Yes, including in the last 3 months')
    await checkAnswersPage.checkAlcoholHowOftenAnswer('More than 4 times a week')
    await checkAnswersPage.checkAlcoholUnitsAnswer('10 or more units')
    await checkAnswersPage.checkBingeDrinkingAnswer('Evidence of binge drinking or excessive alcohol use')
    await checkAnswersPage.checkPersonalRelationshipsSubHeadingVisible(true)
    await checkAnswersPage.checkImportantPeopleAnswer([
      "Partner or someone they're in an intimate relationship with",
      'Their children or anyone they have parenting responsibilities for',
      'Other children',
      'Family members',
      'Friends',
      'Other',
    ])
    await checkAnswersPage.checkHappyWithStatusAnswer(
      'Unhappy about their relationship status, or their relationship is unhealthy and directly linked to offending',
    )
    await checkAnswersPage.checkThinkingAttitudesBehavioursSubHeadingVisible(true)
    await checkAnswersPage.checkOffendingLinkedActivitiesAnswer(
      'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
    )
    await checkAnswersPage.checkTemperManagementAnswer('No, easily loses their temper')
    await checkAnswersPage.checkImpulseAnswer(
      'Considers all aspects of a situation before acting on or making a decision',
    )
    await checkAnswersPage.checkProCrimeAnswer(
      'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
    )
    await checkAnswersPage.checkOffenceAnalysisSubHeadingVisible(true)
    await checkAnswersPage.checkCurrentOffenceElementsAnswer([
      'Arson',
      'Domestic abuse',
      'Excessive violence or sadistic violence',
      'Hatred of identifiable groups',
      'Physical violence against a child',
      'Sexual element',
      'Stalking element',
      'Violent or threat of violence with a weapon',
      'Weapon',
    ])
    await checkAnswersPage.checkDomesticAbuseAnswer('Yes')
    await checkAnswersPage.checkDomesticAbuseAgainstAnswer('Intimate partner')
    await checkAnswersPage.checkRiskOfSeriousHarmSubHeadingVisible(true)
    await checkAnswersPage.checkPreviousConvictionsAnswer([
      'Murder, attempted murder, threat or conspiracy to murder or manslaughter',
      'Wounding or GBH',
      'Any sexual offence against a child',
      'Any other offence against a child',
      'Criminal damage with intent to endanger life',
      'Any offence involving possession or use of weapons',
      'Kidnapping or false imprisonment',
      'Arson',
      'Racially motivated or racially aggravated offence',
      'Aggravated burglary',
      'Robbery',
      'Any other serious offence (for example, blackmail, harassment, stalking, indecent images of children, child neglect or abduction)',
      'Any offence committed in custody',
      'Possession of a firearm with intent to endanger life or resist arrest',
    ])

    /** Nav to predictor page */
    await checkAnswersPage.clickViewPredictorsButton()

    /** Predictor scores dynamic scores page */
    await predictorScoresPage.checkPageUrl(tieringAssessmentV1URLs.PREDICTOR_SCORES)
    await predictorScoresPage.checkPageHeading(tieringAssessmentPageTitles.predictorScores)
    await predictorScoresPage.checkCompleteBannerVisible(false)
    await predictorScoresPage.checkAllPredictorScoreTypeVisible('Dynamic')
    await predictorScoresPage.checkViolentPredictorScoreTypeVisible('Dynamic')
    await predictorScoresPage.checkCombinedSeriousPredictorScoreTypeVisible()
    await predictorScoresPage.checkSeriousViolentPredictorScoreTypeVisible('Dynamic')

    /** Nav back to check answers, checking button functionality */
    await predictorScoresPage.clickCheckAnswersButton()
    await checkAnswersPage.checkPageUrl(tieringAssessmentV1URLs.CHECK_ANSWERS)
    await checkAnswersPage.checkPageHeading(tieringAssessmentPageTitles.checkAnswers)
    await checkAnswersPage.clickViewPredictorsButton()

    /** nav back to Predictor scors page, complete assessment */
    await predictorScoresPage.checkPageUrl(tieringAssessmentV1URLs.PREDICTOR_SCORES)
    await predictorScoresPage.checkPageHeading(tieringAssessmentPageTitles.predictorScores)
    await predictorScoresPage.checkCompleteBannerVisible(false)
    await predictorScoresPage.clickMarkAsCompleteButton()
    await predictorScoresPage.checkCompleteBannerVisible(true)
  })

  test('Tiering assessment Dynamic Unknown Path', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const setupPage = new StartTieringAssessmentPage(page)
    const offenceHistoryPage = new CurrentOffenceAndOffencdingHistoryPage(page)
    const sexualOffendingPage = new SexualOffendingPage(page)
    const currentSupervisionDatePage = new CurrentSupervisionPage(page)
    const offencesSinceCommunityDatePage = new OffencesSinceCommunityDatePage(page)
    const interviewPage = new InterviewPage(page)
    const accommodationPage = new AccommodationPage(page)
    const employmentPage = new EmploymentPage(page)
    const drugMisusePage = new DrugMisusePage(page)
    const drugUsePage = new DrugUsePage(page)
    const everDrunkAlcoholPage = new EverDrunkAlcoholPage(page)
    const bingeDrinking = new BingeDrinkingUsePage(page)
    const alcoholUsePage = new AlcoholUsePage(page)
    const personalRelationshipsAndCommunityPage = new PersonalRelationshipsAndCommunityPage(page)
    const thinkingAttitudesAndBehavioursPage = new ThinkingAttitudesAndBehavioursPage(page)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const previousConvictionsPage = new PreviousConvictionsPage(page)
    const checkAnswersPage = new CheckAnswersPage(page)
    const predictorScoresPage = new PredictorScoresPage(page)

    /** Login */
    await page.goto(tieringAssessmentV1URLs.LOGIN)
    await loginPage.checkLoginPageLoaded()
    await loginPage.fillUsernameTextbox()
    await loginPage.fillPasswordTextbox()
    await loginPage.clickSigninButton()

    /** Start Tiering assessment dummy page */
    await setupPage.checkStartPageLoaded()
    await setupPage.fillForenameTextbox()
    await setupPage.clickMaleRadioOption()
    await setupPage.fillDobDayTextbox()
    await setupPage.fillDobMonthTextbox()
    await setupPage.fillDobYearTextbox()
    await setupPage.fillDateOfConvictionDayTextbox()
    await setupPage.fillDateOfConvictionMonthTextbox()
    await setupPage.fillDateOfConvictionYearTextbox()
    await setupPage.clickSupervisionCommunityRadioOption()
    await setupPage.fillOffenceCodeTextbox()
    await setupPage.clickContinue()

    /** Current offence and Offending history page */
    await offenceHistoryPage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_HISTORY)
    await offenceHistoryPage.checkPageHeading(tieringAssessmentPageTitles.offenceHistory)
    await offenceHistoryPage.fillFirstSanctionDayTextbox()
    await offenceHistoryPage.fillFirstSanctionMonthTextbox()
    await offenceHistoryPage.fillFirstSanctionYearTextbox()
    await offenceHistoryPage.fillTotalSanctionsTextbox()
    await offenceHistoryPage.fillViolentSanctionsTextbox()
    await offenceHistoryPage.clickSexualSanctionsYesRadioOption()
    await offenceHistoryPage.clickSaveAndContinue()

    /** Sexual offending page */
    await sexualOffendingPage.checkPageUrl(tieringAssessmentV1URLs.SEXUAL_OFFENDING)
    await sexualOffendingPage.checkPageHeading(tieringAssessmentPageTitles.sexualOffending)
    await sexualOffendingPage.clickCurrentOffenceSexualYesRadioOption()
    await sexualOffendingPage.fillMostRecentSexualDayTextbox()
    await sexualOffendingPage.fillMostRecentSexualMonthTextbox()
    await sexualOffendingPage.fillMostRecentSexualYearTextbox()
    await sexualOffendingPage.fillDirectContactTextbox()
    await sexualOffendingPage.fillDirectContactChildTextbox()
    await sexualOffendingPage.clickVictimStrangerYesRadioOption()
    await sexualOffendingPage.fillIndecentImagesTextbox()
    await sexualOffendingPage.fillNonContactTextbox()
    await sexualOffendingPage.clickSaveAndContinue()

    /** Current supervision date page */
    await currentSupervisionDatePage.checkPageUrl(tieringAssessmentV1URLs.CURRENT_SUPERVISION)
    await currentSupervisionDatePage.checkPageHeading(tieringAssessmentPageTitles.currentSupervision)
    await currentSupervisionDatePage.fillCurrentSupervisionDayTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionMonthTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionYearTextbox()
    await currentSupervisionDatePage.clickSaveAndContinue()

    /** Offences since community date page */
    await offencesSinceCommunityDatePage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_SINCE_SUPERVISION)
    await offencesSinceCommunityDatePage.checkPageHeading(tieringAssessmentPageTitles.offencesSinceSupervision)
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(false)
    await offencesSinceCommunityDatePage.clickOffencesSinceCommunityYesRadioOption()
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(true)
    await offencesSinceCommunityDatePage.fillRecentOffenceDayTextbox()
    await offencesSinceCommunityDatePage.fillRecentOffenceMonthTextbox()
    await offencesSinceCommunityDatePage.fillRecentOffenceYearTextbox()
    await offencesSinceCommunityDatePage.clickSaveAndContinue()

    /** Interview page */
    await interviewPage.checkPageUrl(tieringAssessmentV1URLs.INTERVIEW)
    await interviewPage.checkPageHeading(tieringAssessmentPageTitles.interview)
    await interviewPage.clickInterviewYesRadioOption()
    await interviewPage.clickSaveAndContinue()

    /** Accommodation page */
    await accommodationPage.checkPageUrl(tieringAssessmentV1URLs.ACCOMMODATION)
    await accommodationPage.checkPageHeading(tieringAssessmentPageTitles.accommodation)
    await accommodationPage.clickLivingWithUnknownCheckboxOption()
    await accommodationPage.clickAccommodationSuitableUnknownRadioOption()
    await accommodationPage.clickSaveAndContinue()

    /** Employment */
    await employmentPage.checkPageUrl(tieringAssessmentV1URLs.EMPLOYMENT)
    await employmentPage.checkPageHeading(tieringAssessmentPageTitles.employment)
    await employmentPage.clickEmploymentStatusUnknownRadioOption()
    await employmentPage.clickSaveAndContinue()

    /** Drug misuse page */
    await drugMisusePage.checkPageUrl(tieringAssessmentV1URLs.DRUG_MISUSE)
    await drugMisusePage.checkPageHeading(tieringAssessmentPageTitles.drugUse)
    await drugMisusePage.clickEverMisusedDrugsUnknownRadioOption()
    await drugMisusePage.clickSaveAndContinue()

    /** Alcohol ever used more than 3 months ago */
    await everDrunkAlcoholPage.checkPageUrl(tieringAssessmentV1URLs.EVER_DRUNK_ALCOHOL)
    await everDrunkAlcoholPage.checkPageHeading(tieringAssessmentPageTitles.alcohol)
    await everDrunkAlcoholPage.clickEverDrunkAlcoholUnknownRadioOption()
    await everDrunkAlcoholPage.clickSaveAndContinue()

    /** Personal relationships and community page */
    await personalRelationshipsAndCommunityPage.checkPageUrl(
      tieringAssessmentV1URLs.PERSONAL_RELATIONSHIPS_AND_COMMUNITY,
    )
    await personalRelationshipsAndCommunityPage.checkPageHeading(
      tieringAssessmentPageTitles.personalRelationshipsAndCommunity,
    )
    await personalRelationshipsAndCommunityPage.clickImportantPeopleUnknownCheckboxOption()
    await personalRelationshipsAndCommunityPage.clickRelationshipStatusUnknownRadioOption()
    await personalRelationshipsAndCommunityPage.clickSaveAndContinue()

    /** Thinking, attitudes and behaviours page */
    await thinkingAttitudesAndBehavioursPage.checkPageUrl(tieringAssessmentV1URLs.THINKING_ATTITUDES_AND_BEHAVIOURS)
    await thinkingAttitudesAndBehavioursPage.checkPageHeading(
      tieringAssessmentPageTitles.thinkingAttitudesAndBehaviours,
    )
    await thinkingAttitudesAndBehavioursPage.clickOffendingLinkedActivitiesUnknownRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickTemperManagementUnknownRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickImpulseControlUnknownRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickProCriminalAttitudesUnknownRadioOption()
    await thinkingAttitudesAndBehavioursPage.clickSaveAndContinue()

    /** Offence analysis page */
    await offenceAnalysisPage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_ANALYSIS)
    await offenceAnalysisPage.checkPageHeading(tieringAssessmentPageTitles.offenceAnalysis)
    await offenceAnalysisPage.clickCurrentOffenceNoneCheckboxOption()
    await offenceAnalysisPage.clickDomesticViolenceUnknownRadioOption()
    await offenceAnalysisPage.clickSaveAndContinue()

    /** Risk of serious harm (previous convictions) page */
    await previousConvictionsPage.checkPageUrl(tieringAssessmentV1URLs.PREVIOUS_CONVICTIONS)
    await previousConvictionsPage.checkPageHeading(tieringAssessmentPageTitles.riskOfSeriousHarm)
    await previousConvictionsPage.clickPreviousConvictionsNoneCheckboxOption()
    await previousConvictionsPage.clickSaveAndContinue()

    /** Check answer page static factors */
    await checkAnswersPage.checkPageUrl(tieringAssessmentV1URLs.CHECK_ANSWERS)
    await checkAnswersPage.checkPageHeading(tieringAssessmentPageTitles.checkAnswers)
    await checkAnswersPage.checkStaticFactorsHeaderVisible()
    await checkAnswersPage.checkCurrentOffenceSubHeaderVisible()
    await checkAnswersPage.checkCurrentOffenceAndOffendingHistorySubHeadingVisible()
    await checkAnswersPage.checkSexualOffendingSubHeadingVisible()
    await checkAnswersPage.checkCurrentSupervisionDateSubHeadingVisible()
    await checkAnswersPage.checkOffencesSinceSupervisionSubHeadingVisible()
    await checkAnswersPage.checkInterviewSubHeadingVisible()
    await checkAnswersPage.checkInterviewAnswerValue('Yes, continue assessment')

    /** Check answer page dynamic factors */
    await checkAnswersPage.checkDynamicHeaderVisible(true)
    await page.pause()
    await checkAnswersPage.checkAccommodationSubHeadingVisible(true)
    await checkAnswersPage.checkLivingWithAnswer('Unknown')
    await checkAnswersPage.checkAccommodationSuitableAnswer('Unknown')
    await checkAnswersPage.checkEmploymentSubHeadingVisible(true)
    await checkAnswersPage.checkEmploymentStatusAnswer('Unknown')
    await checkAnswersPage.checkDrugUseSubHeadingVisible(true)
    await checkAnswersPage.checkEverUsedDrugsAnswer('Unknown')
    await checkAnswersPage.checkAlcoholUseSubHeadingVisible(true)
    await checkAnswersPage.checkEverUsedAlcoholAnswer('Unknown')
    await checkAnswersPage.checkPersonalRelationshipsSubHeadingVisible(true)
    await checkAnswersPage.checkImportantPeopleAnswer('Unknown')
    await checkAnswersPage.checkHappyWithStatusAnswer('Unknown')
    await checkAnswersPage.checkThinkingAttitudesBehavioursSubHeadingVisible(true)
    await checkAnswersPage.checkOffendingLinkedActivitiesAnswer('Unknown')
    await checkAnswersPage.checkTemperManagementAnswer('Unknown')
    await checkAnswersPage.checkImpulseAnswer('Unknown')
    await checkAnswersPage.checkProCrimeAnswer('Unknown')
    await checkAnswersPage.checkOffenceAnalysisSubHeadingVisible(true)
    await checkAnswersPage.checkCurrentOffenceElementsAnswer('None of these elements')
    await checkAnswersPage.checkDomesticAbuseAnswer('Unknown')
    await checkAnswersPage.checkRiskOfSeriousHarmSubHeadingVisible(true)
    await checkAnswersPage.checkPreviousConvictionsAnswer('None of these offences')

    /** Nav to predictor page */
    await checkAnswersPage.clickViewPredictorsButton()

    /** Predictor scores dynamic scores page */
    await predictorScoresPage.checkPageUrl(tieringAssessmentV1URLs.PREDICTOR_SCORES)
    await predictorScoresPage.checkPageHeading(tieringAssessmentPageTitles.predictorScores)
    await predictorScoresPage.checkCompleteBannerVisible(false)
    await predictorScoresPage.checkAllPredictorScoreTypeVisible('Static')
    await predictorScoresPage.checkViolentPredictorScoreTypeVisible('Static')
    await predictorScoresPage.checkCombinedSeriousPredictorScoreTypeVisible('Combined')
    await predictorScoresPage.checkSeriousViolentPredictorScoreTypeVisible('Static')
  })
})
