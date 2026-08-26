import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../effects/TieringAssessmentEffects'
import { startTieringAssessmentStep } from './steps/start-tiering-assessment/step'
import { currentOffenceAndOffendingHistoryStep } from './steps/current-offence-and-offending-history/step'
import { sexualOffendingStep } from './steps/sexual-offending/step'
import { dateOfCurrentSupervisionStep } from './steps/date-of-current-supervision/step'
import { offencesSinceSupervisionStep } from './steps/offences-since-supervision/step'
import { reoffendingPredictorScoresStep } from './steps/reoffending-predictor-scores/step'
import { interviewQuestionStep } from './steps/interview-question/step'
import { employmentStep } from './steps/employment/step'
import { drugMisuseStep } from './steps/drug-misuse/step'
import { drugUseStep } from './steps/drug-use/step'
import { alcoholEverUsedStep } from './steps/alcohol-ever-used/step'
import { alcoholStep } from './steps/alcohol/step'
import { bingeDrinkingStep } from './steps/binge-drinking/step'
import { personalRelationshipsAndCommunityStep } from './steps/personal-relationships-and-community/step'
import { thinkingAttitudesAndBehavioursStep } from './steps/thinking-attitudes-and-behaviours/step'
import { offenceAnalysisStep } from './steps/offence-analysis/step'
import { previousConvictionsStep } from './steps/previous-convictions/step'
import { accommodationStep } from './steps/accommodation-old/step'
// import { accommodationStep } from './steps/accommodation/step'
import { checkYourAnswersStep } from './steps/check-your-answers-old/step'
// import { checkYourAnswersStep } from './steps/check-your-answers/step'

export const tieringAssessmentV1Journey = journey({
  code: 'tiering-assessment-v1',
  title: 'Tiering Assessment',
  path: '/v1.0',
  view: {
    template: 'tiering-assessment/views/tiering-assessment-step',
  },
  steps: [
    startTieringAssessmentStep,
    currentOffenceAndOffendingHistoryStep,
    sexualOffendingStep,
    dateOfCurrentSupervisionStep,
    offencesSinceSupervisionStep,
    interviewQuestionStep,
    accommodationStep,
    employmentStep,
    drugMisuseStep,
    drugUseStep,
    alcoholEverUsedStep,
    alcoholStep,
    bingeDrinkingStep,
    personalRelationshipsAndCommunityStep,
    thinkingAttitudesAndBehavioursStep,
    offenceAnalysisStep,
    previousConvictionsStep,
    checkYourAnswersStep,
    reoffendingPredictorScoresStep,
  ],
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
})
