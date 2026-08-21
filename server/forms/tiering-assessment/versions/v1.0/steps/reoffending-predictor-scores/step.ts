import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { buttonGroup, scores } from './fields'
import { backToTopLink } from '../../common'

export const reoffendingPredictorScoresStep = step({
  path: '/reoffending-predictor-scores',
  title: 'Reoffending Predictor scores',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.TransformRiskData()],
    }),
  ],
  blocks: [scores, backToTopLink, buttonGroup],
})
