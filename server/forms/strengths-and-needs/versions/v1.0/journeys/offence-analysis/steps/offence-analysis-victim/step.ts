import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { victimQuestions } from '../../section'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'

export const offenceAnalysisVictimStep = step({
  path: `/${Step.offence_analysis_victim.path}`,
  title: 'Add victim',
  reachability: { entryWhen: true },
  blocks: [
    victimQuestions.victimType.displayModes.field,
    victimQuestions.victimAge.displayModes.field,
    victimQuestions.victimSex.displayModes.field,
    victimQuestions.victimEthnicity.displayModes.field,
    saveButton,
  ],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.addItemToCollection(victimsCollection)],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
