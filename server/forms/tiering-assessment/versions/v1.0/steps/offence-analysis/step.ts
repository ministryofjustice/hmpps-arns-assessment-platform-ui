import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { evidenceOfDomesticAbuseField, offenceElementsField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton } from '../../common'

export const offenceAnalysisStep = step({
  path: '/offence-analysis',
  title: 'Offence analysis',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [offenceElementsField, evidenceOfDomesticAbuseField, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'previous-convictions' })],
      },
    }),
  ],
})
