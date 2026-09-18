import {
  access,
  Condition,
  Params,
  Post,
  redirect,
  step,
  submit,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { victimQuestions } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Section } from '../../../../constants/section'
import { autosaveSubmit } from '../../../../autosave'

export const offenceAnalysisEditVictimStep = step({
  path: `/${Step.offence_analysis_victim_edit.templatePath}`,
  title: 'Add victim',
  view: {
    locals: {
      backlink: createRoute([
        ...baseSanRoute,
        Section.offence_analysis.path,
        Step.offence_analysis_victim_summary.path,
      ]),
    },
  },
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
      effects: [
        StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection),
        StrengthsAndNeedsEffects.loadItemFromCollection(
          victimsCollection,
          Params('itemId').pipe(Transformer.String.ToInt()),
        ),
      ],
    }),
  ],
  onSubmission: [
    autosaveSubmit,
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.updateItemFromCollection(
            victimsCollection,
            Params('itemId').pipe(Transformer.String.ToInt()),
          ),
        ],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
