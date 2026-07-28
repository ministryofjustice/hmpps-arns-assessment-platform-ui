import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKSelectInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { CaseData } from '../../../../constants/formVersion'
import { CommonOption } from '../../../../constants/commonOption'

// --- Victim Relationship ---

export const victimType = GovUKRadioInput({
  code: Question.offence_analysis_victim_type,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_victim_type.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.stranger, text: contentFor('question.offence_analysis_victim_type.option.STRANGER') },
    {
      value: Option.criminal_justice_staff,
      text: contentFor('question.offence_analysis_victim_type.option.CRIMINAL_JUSTICE_STAFF'),
    },
    {
      value: Option.parent_or_step_parent,
      text: contentFor(
        'question.offence_analysis_victim_type.option.PARENT_OR_STEP_PARENT',
        CaseData.ForenamePossessive,
      ),
    },
    {
      value: Option.partner,
      text: contentFor('question.offence_analysis_victim_type.option.PARTNER', CaseData.ForenamePossessive),
    },
    {
      value: Option.ex_partner,
      text: contentFor('question.offence_analysis_victim_type.option.EX_PARTNER', CaseData.ForenamePossessive),
    },
    {
      value: Option.child_or_step_child,
      text: contentFor('question.offence_analysis_victim_type.option.CHILD_OR_STEP_CHILD', CaseData.ForenamePossessive),
    },
    {
      value: Option.other_family_member,
      text: contentFor('question.offence_analysis_victim_type.option.OTHER_FAMILY_MEMBER'),
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_victim_type.validation'),
    }),
  ],
})

// --- Victim Age ---

export const victimAge = GovUKRadioInput({
  code: Question.offence_analysis_victim_age,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_victim_age.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.age_0_to_4, text: contentFor('question.offence_analysis_victim_age.option.AGE_0_TO_4') },
    { value: Option.age_5_to_11, text: contentFor('question.offence_analysis_victim_age.option.AGE_5_TO_11') },
    { value: Option.age_12_to_15, text: contentFor('question.offence_analysis_victim_age.option.AGE_12_TO_15') },
    { value: Option.age_16_to_17, text: contentFor('question.offence_analysis_victim_age.option.AGE_16_TO_17') },
    { value: Option.age_18_to_20, text: contentFor('question.offence_analysis_victim_age.option.AGE_18_TO_20') },
    { value: Option.age_21_to_25, text: contentFor('question.offence_analysis_victim_age.option.AGE_21_TO_25') },
    { value: Option.age_26_to_49, text: contentFor('question.offence_analysis_victim_age.option.AGE_26_TO_49') },
    { value: Option.age_50_to_64, text: contentFor('question.offence_analysis_victim_age.option.AGE_50_TO_64') },
    { value: Option.age_65_and_over, text: contentFor('question.offence_analysis_victim_age.option.AGE_65_AND_OVER') },
    { value: Option.age_unknown, text: contentFor('question.offence_analysis_victim_age.option.AGE_UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_victim_age.validation'),
    }),
  ],
})

// --- Victim Sex ---

export const victimSex = GovUKRadioInput({
  code: Question.offence_analysis_victim_sex,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_victim_sex.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.male, text: contentFor('question.offence_analysis_victim_sex.option.MALE') },
    { value: Option.female, text: contentFor('question.offence_analysis_victim_sex.option.FEMALE') },
    { value: Option.intersex, text: contentFor('question.offence_analysis_victim_sex.option.INTERSEX') },
    { value: Option.sex_unknown, text: contentFor('question.offence_analysis_victim_sex.option.SEX_UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_victim_sex.validation'),
    }),
  ],
})

// --- Victim Ethnicity ---

export const victimEthnicity = GovUKSelectInput({
  code: Question.offence_analysis_victim_ethnicity,
  label: {
    text: contentFor('question.offence_analysis_victim_ethnicity.text'),
    classes: 'govuk-label--m',
  },
  items: [
    {
      value: '',
      text: contentFor('question.offence_analysis_victim_ethnicity.option_label'),
      disabled: true,
      selected: true,
    },
    { text: 'Select the victim’s ethnicity', value: '' },
    {
      text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH'),
      value: Option.white_english_welsh_scottish_northern_irish_or_british,
    },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_IRISH'), value: Option.white_irish },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_GYPSY_OR_IRISH_TRAVELLER'), value: Option.white_gypsy_or_irish_traveller },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_ROMA'), value: Option.white_roma },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_ANY_OTHER_WHITE_BACKGROUND'), value: Option.white_any_other_white_background },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_BLACK_CARIBBEAN'), value: Option.mixed_white_and_black_caribbean },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_BLACK_AFRICAN'), value: Option.mixed_white_and_black_african },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_ASIAN'), value: Option.mixed_white_and_asian },
    {
      text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND'),
      value: Option.mixed_any_other_mixed_or_multiple_ethnic_background_background,
    },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_INDIAN'), value: Option.asian_or_asian_british_indian },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_PAKISTANI'), value: Option.asian_or_asian_british_pakistani },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_BANGLADESHI'), value: Option.asian_or_asian_british_bangladeshi },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_CHINESE'), value: Option.asian_or_asian_british_chinese },
    {
      text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND'),
      value: Option.asian_or_asian_british_any_other_asian_background,
    },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_CARIBBEAN'), value: Option.black_or_black_british_caribbean },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_AFRICAN'), value: Option.black_or_black_british_african },
    {
      text: contentFor('question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND'),
      value: Option.black_or_black_british_any_other_black_background,
    },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ARAB'), value: Option.arab },
    { text: contentFor('question.offence_analysis_victim_ethnicity.option.ANY_OTHER_ETHNIC_GROUP'), value: Option.any_other_ethnic_group },
    { text: commonContentFor('option.UNKNOWN'), value: CommonOption.unknown },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_victim_ethnicity.validation'),
    }),
  ],
})
