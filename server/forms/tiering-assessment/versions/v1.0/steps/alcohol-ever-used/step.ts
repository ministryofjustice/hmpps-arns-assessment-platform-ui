import {
  access,
  Answer,
  Condition,
  Format,
  redirect,
  step,
  submit,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { alcoholEverUsedField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const alcoholEverUsedStep = step({
  path: '/alcohol-ever-used',
  title: Format('Has %1 ever drunk alcohol?', CaseData.Forename),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [alcoholEverUsedField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer('has-ever-drunk-alcohol').match(Condition.Equals('YES_IN_LAST_THREE_MONTHS')),
            goto: 'alcohol',
          }),
          redirect({
            when: Answer('has-ever-drunk-alcohol').match(Condition.Equals('YES_NOT_IN_LAST_THREE_MONTHS')),
            goto: 'binge-drinking',
          }),
          redirect({ goto: 'personal-relationships-and-community' }),
        ],
      },
    }),
  ],
})
