import { redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  dateOfCurrentConviction,
  dobField,
  forenameField,
  genderField,
  offenceCodeField,
  supervisionStatusField,
} from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const startTieringAssessmentStep = step({
  path: '/startTieringAssessment',
  title: 'Tiering Assessment Setup',
  reachability: { entryWhen: true },
  blocks: [
    forenameField,
    genderField,
    dobField,
    dateOfCurrentConviction,
    supervisionStatusField,
    offenceCodeField,
    GovUKButton({ text: 'Continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.ReadWriteAccess(),
          TieringAssessmentEffects.InitialiseAssessment(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'current-offence-and-offending-history' })],
      },
    }),
  ],
})
