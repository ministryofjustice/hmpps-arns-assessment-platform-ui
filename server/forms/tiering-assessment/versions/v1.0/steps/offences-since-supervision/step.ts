import {access, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {GovUKButton} from "@ministryofjustice/hmpps-forge/govuk-components";

export const offencesSinceSupervisionStep = step({
  path: '/offences-since-supervision',
  title: 'Has NAME commited any offences since DATE',
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
        next: [redirect({ goto: 'check-your-answers' })],
      },
    }),
  ],
})
