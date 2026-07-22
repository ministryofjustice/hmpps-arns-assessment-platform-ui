import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  drugsAffectedTheirLife,
  drugsAffectedTheirLifeDetails,
  drugsAnythingHelpedStopOrReduceUse,
  drugsReasonsForUse,
  drugsReasonsForUseDetails,
  drugsWhatCouldHelpNotUseDrugsInFuture,
  drugUseChanges,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseHistoryStep = step({
  path: `/${Step.drug_use_history.path}`,
  title: 'Drug use background',
  view: {
    locals: {
      backlink: sectionPath(Section.drug_use) + Step.drug_details.path,
    },
  },
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
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionStatus.incomplete),
        ],
        next: [redirect({ goto: 'drug-use-summary' })],
      },
    }),
  ],
})
