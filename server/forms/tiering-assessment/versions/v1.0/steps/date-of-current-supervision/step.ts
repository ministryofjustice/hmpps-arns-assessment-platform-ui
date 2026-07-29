import {access, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {GovUKButton} from "@ministryofjustice/hmpps-forge/govuk-components";

export const dateOfCurrentSupervisionStep = step({
  path: '/date-of-current-supervision',
  title: "What date did NAME's current supervision in the community begin?",
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
        next: [redirect({ goto: 'offences-since-supervision' })],
      },
    }),
  ],
})
