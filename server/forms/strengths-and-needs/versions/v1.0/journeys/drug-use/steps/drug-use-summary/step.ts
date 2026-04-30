import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  drugsPractitionerAnalysisMotivatedToStop,
  strengthsOrProtectiveFactors,
  riskOfSeriousHarm,
  riskOfReoffending,
} from './fields'

const saveButton = GovUKButton({
  text: 'Save',
  name: 'action',
  value: 'save',
})

export const drugUseSummaryStep = step({
  path: '/drug-use-summary',
  title: 'Drug use analysis',
  blocks: [
    drugsPractitionerAnalysisMotivatedToStop,
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-use-analysis#practitioner-analysis' })],
      },
    }),
  ],
})
