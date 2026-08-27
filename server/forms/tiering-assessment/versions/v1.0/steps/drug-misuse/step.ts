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
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { drugMisuseField } from './fields'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const drugMisuseStep = step({
  path: '/drug-misuse',
  title: Format('Has %1 ever misused drugs?', CaseData.Forename),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [drugMisuseField, GovUKButton({ text: 'Save and continue' })],
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
            when: Answer('ever-misused-drugs').match(Condition.Equals('true')),
            goto: 'drug-use',
          }),
          redirect({ goto: 'alcohol-ever-used' }),
        ],
      },
    }),
  ],
})
