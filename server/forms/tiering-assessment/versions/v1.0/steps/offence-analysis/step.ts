import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { offenceAnalysisFields } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton } from '../../common'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'

export const offenceAnalysisStep = step({
  path: `/${Step.offence_analysis.path}`,
  title: stepTitle(Step.offence_analysis),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    offenceAnalysisFields.questions.offenceElementsQuestion.displayModes.field,
    offenceAnalysisFields.questions.evidenceOfDomesticAbuseQuestion.displayModes.field,
    continueButton,
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.previous_convictions.path })],
      },
    }),
  ],
})
