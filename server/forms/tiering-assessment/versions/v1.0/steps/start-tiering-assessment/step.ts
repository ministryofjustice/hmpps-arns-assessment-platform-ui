import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { dateOfCurrentConviction, dobField, genderField, offenceCodeField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const startTieringAssessmentStep = step({
  path: '/startTieringAssessment',
  title: 'Tiering Assessment Setup',
  reachability: { entryWhen: true },
  blocks: [genderField, dobField, dateOfCurrentConviction, offenceCodeField, GovUKButton({ text: 'Continue' })],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        effects: [TieringAssessmentEffects.InitialiseAssessment(), TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'placeholder-uuid-page' })],
      },
    }),
  ],
})
