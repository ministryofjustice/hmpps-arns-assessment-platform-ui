import {
  and,
  Answer,
  ChainableExpr,
  Condition, Data,
  Format,
  Item,
  Iterator,
  not,
  PipelineExpr,
  Self,
  Transformer,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKInsetText,
  GovUKRadioInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CollectionBlock, TemplateWrapper} from '@ministryofjustice/hmpps-forge/core/components'

import {CaseData} from '../../../../constants/formVersion'
import {SANGenerators} from '../../../../../../generators'
import {drugLastUsedField, selectMisusedDrugs} from '../add-drugs/fields'
import {contentFor} from "../../locales";
import {Option} from "../../constants/option";
import {commonContentFor} from "../../../../locales";
import {Question} from "../../constants/question";
import {CommonOption} from "../../../../constants/commonOption";
import {fieldCode, fieldCodeString} from "../../constants";

// --- Conditions ---

const anyDrugUsedInLastSix = Data('drugsUsedInLastSix').match(Condition.IsRequired())
export const anyDrugUsedMoreThanSix = Data('drugsUsedMoreThanSix').match(Condition.IsRequired())

// --- Used in the last 6 months ---

const drugValueLower = Item().path('value').pipe(Transformer.String.ToLowerCase())

export const drugIntakeFrequency = (drugValue: ChainableExpr<PipelineExpr>) =>  GovUKRadioInput({
  code: contentFor('question.how_often_used.code', drugValue),
  classes: 'govuk-radios--inline',
  fieldset: {
    legend: {
      text: contentFor('question.how_often_used.text', CaseData.Forename),
    },
  },
  items: [
    { value: Option.daily, text: contentFor('question.how_often_used.option.DAILY') },
    { value: Option.weekly, text: contentFor('question.how_often_used.option.WEEKLY') },
    { value: Option.monthly, text: contentFor('question.how_often_used.option.MONTHLY') },
    { value: Option.occasionally, text: contentFor('question.how_often_used.option.OCCASIONALLY') },
  ],
  dependentWhen: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.how_often_used.validation'),
    }),
  ],
})

export const drugIntakeFrequencyDetails = (drugValue: ChainableExpr<PipelineExpr>) =>  GovUKCharacterCount({
  code: Format(Question.how_often_used_details, drugValue),
  label: commonContentFor('optional_details'),
  maxLength: 2000,
})

export const usedInLastSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">Used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKDetails({
        summaryText: contentFor('question.how_often_used.summaryText'),
        html: contentFor('question.how_often_used.summaryHtml')
      }),
      CollectionBlock({
        collection: Data('drugsUsedInLastSix').each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: {
                heading: when(
                  Item().path('value').pipe(Transformer.String.EscapeHtml()).match(Condition.Equals(CommonOption.other)))
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                  .else(SANGenerators.getTextFromListDefinition(
                  selectMisusedDrugs.items,
                  Item().path('value').pipe(Transformer.String.EscapeHtml()),
                ),
              )},
              slots: {
                fields: [
                  drugIntakeFrequency(drugValueLower),
                  drugIntakeFrequencyDetails(drugValueLower),
                ],
              },
            }),
          ),
        ),
      }),
    ],
  },
  visibleWhen: anyDrugUsedInLastSix,
})

// --- Section divider ---

export const sectionDivider = TemplateWrapper({
  template: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
  visibleWhen: and(anyDrugUsedInLastSix, anyDrugUsedMoreThanSix),
})

// --- Not used in the last 6 months ---

export const usedMoreThanSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">Not used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKInsetText({
        text: Format(
          '%1 used %2 more than 6 months ago.',
          CaseData.Forename,
          Data('drugsUsedMoreThanSix')
            .each(
              Iterator.Map(
                when(
                  Item().path('value').pipe(Transformer.String.EscapeHtml()).match(Condition.Equals(CommonOption.other)))
                  .then(Answer(Question.other_drug_name).pipe(Transformer.String.EscapeHtml()))
                .else(
                SANGenerators.getTextFromListDefinition(
                  selectMisusedDrugs.items,
                  Item().path('value').pipe(Transformer.String.EscapeHtml())
                ).pipe(Transformer.String.ToLowerCase()),)
              ),
            )
            .pipe(Transformer.Array.Join(', ')),
        ),
      }),
      GovUKCharacterCount({
        code: Question.drug_use_more_than_six_months_details,
        label: {
          text: contentFor('question.drug_use_more_than_six_months_details.text', CaseData.ForenamePossessive),
          classes: 'govuk-label--m',
        },
        hint: contentFor('question.drug_use_more_than_six_months_details.hint'),
        maxLength: 2000,
        dependentWhen: anyDrugUsedMoreThanSix,
        validWhen: [
          validation({
            condition: not(Self().not.match(Condition.IsRequired())),
            message: contentFor('question.drug_use_more_than_six_months_details.validation'),
          }),
        ],
      }),
    ],
  },
  visibleWhen: anyDrugUsedMoreThanSix,
})

// --- Injected drugs ---

const anyInjectableSelectedDrugs = Data('injectableSelectedDrugs').match(Condition.IsRequired())


export const drugInjectedLastString = (drugValue: string) => GovUKCheckboxInput({
  code: fieldCodeString(Question.drugs_injected, drugValue),
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.drugs_injected_months.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_one_or_both'),
  items:[
    { value: Option.last_six, text: contentFor('option.IN_THE_LAST_SIX') },
    { value: Option.more_than_six, text: contentFor('option.MORE_THAN_SIX') },
  ],
  dependentWhen: and(
    Answer(Question.drugs_injected).match(Condition.IsRequired()),
    Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
    Answer(drugLastUsedField(drugValue.toLowerCase()))
      .match(Condition.Equals(Option.last_six))
  ),
  visibleWhen:
    Answer(drugLastUsedField(drugValue.toLowerCase()))
      .match(Condition.Equals(Option.last_six)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.drug_last_used.validation'),
    }),
  ],
})

export const drugInjectedLast = (drugValue: ChainableExpr<PipelineExpr>) => GovUKCheckboxInput({
  code: fieldCode(Question.drugs_injected, drugValue),
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.drugs_injected_months.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_one_or_both'),
  items:[
    { value: Option.last_six, text: contentFor('option.LAST_SIX') },
    { value: Option.more_than_six, text: contentFor('option.MORE_THAN_SIX') },
  ],
  dependentWhen: and(
    Answer(Question.drugs_injected).match(Condition.IsRequired()),
    Answer(Question.drugs_injected).match(Condition.Array.Contains(drugValue)),
    Answer(drugLastUsedField(drugValue.pipe(Transformer.String.ToLowerCase())))
      .match(Condition.Equals(Option.last_six))
  ),
  visibleWhen:
    Answer(drugLastUsedField(drugValue))
      .match(Condition.Equals(Option.last_six)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.drug_last_used.validation'),
    }),
  ],
})

export const injectedDrugsField = GovUKCheckboxInput({
  code: Question.drugs_injected,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.drugs_injected.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {value: CommonOption.none, text: commonContentFor('option.NONE'), behaviour: 'exclusive'},
    {divider: 'or'},
    {value: Option.amphetamines,
      text: contentFor('option.AMPHETAMINES'),
      block: drugInjectedLastString(Option.amphetamines),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.amphetamines))},
    {value: Option.benzodiazepines, text: contentFor('option.BENZODIAZEPINES'),
      block: drugInjectedLastString(Option.benzodiazepines),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.benzodiazepines))},
    {value: Option.cocaine, text: contentFor('option.COCAINE'),
      block: drugInjectedLastString(Option.cocaine),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.cocaine))},
    {value: Option.crack, text: contentFor('option.CRACK'),
      block: drugInjectedLastString(Option.crack),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.crack))},
    {value: Option.heroin, text: contentFor('option.HEROIN'),
      block: drugInjectedLastString(Option.heroin),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.heroin))},
    {value: Option.methadone_not_prescribed, text: contentFor('option.METHADONE_NOT_PRESCRIBED'),
      block: drugInjectedLastString(Option.methadone_not_prescribed),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.methadone_not_prescribed))},
    {value: Option.misused_prescribed_drugs, text: contentFor('option.MISUSED_PRESCRIBED_DRUGS'),
      block: drugInjectedLastString(Option.misused_prescribed_drugs),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.misused_prescribed_drugs))},
    {value: Option.other_opiates, text: contentFor('option.OTHER_OPIATES'),
      block: drugInjectedLastString(Option.other_opiates),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.other_opiates))},
    {value: Option.steroids, text: contentFor('option.STEROIDS'),
      block: drugInjectedLastString(Option.steroids),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(Option.steroids))},
    {value: CommonOption.other, text: Answer(Question.other_drug_name),
      block: drugInjectedLastString(Option.amphetamines),
      visibleWhen: Answer(Question.select_misused_drugs)
        .match(Condition.Array.Contains(CommonOption.other))},
  ],
  dependentWhen: anyInjectableSelectedDrugs,
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drugs_injected.validation', CaseData.Forename),
    }),
  ],
})

// --- Receiving treatment ---

const receivingTreatmentDetails = GovUKCharacterCount({
    code: Question.receiving_treatment_yes_details,
    label: commonContentFor('required_details'),
    maxLength: 2000,
    validWhen: [
      validation({
        condition: not(Self().not.match(Condition.IsRequired())),
        message: contentFor('question.receiving_treatment_yes_details.validation'),
      }),
    ],
    dependentWhen: Answer(Question.receiving_treatment).match(Condition.Equals(CommonOption.yes)),
})

const receivingTreatmentNoDetails = GovUKCharacterCount({
  code: Question.receiving_treatment_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
})

export const receivingTreatmentField = GovUKRadioInput({
  code: Question.receiving_treatment,
  fieldset: {
    legend: {
      text: contentFor('question.receiving_treatment.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: receivingTreatmentDetails
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: receivingTreatmentNoDetails,
    },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.receiving_treatment.validation'),
    }),
  ],
})

