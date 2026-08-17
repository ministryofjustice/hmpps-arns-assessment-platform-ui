import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {
  impulsivityProblemsDetailsField,
  impulsivityProblemsField,
  proCriminalAttitudesDetailsField,
  proCriminalAttitudesField,
  regularOffendingActivitiesDetailsField,
  regularOffendingActivitiesField,
  temperControlDetailsField,
  temperControlField,
} from './fields'

export const thinkingAttitudesAndBehavioursStep = step({
  path: '/thinking-attitudes-and-behaviours',
  title: 'Thinking, attitudes and behaviours',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [
    regularOffendingActivitiesField,
    regularOffendingActivitiesDetailsField,
    temperControlField,
    temperControlDetailsField,
    impulsivityProblemsField,
    impulsivityProblemsDetailsField,
    proCriminalAttitudesField,
    proCriminalAttitudesDetailsField,
    GovUKButton({ text: 'Save and continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'offence-analysis' })],
      },
    }),
  ],
})
