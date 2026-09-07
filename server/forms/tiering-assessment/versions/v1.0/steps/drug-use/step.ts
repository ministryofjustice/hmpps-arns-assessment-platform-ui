import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { drugUseFields } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton } from '../../common'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'

export const drugUseStep = step({
  path: `/${Step.drug_use.path}`,
  title: stepTitle(Step.drug_misuse),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    drugUseFields.questions.whatDrugsMisusedQuestion.displayModes.field,
    drugUseFields.questions.motivationToStopMisuseQuestion.displayModes.field,
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
        next: [redirect({ goto: Step.alcohol_ever_used.path })],
      },
    }),
  ],
})
