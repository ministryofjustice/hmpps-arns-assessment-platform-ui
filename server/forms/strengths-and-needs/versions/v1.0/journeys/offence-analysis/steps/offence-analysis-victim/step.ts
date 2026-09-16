import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { victimQuestions } from '../../section'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Section } from '../../../../constants/section'

export const offenceAnalysisVictimStep = step({
  path: `/${Step.offence_analysis_victim.path}`,
  title: 'Add victim',
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.offence_analysis.path]),
    },
  },
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
