import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  drugsReasonsForUse,
  drugsReasonsForUseDetails,
  drugsAffectedTheirLife,
  drugsAffectedTheirLifeDetails,
  drugsAnythingHelpedStopOrReduceUse,
  drugUseChanges,
} from './fields'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseHistoryStep = step({
  path: '/drug-use-history',
  title: 'Drug use background',
  blocks: [
    drugsReasonsForUse,
    drugsReasonsForUseDetails,
    drugsAffectedTheirLife,
    drugsAffectedTheirLifeDetails,
    drugsAnythingHelpedStopOrReduceUse,
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
