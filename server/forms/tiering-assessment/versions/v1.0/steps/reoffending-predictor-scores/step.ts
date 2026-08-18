import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const reoffendingPredictorScoresStep = step({
  path: '/reoffending-predictor-scores',
  title: 'Reoffending Predictor scores',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [uuidSummaryField],
})
