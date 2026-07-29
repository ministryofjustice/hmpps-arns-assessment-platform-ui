import {access, Answer, Condition, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {GovUKButton} from "@ministryofjustice/hmpps-forge/govuk-components";

export const sexualOffendingStep = step({
  path: '/sexual-offending',
  title: 'Sexual offending',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [uuidSummaryField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'date-of-current-supervision' })],
      },
    }),
  ],
})
