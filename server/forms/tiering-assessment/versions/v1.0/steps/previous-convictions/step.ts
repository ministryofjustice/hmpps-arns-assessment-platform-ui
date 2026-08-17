import { access, Format, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const previousConvictionsStep = step({
  path: '/previous-convictions',
  title: Format('Has %1 previously been convicted of any of these offences?', CaseData.Forename),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadForename()],
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
