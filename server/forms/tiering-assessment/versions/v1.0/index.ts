import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../effects/TieringAssessmentEffects'
import { startTieringAssessmentStep } from './steps/start-tiering-assessment/step'
import { currentOffenceAndOffendingHistoryStep } from './steps/current-offence-and-offending-history/step'
import {uuidPlaceholderStep} from "./steps/uuid-placeholder/step";
import {sexualOffendingStep} from "./steps/sexual-offending/step";
import {dateOfCurrentSupervisionStep} from "./steps/date-of-current-supervision/step";
import {offencesSinceSupervisionStep} from "./steps/offences-since-supervision/step";
import {checkYourAnswersStep} from "./steps/check-your-answers/step";
import {reoffendingPredictorScoresStep} from "./steps/reoffending-predictor-scores/step";

export const tieringAssessmentV1Journey = journey({
  code: 'tiering-assessment-v1',
  title: 'Tiering Assessment',
  path: '/v1.0',
  steps: [
    startTieringAssessmentStep,
    currentOffenceAndOffendingHistoryStep,
    sexualOffendingStep, 
    dateOfCurrentSupervisionStep,
    offencesSinceSupervisionStep,
    checkYourAnswersStep,
    reoffendingPredictorScoresStep
  ],
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
})
