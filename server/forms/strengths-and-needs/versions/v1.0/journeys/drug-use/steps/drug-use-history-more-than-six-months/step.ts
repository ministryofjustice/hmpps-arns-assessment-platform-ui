import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-use-summary' })],
      },
    }),
  ],
})
