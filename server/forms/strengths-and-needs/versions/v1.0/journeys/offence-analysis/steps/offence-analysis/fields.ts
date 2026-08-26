import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'

// --- Index Offence Description ---

export const indexOffenceDescription = GovUKCharacterCount({
  code: Question.offence_analysis_description_of_offence,
  label: {
    text: contentFor('question.offence_analysis_description_of_offence.text'),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 4000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

// --- Offence Elements ---

const victimTargetedDetails = GovUKCharacterCount({
  code: Question.offence_victim_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_elements).match(Condition.Array.Contains(Option.victim_targeted)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const weaponDetails = GovUKTextInput({
  code: Question.offence_weapon_details,
  label: {
    text: contentFor('question.offence_weapon_details.text'),
  },
  dependentWhen: Answer(Question.offence_analysis_elements).match(Condition.Array.Contains(Option.weapon)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: contentFor('question.offence_weapon_details.validation'),
    }),
  ],
})

export const offenceElements = GovUKCheckboxInput({
  code: Question.offence_analysis_elements,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_elements.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.offence_analysis_elements.hint'),
  items: [
    { value: Option.arson, text: contentFor('question.offence_analysis_elements.option.ARSON') },
    {
      value: Option.domestic_abuse,
      text: contentFor('question.offence_analysis_elements.option.DOMESTIC_ABUSE'),
    },
    {
      value: Option.excessive_violence_sadistic,
      text: contentFor('question.offence_analysis_elements.option.EXCESSIVE_VIOLENCE_SADISTIC'),
    },
    {
      value: Option.hatred_identifiable_groups,
      text: contentFor('question.offence_analysis_elements.option.HATRED_IDENTIFIABLE_GROUPS'),
    },
    {
      value: Option.physical_damage_property,
      text: contentFor('question.offence_analysis_elements.option.PHYSICAL_DAMAGE_PROPERTY'),
    },
    {
      value: Option.sexual_element,
      text: contentFor('question.offence_analysis_elements.option.SEXUAL_ELEMENT'),
    },
    {
      value: Option.victim_targeted,
      text: contentFor('question.offence_analysis_elements.option.VICTIM_TARGETED'),
      block: victimTargetedDetails,
    },
    {
      value: Option.violence_threat_coercion,
      text: contentFor('question.offence_analysis_elements.option.VIOLENCE_THREAT_COERCION'),
    },
    {
      value: Option.weapon,
      text: contentFor('question.offence_analysis_elements.option.WEAPON'),
      block: weaponDetails,
    },
    { divider: 'or' },
    {
      value: Option.none,
      text: contentFor('option.NONE'),
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_elements.validation'),
    }),
  ],
})

// --- Why Offence Happened ---

export const whyOffenceHappened = GovUKCharacterCount({
  code: Question.offence_analysis_why_offence_happened,
  label: {
    text: contentFor('question.offence_analysis_why_offence_happened.text'),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 4000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

// --- Motivations ---

const motivationsOtherDetails = GovUKCharacterCount({
  code: Question.offence_analysis_motivations_other_details,
  label: commonContentFor('required_details'),
  maxLength: 200,
  dependentWhen: Answer(Question.offence_analysis_motivations).match(Condition.Array.Contains(CommonOption.other)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(200)),
      message: commonContentFor('validation.details_must_be_less_than', 200),
    }),
  ],
})

export const motivations = GovUKCheckboxInput({
  code: Question.offence_analysis_motivations,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_motivations.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.offence_analysis_motivations.hint'),
  items: [
    {
      value: Option.addictions_perceived_needs,
      text: contentFor('question.offence_analysis_motivations.option.ADDICTIONS_PERCEIVED_NEEDS'),
    },
    {
      value: Option.pressurised_led_by_others,
      text: contentFor('question.offence_analysis_motivations.option.PRESSURISED_LED_BY_OTHERS'),
    },
    {
      value: Option.emotional_state_christy,
      text: contentFor('question.offence_analysis_motivations.option.EMOTIONAL_STATE_CHRISTY'),
    },
    {
      value: Option.financial_motivation,
      text: contentFor('question.offence_analysis_motivations.option.FINANCIAL_MOTIVATION'),
    },
    {
      value: Option.hatred_identifiable_groups,
      text: contentFor('question.offence_analysis_motivations.option.HATRED_IDENTIFIABLE_GROUPS'),
    },
    {
      value: Option.seeking_exerting_power,
      text: contentFor('question.offence_analysis_motivations.option.SEEKING_EXERTING_POWER'),
    },
    {
      value: Option.sexual_motivation,
      text: contentFor('question.offence_analysis_motivations.option.SEXUAL_MOTIVATION'),
    },
    { value: Option.thrill_seeking, text: contentFor('question.offence_analysis_motivations.option.THRILL_SEEKING') },
    {
      value: CommonOption.other,
      text: commonContentFor('option.OTHER'),
      block: motivationsOtherDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_motivations.validation'),
    }),
  ],
})

const offenceCommitedAgainstOtherDetails = GovUKCharacterCount({
  code: Question.offence_analysis_commited_against_other_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_commited_against).match(Condition.Array.Contains(CommonOption.other)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(200)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const offenceCommitedAgainst = GovUKCheckboxInput({
  code: Question.offence_analysis_commited_against,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_commited_against.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.one_or_more_people,
      text: contentFor('question.offence_analysis_commited_against.option.ONE_OR_MORE_PEOPLE'),
    },
    {
      value: CommonOption.other,
      text: commonContentFor('option.OTHER'),
      hint: contentFor('question.offence_analysis_commited_against.option.OTHER.hint'),
      block: offenceCommitedAgainstOtherDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_commited_against.validation'),
    }),
  ],
})
