import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { buttonGroup, scores } from './fields'
import { backToTopLink } from '../../common'
import { stepTitle } from '../../locales'
import { Step } from '../../constants/page'

export const reoffendingPredictorScoresStep = step({
  path: `/${Step.reoffending_predictor_scores.path}`,
  title: stepTitle(Step.reoffending_predictor_scores),
  onAccess: [
    access({
      effects: [
        TieringAssessmentEffects.IsAssessmentStatusComplete(),
        TieringAssessmentEffects.LoadAssessmentData(),
        TieringAssessmentEffects.TransformRiskData(),
        TieringAssessmentEffects.LoadCaseData(),
      ],
    }),
  ],
  blocks: [scores, backToTopLink, buttonGroup],
  onSubmission: [
    submit({
      onAlways: {
        effects: [TieringAssessmentEffects.SetAssessmentComplete(), TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: Step.reoffending_predictor_scores.path })],
      },
    }),
  ],
})
