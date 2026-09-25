// Tiering assessment V1 URLs for use in playwright testing suits:
const tieringAssessmentFormPath = '/tiering-assessment'
const v1Path = '/v1.0'
const start = '/startTieringAssessment'
const offenceHistory = '/current-offence-and-offending-history'
const sexualOffending = '/sexual-offending'
const dateOfCurrentSupervision = '/date-of-current-supervision'
const offencesSinceSupervision = '/offences-since-supervision'
const interview = '/interview-question'
const checkAnswers = '/check-your-answers'
const predictorScores = '/reoffending-predictor-scores'
const accommodation = '/accommodation'
const employment = '/employment'
const drugMisuse = '/drug-misuse'
const drugUse = '/drug-use'
const everDrunkAlcohol = '/alcohol-ever-used'
const bingeDrinking = '/binge-drinking'
const alcoholUsePage = '/alcohol'
const personalRelationshipsAndCommunityPage = '/personal-relationships-and-community'
const thinkingAttitudesAndBehaviours = '/thinking-attitudes-and-behaviours'
const offenceAnalysis = '/offence-analysis'
const previousConvictions = '/previous-convictions'

export const tieringAssessmentV1URLs = {
  LOGIN: tieringAssessmentFormPath + v1Path,
  START_TIERING_ASSESSMENT: tieringAssessmentFormPath + v1Path + start,
  OFFENCE_HISTORY: tieringAssessmentFormPath + v1Path + offenceHistory,
  SEXUAL_OFFENDING: tieringAssessmentFormPath + v1Path + sexualOffending,
  CURRENT_SUPERVISION: tieringAssessmentFormPath + v1Path + dateOfCurrentSupervision,
  OFFENCE_SINCE_SUPERVISION: tieringAssessmentFormPath + v1Path + offencesSinceSupervision,
  INTERVIEW: tieringAssessmentFormPath + v1Path + interview,
  CHECK_ANSWERS: tieringAssessmentFormPath + v1Path + checkAnswers,
  PREDICTOR_SCORES: tieringAssessmentFormPath + v1Path + predictorScores,
  ACCOMMODATION: tieringAssessmentFormPath + v1Path + accommodation,
  EMPLOYMENT: tieringAssessmentFormPath + v1Path + employment,
  DRUG_MISUSE: tieringAssessmentFormPath + v1Path + drugMisuse,
  DRUG_USE: tieringAssessmentFormPath + v1Path + drugUse,
  EVER_DRUNK_ALCOHOL: tieringAssessmentFormPath + v1Path + everDrunkAlcohol,
  BINGE_DRINKING: tieringAssessmentFormPath + v1Path + bingeDrinking,
  ALCOHOL_USE: tieringAssessmentFormPath + v1Path + alcoholUsePage,
  PERSONAL_RELATIONSHIPS_AND_COMMUNITY: tieringAssessmentFormPath + v1Path + personalRelationshipsAndCommunityPage,
  THINKING_ATTITUDES_AND_BEHAVIOURS: tieringAssessmentFormPath + v1Path + thinkingAttitudesAndBehaviours,
  OFFENCE_ANALYSIS: tieringAssessmentFormPath + v1Path + offenceAnalysis,
  PREVIOUS_CONVICTIONS: tieringAssessmentFormPath + v1Path + previousConvictions,
}

// Tiering assessment V1 page titles
export const tieringAssessmentPageTitles = {
  offenceHistory: 'Current offence and offending history',
  sexualOffending: 'Sexual offending',
  currentSupervision: 'Date of current supervision',
  offencesSinceSupervision: 'Offences since community date',
  interview: 'Interview',
  checkAnswers: 'Check your answers',
  predictorScores: 'Reoffending Predictor scores',
  accommodation: 'Accommodation',
  employment: 'Employment and education',
  drugUse: 'Drug use',
  alcohol: 'Alcohol use',
  personalRelationshipsAndCommunity: 'Personal relationships and community',
  thinkingAttitudesAndBehaviours: 'Thinking, attitudes and behaviours',
  offenceAnalysis: 'Offence analysis',
  riskOfSeriousHarm: 'Risk of serious harm',
}
