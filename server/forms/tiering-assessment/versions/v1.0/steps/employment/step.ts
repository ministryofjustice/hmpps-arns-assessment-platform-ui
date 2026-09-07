import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentFields } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { Step } from '../../constants/page'
import { continueButton } from '../../common'
import { stepTitle } from '../../locales'

export const employmentStep = step({
  path: `/${Step.employment.path}`,
  title: stepTitle(Step.employment),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [employmentFields.questions.currentEmploymentStatusField.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'drug-misuse' })],
      },
    }),
  ],
})
