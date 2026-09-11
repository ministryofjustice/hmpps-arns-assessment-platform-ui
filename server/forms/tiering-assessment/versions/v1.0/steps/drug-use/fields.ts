import { and, Answer, Condition, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import {
  checkboxField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
  revealedQuestion,
  textField,
} from '../../../../constants/questionContent'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { DrugOption } from './constants/DrugOption'

const drugLastUsedField = (drugValue: string) =>
  revealedQuestion({
    content: {
      code: `${drugValue}_RADIO`,
      format: QuestionFormat.RADIO,
      text: contentFor('question.radio.text', drugValue),
      options: [
        {
          value: CommonOption.yes,
          text: contentFor('question.radio.option.YES'),
        },
        {
          value: CommonOption.no,
          text: contentFor('question.radio.option.NO'),
        },
        { divider: commonContentFor('or') },
        { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
      ],
      validationMessage: commonContentFor('validation.this_is_a_required_field'),
    },
    displayModes: {
      field: radioField({
        legendClasses: 'govuk-visually-hidden',
        dependentWhen: and(
          Answer(Question.drug_use).match(Condition.IsRequired()),
          Answer(Question.drug_use).match(Condition.Array.Contains(drugValue)),
        ),
      }),
    },
  })

const otherDrugName = revealedQuestion({
  content: {
    code: Question.other_drug_name,
    format: QuestionFormat.TEXT,
    text: contentFor('question.other_drug_name.text'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      labelClasses: 'govuk-visually-hidden',
      dependentWhen: and(
        Answer(Question.drug_use).match(Condition.IsRequired()),
        Answer(Question.drug_use).match(Condition.Array.Contains(DrugOption.other_drugs)),
      ),
      customValidations: [
        validation({
          condition: not(Self().not.match(Condition.String.HasMaxLength(200))),
          message: contentFor('question.other_drug_name.char_count_validation'),
        }),
      ],
    }),
  },
})

const whatDrugsMisusedQuestion = question({
  content: {
    code: Question.drug_use,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.drug_use.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: DrugOption.amphetamines,
        text: contentFor('question.drug_use.option.AMPHETAMINES'),
        reveals: drugLastUsedField(DrugOption.amphetamines),
      },
      {
        value: DrugOption.benzodiazepines,
        text: contentFor('question.drug_use.option.BENZODIAZEPINES'),
        reveals: drugLastUsedField(DrugOption.benzodiazepines),

      },
      {
        value: DrugOption.cannabis,
        text: contentFor('question.drug_use.option.CANNABIS'),
        reveals: drugLastUsedField(DrugOption.cannabis),
      },
      {
        value: DrugOption.cocaine_hydrochloride,
        text: contentFor('question.drug_use.option.COCAINE_HYDROCHLORIDE'),
        reveals: drugLastUsedField(DrugOption.cocaine_hydrochloride),
      },
      {
        value: DrugOption.crack_or_cocaine,
        text: contentFor('question.drug_use.option.CRACK_OR_COCAINE'),
        reveals: drugLastUsedField(DrugOption.crack_or_cocaine),
      },
      {
        value: DrugOption.ecstasy,
        text: contentFor('question.drug_use.option.ECSTASY'),
        reveals: drugLastUsedField(DrugOption.ecstasy),
      },
      {
        value: DrugOption.hallucinogens,
        text: contentFor('question.drug_use.option.HALLUCINOGENS'),
        reveals: drugLastUsedField(DrugOption.hallucinogens),
      },
      {
        value: DrugOption.heroin,
        text: contentFor('question.drug_use.option.HEROIN'),
        reveals: drugLastUsedField(DrugOption.heroin),
      },
      {
        value: DrugOption.ketamine,
        text: contentFor('question.drug_use.option.KETAMINE'),
        reveals: drugLastUsedField(DrugOption.ketamine),
      },
      {
        value: DrugOption.methadone,
        text: contentFor('question.drug_use.option.METHADONE'),
        reveals: drugLastUsedField(DrugOption.methadone),
      },
      {
        value: DrugOption.misused_prescribed_drugs,
        text: contentFor('question.drug_use.option.MISUSED_PRESCRIBED_DRUGS'),
        reveals: drugLastUsedField(DrugOption.misused_prescribed_drugs),
      },
      {
        value: DrugOption.other_opiates,
        text: contentFor('question.drug_use.option.OTHER_OPIATES'),
        reveals: drugLastUsedField(DrugOption.other_opiates),
      },
      {
        value: DrugOption.solvents,
        text: contentFor('question.drug_use.option.SOLVENTS'),
        reveals: drugLastUsedField(DrugOption.solvents),
      },
      {
        value: DrugOption.spice,
        text: contentFor('question.drug_use.option.SPICE'),
        reveals: drugLastUsedField(DrugOption.spice),
      },
      {
        value: DrugOption.steroids,
        text: contentFor('question.drug_use.option.STEROIDS'),
        reveals: drugLastUsedField(DrugOption.steroids),
      },
      {
        value: DrugOption.other_drugs,
        text: commonContentFor('option.OTHER'),
        reveals: [otherDrugName, drugLastUsedField(DrugOption.other_drugs)],
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.drug_use).match(Condition.IsRequired()),
      changePath: Step.drug_use.path,
      inlineRevealedQuestions: true,
    }),
  },
})

const motivationToStopMisuseQuestion = question({
  content: {
    code: Question.motivation_to_tackle_drug_misuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.motivation_to_tackle_drug_misuse.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_motivation,
        text: contentFor('question.motivation_to_tackle_drug_misuse.option.NO_MOTIVATION'),
      },
      {
        value: CommonOption.partial_motivation,
        text: contentFor('question.motivation_to_tackle_drug_misuse.option.PARTIAL_MOTIVATION'),
      },
      {
        value: CommonOption.full_motivation,
        text: contentFor('question.motivation_to_tackle_drug_misuse.option.FULL_MOTIVATION'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.motivation_to_tackle_drug_misuse).match(Condition.IsRequired()),
      changePath: Step.drug_use.path,
    }),
  },
})

export const drugUseFields = {
  code: Step.drug_use.code,
  questions: {
    whatDrugsMisusedQuestion,
    motivationToStopMisuseQuestion,
  },
}
