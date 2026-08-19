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
import { Question } from '../../constants/question'
import { victimAge, victimEthnicity, victimSex, victimType } from '../offence-analysis-victim/fields'
import { saveButton } from '../../../../constants/buttons'

const collectionCode = 'victims'
const collectionName = 'OFFENCE_ANALYSIS_VICTIM'

const VICTIM_FIELD_CODES = [
  Question.offence_analysis_victim_type,
  Question.offence_analysis_victim_age,
  Question.offence_analysis_victim_sex,
  Question.offence_analysis_victim_ethnicity,
]

export const offenceAnalysisDeleteVictimStep = step({
  path: `/${Step.offence_analysis_victim_delete.templatePath}`,
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
