import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {
  impulsivityProblemsField,
  proCriminalAttitudesField,
  regularOffendingActivitiesField,
  temperControlField,
} from './fields'

export const thinkingAttitudesAndBehavioursStep = step({
  path: '/thinking-attitudes-and-behaviours',
  title: 'Thinking, attitudes and behaviours',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadForename()],
    }),
  ],
  blocks: [
    regularOffendingActivitiesField,
    temperControlField,
    impulsivityProblemsField,
    proCriminalAttitudesField,
    GovUKButton({ text: 'Save and continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'offence-analysis' })],
      },
    }),
  ],
})
