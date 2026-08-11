import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { bingeDrinkingField } from './fields'

export const bingeDrinkingStep = step({
  path: '/binge-drinking',
  title: 'Has NAME shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [bingeDrinkingField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'personal-relationships-and-community' })],
      },
    }),
  ],
})
