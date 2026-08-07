import {access, Answer, Condition, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { alcoholEverUsedField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const alcoholEverUsedStep = step({
  path: '/alcohol-ever-used',
  title: 'Has NAME ever drunk alcohol?',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [alcoholEverUsedField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [
          redirect({
            when: Answer('is-current-alcohol-use-a-problem').match(Condition.Equals('true')),
            goto: 'alcohol',
          }),
          redirect({ goto: 'binge-drinking' })
        ],
      },
    }),
  ],
})
