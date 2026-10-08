import { test } from '../../support/fixtures'
import LoginPage from '../../pages/tieringAssessment/loginPage'
import StartTieringAssessmentPage from '../../pages/tieringAssessment/static/startTieringAssessmentPage'
import { tieringAssessmentPageTitles, tieringAssessmentV1URLs } from './tieringAssessmentUtils'
import CurrentOffenceAndOffencdingHistoryPage from '../../pages/tieringAssessment/static/currentOffenceAndOffencdingHistoryPage'
import SexualOffendingPage from '../../pages/tieringAssessment/static/sexualOffendingPage'
import CurrentSupervisionPage from '../../pages/tieringAssessment/static/currentSupervision'
import InterviewPage from '../../pages/tieringAssessment/interviewPage'
import OffencesSinceCommunityDatePage from '../../pages/tieringAssessment/static/offencesSinceCommunityDatePage'
import CheckAnswersPage from '../../pages/tieringAssessment/checkAnswersPage'
import PredictorScoresPage from '../../pages/tieringAssessment/predictorScoresPage'

test.describe('Assessment', () => {
  test('Tiering assessment with branching and validation error checks', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const setupPage = new StartTieringAssessmentPage(page)
    const offenceHistoryPage = new CurrentOffenceAndOffencdingHistoryPage(page)
    const sexualOffendingPage = new SexualOffendingPage(page)
    const currentSupervisionDatePage = new CurrentSupervisionPage(page)
    const offencesSinceCommunityDatePage = new OffencesSinceCommunityDatePage(page)
    const interviewPage = new InterviewPage(page)
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
    await offenceHistoryPage.clickSaveAndContinue()
    await offenceHistoryPage.checkErrorSummaryBoxAppears()
    await offenceHistoryPage.numberOfRequiredFieldErrors(3)
    await offenceHistoryPage.numberOfValidDateErrors(1)
    await offenceHistoryPage.numberOfWholeNumberErrors(2)
    await offenceHistoryPage.numberOfGreaterThanZero(1)
    await offenceHistoryPage.fillFirstSanctionDayTextbox()
    await offenceHistoryPage.fillFirstSanctionMonthTextbox()
    await offenceHistoryPage.fillFirstSanctionYearTextbox()
    await offenceHistoryPage.fillTotalSanctionsTextbox()
    await offenceHistoryPage.fillViolentSanctionsTextbox()
    await offenceHistoryPage.clickSexualSanctionsNoRadioOption()
    await offenceHistoryPage.clickSaveAndContinue()

    /** Current supervision date page (No branch that skips sexual offence questions and current supervision date page) */
    await currentSupervisionDatePage.checkPageUrl(tieringAssessmentV1URLs.CURRENT_SUPERVISION)
    await currentSupervisionDatePage.checkPageHeading(tieringAssessmentPageTitles.currentSupervision)
    await currentSupervisionDatePage.fillCurrentSupervisionDayTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionMonthTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionYearTextbox()
    await currentSupervisionDatePage.clickSaveAndContinue()
    await interviewPage.checkPageUrl(tieringAssessmentV1URLs.INTERVIEW)
    await interviewPage.checkPageHeading(tieringAssessmentPageTitles.interview)
    await currentSupervisionDatePage.clickBackLink()
    await currentSupervisionDatePage.checkPageUrl(tieringAssessmentV1URLs.CURRENT_SUPERVISION)
    await currentSupervisionDatePage.checkPageHeading(tieringAssessmentPageTitles.currentSupervision)
    await currentSupervisionDatePage.clickBackLink()

    /** Going back to offence and Offending history page to change sexual question to yes for the missing branches */
    await offenceHistoryPage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_HISTORY)
    await offenceHistoryPage.checkPageHeading(tieringAssessmentPageTitles.offenceHistory)
    await offenceHistoryPage.clickSexualSanctionsYesRadioOption()
    await offenceHistoryPage.clickSaveAndContinue()

    /** Sexual offending page (Yes Branch) */
    await sexualOffendingPage.checkPageUrl(tieringAssessmentV1URLs.SEXUAL_OFFENDING)
    await sexualOffendingPage.checkPageHeading(tieringAssessmentPageTitles.sexualOffending)
    await sexualOffendingPage.clickSaveAndContinue()
    await sexualOffendingPage.checkErrorSummaryBoxAppears()
    await sexualOffendingPage.numberOfRequiredFieldErrors(6)
    await sexualOffendingPage.numberOfValidDateErrors(1)
    await sexualOffendingPage.numberOfWholeNumberErrors(4)
    await sexualOffendingPage.numberOfGreaterThanZero(0)
    await sexualOffendingPage.numberOfGreaterThanOrEqual(4)
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
    await currentSupervisionDatePage.clickSaveAndContinue()
    await currentSupervisionDatePage.checkErrorSummaryBoxAppears()
    await currentSupervisionDatePage.numberOfValidDateErrors(1)
    await currentSupervisionDatePage.fillCurrentSupervisionDayTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionMonthTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionYearTextbox()
    await currentSupervisionDatePage.clickSaveAndContinue()

    /** Offences since community date page */
    await offencesSinceCommunityDatePage.checkPageUrl(tieringAssessmentV1URLs.OFFENCE_SINCE_SUPERVISION)
    await offencesSinceCommunityDatePage.checkPageHeading(tieringAssessmentPageTitles.offencesSinceSupervision)
    await offencesSinceCommunityDatePage.clickSaveAndContinue()
    await offencesSinceCommunityDatePage.checkErrorSummaryBoxAppears()
    await offencesSinceCommunityDatePage.numberOfRequiredFieldErrors(1)
    await offencesSinceCommunityDatePage.numberOfValidDateErrors(0)
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(false)
    await offencesSinceCommunityDatePage.clickOffencesSinceCommunityYesRadioOption()
    await offencesSinceCommunityDatePage.checkRevealRecentOffenceDateVisible(true)
    await offencesSinceCommunityDatePage.clickSaveAndContinue()
    await offencesSinceCommunityDatePage.checkErrorSummaryBoxAppears()
    await offencesSinceCommunityDatePage.numberOfRequiredFieldErrors(0)
    await offencesSinceCommunityDatePage.numberOfValidDateErrors(1)
    await currentSupervisionDatePage.fillCurrentSupervisionDayTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionMonthTextbox()
    await currentSupervisionDatePage.fillCurrentSupervisionYearTextbox()
    await currentSupervisionDatePage.clickSaveAndContinue()

    /** Interview page */
    await interviewPage.checkPageUrl(tieringAssessmentV1URLs.INTERVIEW)
    await interviewPage.checkPageHeading(tieringAssessmentPageTitles.interview)
    await interviewPage.clickSaveAndContinue()
    await interviewPage.checkErrorSummaryBoxAppears()
    await interviewPage.numberOfRequiredFieldErrors(1)
    await interviewPage.clickInterviewNoRadioOption()
    await interviewPage.clickSaveAndContinue()

    /** Check answer page */
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
    await checkAnswersPage.checkInterviewAnswerValue()
    await checkAnswersPage.checkDynamicHeaderVisible()
    await checkAnswersPage.clickViewPredictorsButton()

    /** Predictor scores page */
    await predictorScoresPage.checkPageUrl(tieringAssessmentV1URLs.PREDICTOR_SCORES)
    await predictorScoresPage.checkPageHeading(tieringAssessmentPageTitles.predictorScores)
    await predictorScoresPage.checkCompleteBannerVisible(false)
    await predictorScoresPage.checkAllPredictorScoreTypeVisible()
    await predictorScoresPage.checkViolentPredictorScoreTypeVisible()
    await predictorScoresPage.checkCombinedSeriousPredictorScoreTypeVisible()
    await predictorScoresPage.checkSeriousViolentPredictorScoreTypeVisible()

    /** Nav back to check answers, checking button functionality */
    await predictorScoresPage.clickCheckAnswersButton()
    await checkAnswersPage.checkPageUrl(tieringAssessmentV1URLs.CHECK_ANSWERS)
    await checkAnswersPage.checkPageHeading(tieringAssessmentPageTitles.checkAnswers)
    await checkAnswersPage.clickViewPredictorsButton()

    /** nav back to Predictor scores page, complete assessment */
    await predictorScoresPage.checkPageUrl(tieringAssessmentV1URLs.PREDICTOR_SCORES)
    await predictorScoresPage.checkPageHeading(tieringAssessmentPageTitles.predictorScores)
    await predictorScoresPage.checkCompleteBannerVisible(false)
    await predictorScoresPage.clickMarkAsCompleteButton()
    await predictorScoresPage.checkCompleteBannerVisible(true)
  })

})
