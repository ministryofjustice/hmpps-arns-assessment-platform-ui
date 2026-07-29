import {access, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {GovUKButton} from "@ministryofjustice/hmpps-forge/govuk-components";

export const checkYourAnswersStep = step({
  path: '/check-your-answers',
  title: 'Check your answers',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [uuidSummaryField,  GovUKButton({ text: 'View reoffending predictors scores'})],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        effects: [],
        next: [redirect({ goto: 'reoffending-predictor-scores' })],
      },
    }),
  ],
})
