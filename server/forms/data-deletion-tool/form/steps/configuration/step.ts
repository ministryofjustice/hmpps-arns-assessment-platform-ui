import {
  Condition,
  redirect,
  Self,
  step,
  submit,
  tieBreaker,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKPasswordInput,
  GovUKSelectInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import config from '../../../../../config'
import { DataDeletionToolEffects } from '../../../effects'

export const configurationStep = step({
  path: '/configuration',
  title: 'Configuration',
  reachability: {
    entryWhen: true,
    tieBreakers: [tieBreaker({ priority: 10 })],
  },
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [DataDeletionToolEffects.saveAnswers(), DataDeletionToolEffects.loadAssessmentData()],
        next: [redirect({ goto: 'events' })],
      },
    }),
  ],
  blocks: [
    GovUKSelectInput({
      code: 'environment',
      label: 'Environment',
      items: [
        { value: '', text: '' },
        ...Object.entries(config.forms.dataDeletionTool.environments).map(([key, value]) => ({
          value: key,
          text: value.apiUrl,
        })),
      ],
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Select an environment',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'clientId',
      label: 'Client ID',
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Enter a Client ID',
        }),
      ],
    }),
    GovUKPasswordInput({
      code: 'clientSecret',
      label: 'Client Secret',
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Enter a Client Secret',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'assessmentUuid',
      label: 'Assessment UUID',
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Enter an Assessment UUID',
        }),
      ],
    }),
    GovUKButton({
      text: 'Load data',
      name: 'action',
      value: 'next',
      preventDoubleClick: true,
    }),
  ],
})
