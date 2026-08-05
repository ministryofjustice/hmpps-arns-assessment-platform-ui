import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const drugMisuseStep = step({
  path: '/drug-misuse',
  title: 'Has NAME ever misused drugs?',
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
        next: [redirect({ goto: 'drug-use' })],
      },
    }),
  ],
})
