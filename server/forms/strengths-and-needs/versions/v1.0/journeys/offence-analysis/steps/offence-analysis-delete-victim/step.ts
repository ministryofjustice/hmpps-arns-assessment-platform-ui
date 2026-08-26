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
import { collectionCode, collectionName, VICTIM_FIELD_CODES } from '../../constants/constants'

export const offenceAnalysisDeleteVictimStep = step({
  path: `/${Step.offence_analysis_victim_delete.templatePath}`,
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
      effects: [
        StrengthsAndNeedsEffects.loadAnswersFromCollection(collectionCode, collectionName),
        StrengthsAndNeedsEffects.loadItemFromCollection(
          VICTIM_FIELD_CODES,
          collectionName,
          Params('itemId').pipe(Transformer.String.ToInt()),
        ),
      ],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.updateItemFromCollection(
            collectionCode,
            collectionName,
            VICTIM_FIELD_CODES,
            Params('itemId').pipe(Transformer.String.ToInt()),
          ),
        ],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
