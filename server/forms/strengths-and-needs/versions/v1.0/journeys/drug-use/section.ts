import {
  and,
  Answer,
  Condition,
  Data,
  Format,
  not,
  or,
  Self,
  validation,
  when,
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
  questionTemplate,
  radioDetails,
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
import {
  characterCountField,
  checkboxSummaryRow,
  createSummaryRowActions,
  optionalDetails,
  requiredDetails,
  summaryRow,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'
import { isEditMode } from '../../guards'

const anyDrugUsedInLastSix = Data('drugsUsedInLastSix').match(Condition.IsRequired())
const anyDrugUsedMoreThanSix = Data('drugsUsedMoreThanSix').match(Condition.IsRequired())
const anyInjectableSelectedDrugs = Data('injectableSelectedDrugs').match(Condition.IsRequired())

const lastSixMonthConditions = drugsList.map(drug =>
  Answer(fieldCodeString('drug_last_used', drug.value)).match(Condition.Equals('LAST_SIX')),
)

// Answer-based twin of `anyDrugUsedInLastSix` for steps that run before the
// deriveDrugCategories effect has populated the derived data.
const anyDrugUsedInLastSixMonths = or(
  lastSixMonthConditions[0],
  lastSixMonthConditions[1],
  ...lastSixMonthConditions.slice(2),
)

const practitionerAnalysisHref = `${Step.drug_use_summary.path}#practitioner-analysis`

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
    text: drugValue => contentFor('question.drug_last_used.text', drugValueToText(drugValue)),
    options: [
      { value: Option.last_six, text: contentFor('option.LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('question.drug_last_used.option.MORE_THAN_SIX') },
    ],
    validationMessage: contentFor('question.drug_last_used.validation'),
  },
  displayModes: {
    field: radioDetails({ legendClasses: 'govuk-visually-hidden' }),
    collectionSummaryRow: content => ({
      key: { text: contentFor('text.lastUsed.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(lastUsedSummaryLabels, Answer(content.code)),
      },
      actions: createSummaryRowActions(Step.add_drugs.path),
    }),
  },
})

export const drugHowOftenUsed = questionTemplate({
  content: {
    code: drugValue => fieldCodeString(Question.how_often_used_last_six_months, drugValue),
    format: QuestionFormat.RADIO,
    codeOver: drugValue => Format(Question.how_often_used_value, drugValue),
    text: () => contentFor('question.how_often_used_last_six_months.text', CaseData.Forename),
    options: [
      { value: Option.daily, text: contentFor('question.how_often_used_last_six_months.option.DAILY') },
      { value: Option.weekly, text: contentFor('question.how_often_used_last_six_months.option.WEEKLY') },
      { value: Option.monthly, text: contentFor('question.how_often_used_last_six_months.option.MONTHLY') },
      { value: Option.occasionally, text: contentFor('question.how_often_used_last_six_months.option.OCCASIONALLY') },
    ],
    validationMessage: contentFor('question.how_often_used_last_six_months.validation'),
  },
  displayModes: {
    collectionField: content =>
      GovUKRadioInput({
        code: content.code,
        classes: 'govuk-radios--inline',
        fieldset: {
          legend: {
            text: content.text,
          },
        },
        items: content.options,
        dependentWhen: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
        validWhen: requiredValidationOf(content),
      }),
    collectionSummaryRow: content => ({
      key: { text: contentFor('text.howOften.text') },
      value: {
        text: SANGenerators.getTextFromListDefinition(content.options, Answer(content.code)),
      },
      visibleWhen: Answer(content.code).match(Condition.IsRequired()),
      actions: createSummaryRowActions(Step.drug_details.path),
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
        label: content.text,
        maxLength: CharacterLimit.c2000,
        validWhen: [
          validation({
            condition: Self().match(Condition.String.HasMaxLength(CharacterLimit.c2000)),
            message: commonContentFor('validation.details_must_be_less_than', CharacterLimit.c2000),
          }),
        ],
      }),
    collectionSummaryRow: content => ({
      key: { text: content.text },
      value: {
        text: Answer(content.code),
      },
      visibleWhen: Answer(content.code).match(Condition.IsRequired()),
      actions: createSummaryRowActions(Step.drug_details.path),
    }),
  },
})

export const drugsInjectedMonths = questionTemplate({
  content: {
    code: drugValue => fieldCodeString(Question.drugs_injected, drugValue),
    format: QuestionFormat.CHECKBOX,
    text: () => contentFor('question.drugs_injected_months.text', CaseData.Forename),
    hint: commonContentFor('select_one_or_both'),
    options: [
      { value: Option.last_six, text: contentFor('option.IN_THE_LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('option.MORE_THAN_SIX') },
    ],
    validationMessage: contentFor('question.drug_last_used.validation'),
  },
  displayModes: {
    // Bespoke projection: the months question only applies while the drug's
    // last-used answer is "last 6 months" — wiring that reaches outside the
    // parent option context, so a standard details mode cannot derive it.
    field: (content, parent) =>
      GovUKCheckboxInput({
        code: content.code,
        fieldset: {
          legend: {
            text: content.text,
            classes: 'govuk-fieldset__legend--m',
          },
        },
        hint: content.hint,
        items: content.options,
        dependentWhen: and(
          Answer(Question.drugs_injected).match(Condition.IsRequired()),
          Answer(Question.drugs_injected).match(Condition.Array.Contains(parent.optionValue)),
          Answer(drugLastUsed.codeOf(parent.optionValue)).match(Condition.Equals(Option.last_six)),
        ),
        visibleWhen: Answer(drugLastUsed.codeOf(parent.optionValue)).match(Condition.Equals(Option.last_six)),
        validWhen: requiredValidationOf(content),
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
  reveals: drugsInjectedMonths.instance(drugValue),
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
    summaryRow: summaryRow({ changeHref: Step.drug_use.path }),
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
  const howOften = fieldCodeString(Question.how_often_used_last_six_months, drugValue)
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
      {
        value: Option.amphetamines,
        text: contentFor('option.AMPHETAMINES'),
        reveals: drugLastUsed.instance(Option.amphetamines),
      },
      {
        value: Option.benzodiazepines,
        text: contentFor('option.BENZODIAZEPINES'),
        reveals: drugLastUsed.instance(Option.benzodiazepines),
      },
      {
        value: Option.cannabis,
        text: contentFor('option.CANNABIS'),
        reveals: drugLastUsed.instance(Option.cannabis),
      },
      { value: Option.cocaine, text: contentFor('option.COCAINE'), reveals: drugLastUsed.instance(Option.cocaine) },
      { value: Option.crack, text: contentFor('option.CRACK'), reveals: drugLastUsed.instance(Option.crack) },
      { value: Option.ecstasy, text: contentFor('option.ECSTASY'), reveals: drugLastUsed.instance(Option.ecstasy) },
      {
        value: Option.hallucinogenics,
        text: contentFor('option.HALLUCINOGENICS'),
        reveals: drugLastUsed.instance(Option.hallucinogenics),
      },
      { value: Option.heroin, text: contentFor('option.HEROIN'), reveals: drugLastUsed.instance(Option.heroin) },
      {
        value: Option.methadone_not_prescribed,
        text: contentFor('option.METHADONE_NOT_PRESCRIBED'),
        reveals: drugLastUsed.instance(Option.methadone_not_prescribed),
      },
      {
        value: Option.misused_prescribed_drugs,
        text: contentFor('option.MISUSED_PRESCRIBED_DRUGS'),
        reveals: drugLastUsed.instance(Option.misused_prescribed_drugs),
      },
      {
        value: Option.other_opiates,
        text: contentFor('option.OTHER_OPIATES'),
        reveals: drugLastUsed.instance(Option.other_opiates),
      },
      {
        value: Option.solvents,
        text: contentFor('option.SOLVENTS'),
        reveals: drugLastUsed.instance(Option.solvents),
      },
      {
        value: Option.steroids,
        text: contentFor('option.STEROIDS'),
        reveals: drugLastUsed.instance(Option.steroids),
      },
      { value: Option.spice, text: contentFor('option.SPICE'), reveals: drugLastUsed.instance(Option.spice) },
      {
        value: Option.other_drug,
        text: commonContentFor('option.OTHER'),
        reveals: [otherDrugNameRevealed, drugLastUsed.instance(Option.other_drug)],
      },
    ],
    validationMessage: contentFor('question.select_misused_drugs.validation'),
  },
  displayModes: {
    field: checkboxField(),
    // Each drug chosen, followed by the answers given about that drug.
    summaryRow: (content): SummaryRow => ({
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

const moreThanSixMonthsDetails = question({
  content: {
    code: Question.not_used_in_last_six_months_details,
    format: QuestionFormat.TEXT,
    text: contentFor('question.not_used_in_last_six_months_details.text', CaseData.ForenamePossessive),
    hint: contentFor('question.not_used_in_last_six_months_details.hint'),
    validationMessage: contentFor('question.not_used_in_last_six_months_details.validation'),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: anyDrugUsedMoreThanSix,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.drug_details.path,
      visibleWhen: Answer(Question.not_used_in_last_six_months_details).match(Condition.IsRequired()),
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

const receivingTreatment = question({
  content: {
    code: Question.drugs_is_receiving_treatment,
    format: QuestionFormat.RADIO,
    text: when(anyDrugUsedInLastSix)
      .then(contentFor('question.drugs_is_receiving_treatment.text.usedLastSixMonths', CaseData.Forename))
      .else(contentFor('question.drugs_is_receiving_treatment.text.notUsedInLastSixMonths', CaseData.Forename)),
    options: yesNo({
      yes: requiredDetails({
        code: Question.drugs_is_receiving_treatment_yes_details,
        validationMessage: contentFor('question.drugs_is_receiving_treatment_yes_details.validation'),
      }),
      no: optionalDetails({ code: Question.drugs_is_receiving_treatment_no_details }),
    }),
    validationMessage: when(anyDrugUsedInLastSix)
      .then(contentFor('question.drugs_is_receiving_treatment.validation.usedLastSixMonths'))
      .else(contentFor('question.drugs_is_receiving_treatment.validation.notUsedInLastSixMonths')),
  },
  displayModes: {
    field: radioField(),
    summaryRow: summaryRow({
      changeHref: Step.drug_details.path,
      visibleWhen: and(isEditMode, Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired())),
    }),
  },
})

const reasonsForUse = question({
  content: {
    code: Question.drugs_reasons_for_use,
    format: QuestionFormat.CHECKBOX,
    text: when(anyDrugUsedInLastSixMonths)
      .then(contentFor('question.drugs_reasons_for_use.text.usedLastSixMonths', CaseData.Forename))
      .else(contentFor('question.drugs_reasons_for_use.text.notUsedInLastSixMonths', CaseData.Forename)),
    hint: contentFor('question.drugs_reasons_for_use.hint'),
    options: [
      {
        value: Option.cultural_or_religious,
        text: contentFor('question.drugs_reasons_for_use.option.CULTURAL_OR_RELIGIOUS'),
      },
      {
        value: Option.curiosity_or_experimentation,
        text: contentFor('question.drugs_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION'),
      },
      {
        value: Option.enhance_performance,
        text: contentFor('question.drugs_reasons_for_use.option.ENHANCE_PERFORMANCE'),
      },
      {
        value: Option.escapism_or_avoidance,
        text: contentFor('question.drugs_reasons_for_use.option.ESCAPISM_OR_AVOIDANCE'),
      },
      {
        value: Option.managing_emotional_issues,
        text: contentFor('question.drugs_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES'),
      },
      { value: Option.peer_pressure, text: contentFor('question.drugs_reasons_for_use.option.PEER_PRESSURE') },
      {
        value: Option.recreation_or_pleasure,
        text: contentFor('question.drugs_reasons_for_use.option.RECREATION_OR_PLEASURE'),
      },
      { value: Option.self_medication, text: contentFor('question.drugs_reasons_for_use.option.SELF_MEDICATION') },
      { value: CommonOption.other, text: commonContentFor('option.OTHER') },
    ],
    validationMessage: when(anyDrugUsedInLastSixMonths)
      .then(contentFor('question.drugs_reasons_for_use.validation.usedLastSixMonths'))
      .else(contentFor('question.drugs_reasons_for_use.validation.notUsedInLastSixMonths')),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: checkboxSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_reasons_for_use).match(Condition.IsRequired()),
    }),
  },
})

const reasonsForUseDetails = question({
  content: {
    code: Question.drugs_reasons_for_use_details,
    format: QuestionFormat.TEXT,
    text: when(anyDrugUsedInLastSixMonths)
      .then(contentFor('question.drugs_reasons_for_use_details.text.usedLastSixMonths', CaseData.Forename))
      .else(contentFor('question.drugs_reasons_for_use_details.text.notUsedInLastSixMonths', CaseData.Forename)),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      label: commonContentFor('optional_details'),
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_reasons_for_use_details).match(Condition.IsRequired()),
    }),
  },
})

const affectedTheirLife = question({
  content: {
    code: Question.drugs_affected_their_life,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.drugs_affected_their_life.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.behaviour,
        text: contentFor('question.drugs_affected_their_life.option.BEHAVIOUR.text'),
        hint: contentFor('question.drugs_affected_their_life.option.BEHAVIOUR.hint'),
      },
      {
        value: Option.community,
        text: contentFor('question.drugs_affected_their_life.option.COMMUNITY.text'),
        hint: contentFor('question.drugs_affected_their_life.option.COMMUNITY.hint'),
      },
      {
        value: Option.finances,
        text: contentFor('question.drugs_affected_their_life.option.FINANCES.text'),
        hint: contentFor('question.drugs_affected_their_life.option.FINANCES.hint'),
      },
      {
        value: Option.links_to_offending,
        text: contentFor('question.drugs_affected_their_life.option.LINKS_TO_OFFENDING.text'),
      },
      {
        value: Option.health,
        text: contentFor('question.drugs_affected_their_life.option.HEALTH.text'),
        hint: contentFor('question.drugs_affected_their_life.option.HEALTH.hint'),
      },
      {
        value: Option.relationships,
        text: contentFor('question.drugs_affected_their_life.option.RELATIONSHIPS.text'),
        hint: contentFor('question.drugs_affected_their_life.option.RELATIONSHIPS.hint'),
      },
      { value: CommonOption.other, text: commonContentFor('option.OTHER') },
    ],
    validationMessage: contentFor('question.drugs_affected_their_life.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: checkboxSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_affected_their_life).match(Condition.IsRequired()),
    }),
  },
})

const affectedTheirLifeDetails = question({
  content: {
    code: Question.drugs_affected_their_life_details,
    format: QuestionFormat.TEXT,
    text: contentFor('question.drugs_affected_their_life_details.text', CaseData.ForenamePossessive),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      label: commonContentFor('optional_details'),
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_affected_their_life_details).match(Condition.IsRequired()),
    }),
  },
})

const anythingHelpedStopOrReduce = question({
  content: {
    code: Question.drugs_anything_helped_stop_or_reduce_use,
    format: QuestionFormat.TEXT,
    text: contentFor('question.drugs_anything_helped_stop_or_reduce_use.text', CaseData.Forename),
    hint: contentFor('question.drugs_anything_helped_stop_or_reduce_use.hint'),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: anyDrugUsedInLastSixMonths,
      visibleWhen: anyDrugUsedInLastSixMonths,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_anything_helped_stop_or_reduce_use).match(Condition.IsRequired()),
    }),
  },
})

const whatCouldHelpNotUseInFuture = question({
  content: {
    code: Question.drugs_what_could_help_not_use_drugs_in_future,
    format: QuestionFormat.TEXT,
    text: Format('What could help %1 not use drugs in the future? (optional)', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: not(anyDrugUsedInLastSixMonths),
      visibleWhen: not(anyDrugUsedInLastSixMonths),
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.drug_use_history.path,
      visibleWhen: Answer(Question.drugs_what_could_help_not_use_drugs_in_future).match(Condition.IsRequired()),
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
      changeHref: Step.drug_use_history.path,
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
      changeHref: practitionerAnalysisHref,
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
      changeHref: practitionerAnalysisHref,
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
      changeHref: practitionerAnalysisHref,
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
      changeHref: practitionerAnalysisHref,
    }),
  },
})

// `drugHowOftenUsed`/`drugHowOftenUsedDetails` are rendered per drug via
// `.over()` against the runtime `drugsUsedInLastSix` collection rather than a
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
    moreThanSixMonthsDetails,
    drugsInjected,
    receivingTreatment,
    reasonsForUse,
    reasonsForUseDetails,
    affectedTheirLife,
    affectedTheirLifeDetails,
    anythingHelpedStopOrReduce,
    whatCouldHelpNotUseInFuture,
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
