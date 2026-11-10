import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  Data,
  Format,
  Literal,
  not,
  or,
  Self,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxField,
  question,
  QuestionFormat,
  questionFormGroupOf,
  questionTemplate,
  radioField,
  requiredValidationOf,
  revealedQuestion,
  SummaryRow,
} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { SANGenerators } from '../../../../generators'
import { contentFor, drugValueToText } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { drugsList, fieldCodeString } from './constants'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import { changeLinkActions, optionalDetails, requiredDetails, summaryRow, yesNo } from '../../constants/questionContent'
import { StrengthsAndNeedsTransformers } from '../../../../transformers'
import { StrengthsAndNeedsConditions } from '../../../../conditions'

const anyInjectableSelectedDrugs = Data('injectableSelectedDrugs').match(Condition.IsRequired())

export const drugUsedInLastSixMonths = (drugValue: ChainableExpr) =>
  Answer(Format(Question.drug_last_used_value, drugValue)).match(Condition.Equals(Option.last_six))

export const drugUsedMoreThanSixMonths = (drugValue: ChainableExpr) =>
  Answer(Format(Question.drug_last_used_value, drugValue)).match(Condition.Equals(Option.more_than_six))

const lastSixMonthConditions = drugsList.map(drug =>
  Answer(fieldCodeString(Question.drug_last_used, drug.value)).match(Condition.Equals(Option.last_six)),
)

const injectedDrugConditions = drugsList
  .filter(drug => {
    const value = typeof drug === 'string' ? drug : drug.value
    return value !== CommonOption.none
  })
  .map(drug => {
    const drugValue = typeof drug === 'string' ? drug : drug.value
    return and(
      Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
      drugUsedInLastSixMonths(Literal(drugValue.toLowerCase())),
    )
  })

export const anyInjectedDrugUsedInLastSixMonths = or(
  injectedDrugConditions[0],
  injectedDrugConditions[1],
  ...injectedDrugConditions.slice(2),
)

// Answer-based twin of `anyDrugUsedInLastSix` for steps that run before the
// deriveDrugCategories effect has populated the derived data.
const anyDrugUsedInLastSixMonths = or(
  lastSixMonthConditions[0],
  lastSixMonthConditions[1],
  ...lastSixMonthConditions.slice(2),
)

/**
 * Per-drug question templates — one question asked once per drug. Instance
 * codes are computed from the drug value, but the drug list is static, so
 * every instance is a stable question. Reveal-anchored templates project via
 * `instance(drugValue)`; collection-rendered ones via `over(itemExpr)`.
 */

// The summary deliberately shows shorter last-used labels than the edit
// field's options ("Last 6 months" vs "In the last 6 months").
const lastUsedSummaryLabels = [
  { value: Option.last_six, text: contentFor('option.LAST_SIX') },
  { value: Option.more_than_six, text: contentFor('option.MORE_THAN_SIX') },
]

export const drugLastUsed = questionTemplate({
  content: {
    code: drugValue => fieldCodeString(Question.drug_last_used, drugValue),
    format: QuestionFormat.RADIO,
    codeOver: drugValue => Format(Question.drug_last_used_value, drugValue),
    text: () => '',
    options: [
      { value: Option.last_six, text: contentFor('question.drug_last_used.option.LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('question.drug_last_used.option.MORE_THAN_SIX') },
    ],
    validationMessage: contentFor('question.drug_last_used.validation'),
  },
  displayModes: {
    collectionField: content =>
      GovUKRadioInput({
        code: content.code,
        formGroup: questionFormGroupOf(content.code),
        fieldset: {
          legend: {
            text: content.text,
          },
        },
        items: content.options,
        validWhen: requiredValidationOf(content),
      }),
    collectionSummaryRow: content => ({
      key: { text: contentFor('text.lastUsed.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(lastUsedSummaryLabels, Answer(content.code)),
      },
      actions: changeLinkActions(Step.drug_use_last_used.path, {
        code: content.code,
        text: contentFor('text.lastUsed.text'),
      }),
    }),
  },
})

export const drugsLastInjected = questionTemplate({
  content: {
    code: drugValue => fieldCodeString(Question.drugs_injected, drugValue),
    format: QuestionFormat.CHECKBOX,
    codeOver: drugValue => Format(Question.drugs_injected_value, drugValue),
    text: () => '',
    hint: commonContentFor('select_one_or_both'),
    options: [
      { value: Option.last_six, text: contentFor('option.IN_THE_LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('option.MORE_THAN_SIX') },
    ],
    validationMessage: contentFor('question.drugs_injected_months.validation'),
  },
  displayModes: {
    collectionField: content =>
      GovUKCheckboxInput({
        code: content.code,
        formGroup: questionFormGroupOf(content.code),
        fieldset: {
          legend: {
            text: content.text,
            classes: 'govuk-visually-hidden',
          },
        },
        hint: content.hint,
        items: content.options,
        dependentWhen: drugUsedInLastSixMonths(content.param),
        validWhen: requiredValidationOf(content),
      }),
    collectionSummaryRow: content => ({
      key: { text: contentFor('text.lastUsed.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(lastUsedSummaryLabels, Answer(content.code)),
      },
      actions: changeLinkActions(Step.drug_use_types.path, {
        code: content.code,
        text: contentFor('text.lastUsed.text'),
      }),
    }),
  },
})

export const drugHowOftenUsed = questionTemplate({
  content: {
    code: drugValue => fieldCodeString(Question.how_often_used, drugValue),
    format: QuestionFormat.RADIO,
    codeOver: drugValue => Format(Question.how_often_used_value, drugValue),
    text: () => contentFor('question.how_often_used.text', CaseData.Forename),
    options: [
      { value: Option.daily, text: contentFor('question.how_often_used.option.DAILY') },
      { value: Option.weekly, text: contentFor('question.how_often_used.option.WEEKLY') },
      { value: Option.monthly, text: contentFor('question.how_often_used.option.MONTHLY') },
      { value: Option.occasionally, text: contentFor('question.how_often_used.option.OCCASIONALLY') },
    ],
    validationMessage: contentFor('question.how_often_used.validation'),
  },
  displayModes: {
    collectionField: content =>
      GovUKRadioInput({
        code: content.code,
        formGroup: questionFormGroupOf(content.code),
        classes: 'govuk-radios--inline',
        fieldset: {
          legend: {
            text: content.text,
          },
        },
        items: content.options,
        dependentWhen: or(drugUsedInLastSixMonths(content.param), drugUsedMoreThanSixMonths(content.param)),
        validWhen: requiredValidationOf(content),
      }),
    collectionSummaryRow: content => ({
      key: { text: contentFor('text.howOften.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(content.options, Answer(content.code)),
      },
      visibleWhen: Answer(content.code).match(Condition.IsRequired()),
      actions: changeLinkActions(Step.drug_use_details.path, {
        code: content.code,
        text: contentFor('text.howOften.text'),
      }),
    }),
  },
})

export const drugHowOftenUsedDetails = questionTemplate({
  content: {
    code: drugValue => Question.how_often_used_details.replace('%1', drugValue.toLowerCase()),
    format: QuestionFormat.TEXT,
    codeOver: drugValue => Format(Question.how_often_used_details, drugValue),
    text: () => commonContentFor('optional_details'),
  },
  displayModes: {
    collectionField: content =>
      GovUKCharacterCount({
        code: content.code,
        formGroup: questionFormGroupOf(content.code),
        label: content.text,
        maxLength: CharacterLimit.c2000,
        dependentWhen: or(drugUsedInLastSixMonths(content.param), drugUsedMoreThanSixMonths(content.param)),
        validWhen: [
          validation({
            condition: Self().match(StrengthsAndNeedsConditions.HasMaxLength(CharacterLimit.c2000)),
            message: commonContentFor('validation.details_must_be_less_than', CharacterLimit.c2000),
          }),
        ],
        parsers: [StrengthsAndNeedsTransformers.DecodeHtmlEntities()],
        formatters: [StrengthsAndNeedsTransformers.EncodeHtmlEntities()],
      }),
    collectionSummaryRow: content => ({
      key: { text: content.text },
      value: {
        text: Answer(content.code),
      },
      visibleWhen: Answer(content.code).match(Condition.IsRequired()),
      actions: changeLinkActions(Step.drug_use_details.path, content),
    }),
  },
})

const otherDrugNameRevealed = revealedQuestion({
  content: {
    code: Question.other_drug_name,
    format: QuestionFormat.TEXT,
    text: contentFor('question.other_drug_name.text'),
    hint: contentFor('question.other_drug_name.hint'),
    validationMessage: contentFor('question.other_drug_name.text'),
  },
  displayModes: {
    field: (content, parent) =>
      GovUKTextInput({
        code: content.code,
        formGroup: questionFormGroupOf(content.code),
        label: {
          text: content.text,
          classes: 'govuk-visually-hidden',
        },
        hint: content.hint,
        dependentWhen: parent.selectedWhen,
        validWhen: [
          validation({
            condition: Self().match(Condition.IsRequired()),
            message: content.validationMessage,
          }),
          validation({
            condition: not(Self().not.match(Condition.String.HasMaxLength(CharacterLimit.c200))),
            message: contentFor('question.other_drug_name.validation', CharacterLimit.c200),
          }),
        ],
      }),
  },
})

const injectedDrugOption = (drugValue: string, text: ResolvableString) => ({
  value: drugValue,
  text,
  visibleWhen: Answer(Question.select_misused_drugs).match(Condition.Array.Contains(drugValue)),
})

const drugUse = question({
  content: {
    code: Question.drug_use,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drug_use.text', CaseData.Forename),
    hint: contentFor('question.drug_use.hint'),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.drug_use.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({ changeHref: Step.drug_use_status.path }),
  },
})

// "Other" is a placeholder on the drug list; the real name was typed in.
const drugName = (drugValue: string) => {
  if (drugValue === Option.other_drug) {
    return Answer(Question.other_drug_name)
  }

  return drugValueToText(drugValue)
}

/**
 * Every drug named, with what was said about it.
 * The view all answers page has to gather them.
 */
const drugAnswers = (drugValue: string) => {
  const named = (label: ResolvableString, code: string, answer: ResolvableString): SummaryRow => ({
    key: { text: label },
    value: { blocks: [GovUKBody({ text: answer, size: 's' })] },
    visibleWhen: Answer(code).match(Condition.IsRequired()),
  })

  const lastUsed = fieldCodeString(Question.drug_last_used, drugValue)
  const howOften = fieldCodeString(Question.how_often_used, drugValue)
  const details = Question.how_often_used_details.replace('%1', drugValue.toLowerCase())

  return GovUKSummaryList({
    classes: 'govuk-summary-list--no-border summary-answer-list',
    rows: [
      named(
        contentFor('text.lastUsed.text'),
        lastUsed,
        SANGenerators.getTextFromListDefinition(drugLastUsed.options, Answer(lastUsed)),
      ),
      named(
        contentFor('text.howOften.text'),
        howOften,
        SANGenerators.getTextFromListDefinition(drugHowOftenUsed.options, Answer(howOften)),
      ),
      named(contentFor('text.howOftenDetails.text'), details, Answer(details)),
    ],
  })
}

const selectMisusedDrugs = question({
  content: {
    code: Question.select_misused_drugs,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.select_misused_drugs.text', CaseData.Forename),
    hint: contentFor('question.select_misused_drugs.hint'),
    options: [
      { value: Option.amphetamines, text: contentFor('option.AMPHETAMINES') },
      { value: Option.benzodiazepines, text: contentFor('option.BENZODIAZEPINES') },
      { value: Option.cannabis, text: contentFor('option.CANNABIS') },
      { value: Option.cocaine, text: contentFor('option.COCAINE') },
      { value: Option.crack, text: contentFor('option.CRACK') },
      { value: Option.ecstasy, text: contentFor('option.ECSTASY') },
      { value: Option.hallucinogenics, text: contentFor('option.HALLUCINOGENICS') },
      { value: Option.heroin, text: contentFor('option.HEROIN') },
      { value: Option.methadone_not_prescribed, text: contentFor('option.METHADONE_NOT_PRESCRIBED') },
      { value: Option.misused_prescribed_drugs, text: contentFor('option.MISUSED_PRESCRIBED_DRUGS') },
      { value: Option.other_opiates, text: contentFor('option.OTHER_OPIATES') },
      { value: Option.solvents, text: contentFor('option.SOLVENTS') },
      { value: Option.steroids, text: contentFor('option.STEROIDS') },
      { value: Option.spice, text: contentFor('option.SPICE') },
      { value: Option.other_drug, text: commonContentFor('option.OTHER'), reveals: otherDrugNameRevealed },
    ],
    validationMessage: contentFor('question.select_misused_drugs.validation'),
  },
  displayModes: {
    field: checkboxField(),
    answerRow: (content): SummaryRow => ({
      key: { html: content.text },
      visibleWhen: Answer(content.code).match(Condition.IsRequired()),
      value: {
        blocks: drugsList.flatMap(drug => {
          const chosen = Answer(content.code).match(Condition.Array.Contains(drug.value))
          return [
            GovUKBody({ text: drugName(drug.value), visibleWhen: chosen }),
            { ...drugAnswers(drug.value), visibleWhen: chosen },
          ]
        }),
      },
    }),
  },
})

const drugsInjected = question({
  content: {
    code: Question.drugs_injected,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.drugs_injected.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: CommonOption.none, text: commonContentFor('option.NONE'), behaviour: 'exclusive' as const },
      { divider: 'or' },
      injectedDrugOption(Option.amphetamines, contentFor('option.AMPHETAMINES')),
      injectedDrugOption(Option.benzodiazepines, contentFor('option.BENZODIAZEPINES')),
      injectedDrugOption(Option.cocaine, contentFor('option.COCAINE')),
      injectedDrugOption(Option.crack, contentFor('option.CRACK')),
      injectedDrugOption(Option.heroin, contentFor('option.HEROIN')),
      injectedDrugOption(Option.methadone_not_prescribed, contentFor('option.METHADONE_NOT_PRESCRIBED')),
      injectedDrugOption(Option.misused_prescribed_drugs, contentFor('option.MISUSED_PRESCRIBED_DRUGS')),
      injectedDrugOption(Option.other_opiates, contentFor('option.OTHER_OPIATES')),
      injectedDrugOption(Option.steroids, contentFor('option.STEROIDS')),
      injectedDrugOption(Option.other_drug, Answer(Question.other_drug_name)),
    ],
    validationMessage: contentFor('question.drugs_injected.validation', CaseData.Forename),
  },
  displayModes: {
    field: checkboxField({ dependentWhen: anyInjectableSelectedDrugs }),
  },
})

const anythingHelpedStopOrReduce = question({
  content: {
    code: Question.drugs_anything_helped_stop_or_reduce_use,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drugs_anything_helped_stop_or_reduce_use.text', CaseData.Forename),
    hint: contentFor('question.drugs_anything_helped_stop_or_reduce_use.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.drugs_anything_helped_stop_or_reduce_use_details,
          validationMessage: contentFor('question.drugs_anything_helped_stop_or_reduce_use_details.validation'),
        }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        reveals: requiredDetails({
          code: Question.drugs_anything_helped_stop_or_reduce_use_details,
          validationMessage: contentFor('question.drugs_anything_helped_stop_or_reduce_use_details.validation'),
        }),
      },
    ],
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      visibleWhen: Answer(Question.drugs_anything_helped_stop_or_reduce_use).match(Condition.IsRequired()),
      changeHref: Step.drug_use_reduce_use.path,
    }),
  },
})

const motivatedToStopOrReduce = question({
  content: {
    code: Question.drugs_motivated_to_stop_or_reduce_use,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drugs_motivated_to_stop_or_reduce_use.text', CaseData.Forename),
    options: [
      {
        value: Option.no_motivation,
        text: contentFor('question.drugs_motivated_to_stop_or_reduce_use.option.NO_MOTIVATION'),
      },
      {
        value: Option.partial_motivation,
        text: contentFor('question.drugs_motivated_to_stop_or_reduce_use.option.PARTIAL_MOTIVATION'),
      },
      {
        value: Option.full_motivation,
        text: contentFor('question.drugs_motivated_to_stop_or_reduce_use.option.FULL_MOTIVATION'),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
      },
    ],
    validationMessage: contentFor('question.drugs_motivated_to_stop_or_reduce_use.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: anyDrugUsedInLastSixMonths,
      visibleWhen: anyDrugUsedInLastSixMonths,
    }),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_reduce_use.path,
      visibleWhen: Answer(Question.drugs_motivated_to_stop_or_reduce_use).match(Condition.IsRequired()),
    }),
  },
})

const drugUseChanges = question({
  content: {
    code: Question.drug_use_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drug_use_changes.text', CaseData.Forename),
    hint: contentFor('question.drug_use_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.drug_use_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.drug_use_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.drug_use_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_change_use.path,
      visibleWhen: Answer(Question.drug_use_changes).match(Condition.IsRequired()),
    }),
  },
})

const motivatedToStop = question({
  content: {
    code: Question.drugs_practitioner_analysis_motivated_to_stop,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.text', CaseData.Forename),
    options: [
      {
        value: Option.no_motivation,
        text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.NO_MOTIVATION'),
      },
      {
        value: Option.partial_motivation,
        text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.PARTIAL_MOTIVATION'),
      },
      {
        value: Option.full_motivation,
        text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.option.FULL_MOTIVATION'),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
      visibleWhen: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
    }),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_summary.path,
      visibleWhen: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
    }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.drug_use_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.drug_use_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.drug_use_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.drug_use_practitioner_analysis_strengths_or_protective_factors.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_summary.path,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.drug_use_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drug_use_practitioner_analysis_risk_of_serious_harm.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.drug_use_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.drug_use_practitioner_analysis_risk_of_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_summary.path,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.drug_use_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor('question.drug_use_practitioner_analysis_risk_of_reoffending.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.drug_use_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.drug_use_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      changeHref: Step.drug_use_summary.path,
    }),
  },
})

// `drugHowOftenUsed`/`drugHowOftenUsedDetails` are rendered per drug via
// `.over()` against a collection of drugs rather than a
// static option reveal, so `stableQuestionsOf` can't discover their instances
// by walking reveals. Register one content entry per drug explicitly so they
// still show up as stable questions (e.g. for FormConfig).
const drugCollectionQuestions = Object.fromEntries(
  drugsList.flatMap(drug => [
    [drugHowOftenUsed.codeOf(drug.value), { content: drugHowOftenUsed.contentOf(drug.value) }],
    [drugHowOftenUsedDetails.codeOf(drug.value), { content: drugHowOftenUsedDetails.contentOf(drug.value) }],
  ]),
)

export const drugUseSection = {
  code: Section.drug_use.code,
  questions: {
    drugUse,
    selectMisusedDrugs,
    drugsInjected,
    anythingHelpedStopOrReduce,
    motivatedToStopOrReduce,
    drugUseChanges,
  },
  practitionerAnalysis: {
    motivatedToStop,
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
  collectionQuestions: drugCollectionQuestions,
}
