import { access, Format, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { bingeDrinkingField } from './fields'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const bingeDrinkingStep = step({
  path: '/binge-drinking',
  title: Format(
    'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
    CaseData.Forename,
  ),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadForename()],
    }),
  ],
  blocks: [bingeDrinkingField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'personal-relationships-and-community' })],
      },
    }),
  ],
})
