import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { drugMisuseField } from './fields'

export const drugMisuseStep = step({
  path: '/drug-misuse',
  title: 'Has NAME ever misused drugs?',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [drugMisuseField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer('ever-misused-drugs').match(Condition.Equals('true')),
            goto: 'drug-use',
          }),
          redirect({ goto: 'alcohol-ever-used' }),
        ],
      },
    }),
  ],
})
