import { access, Format, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { bingeDrinkingField } from './fields'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { Step } from '../../constants/page'

export const bingeDrinkingStep = step({
  path: `/${Step.binge_drinking.path}`,
  title: Format(
    'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
    CaseData.Forename,
  ),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [bingeDrinkingField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.personal_relationships_and_community.path })],
      },
    }),
  ],
})
