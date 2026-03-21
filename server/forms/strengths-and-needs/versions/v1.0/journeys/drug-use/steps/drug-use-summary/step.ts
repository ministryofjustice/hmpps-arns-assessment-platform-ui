import { step, submitTransition, redirect, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
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
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-use-analysis#practitioner-analysis' })],
      },
    }),
  ],
})
