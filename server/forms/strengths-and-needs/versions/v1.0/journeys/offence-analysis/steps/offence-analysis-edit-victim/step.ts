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
import { victimAge, victimEthnicity, victimSex, victimType } from '../offence-analysis-victim/fields'
import { saveButton } from '../../../../constants/buttons'
import { collectionCode, collectionName, VICTIM_FIELD_CODES } from '../../constants/constants'

export const offenceAnalysisEditVictimStep = step({
  path: `/${Step.offence_analysis_victim_edit.templatePath}`,
  title: 'Add victim',
  reachability: { entryWhen: true },
  blocks: [victimType, victimAge, victimSex, victimEthnicity, saveButton],
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
