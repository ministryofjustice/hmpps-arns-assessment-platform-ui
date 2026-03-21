import { step, submitTransition, redirect, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  drugsReasonsForUse,
  drugsReasonsForUseDetails,
  drugsAffectedTheirLife,
  drugsAffectedTheirLifeDetails,
  drugsAnythingHelpedStopOrReduceUse,
  drugsWhatCouldHelpNotUseDrugsInFuture,
  drugUseChanges,
} from '../drug-use-history/fields'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseHistoryMoreThanSixMonthsStep = step({
  path: '/drug-use-history-more-than-six-months',
  title: 'Drug use background',
  blocks: [
    drugsReasonsForUse,
    drugsReasonsForUseDetails,
    drugsAffectedTheirLife,
    drugsAffectedTheirLifeDetails,
    drugsAnythingHelpedStopOrReduceUse,
    drugsWhatCouldHelpNotUseDrugsInFuture,
    drugUseChanges,
    saveButton,
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-use-summary' })],
      },
    }),
  ],
})
