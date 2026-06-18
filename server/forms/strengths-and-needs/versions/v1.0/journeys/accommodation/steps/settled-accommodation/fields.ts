import { validation, Self, Answer, Format, and, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonLocale } from '../../../../constants/locale'
import { locale } from '../../constants/locale'

// --- Living With Group ---

const livingWithPartnerDetails = GovUKCharacterCount({
  code: Question.living_with_partner_details,
  label: commonLocale.optional_details,
  hint: locale.hint[Question.living_with_partner_details],
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.living_with).match(Condition.IsRequired()),
    Answer(Question.living_with).match(Condition.Array.Contains(Option.partner)),
  ),
})

const livingWithOtherDetails = GovUKCharacterCount({
  code: Question.living_with_other_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.living_with).match(Condition.IsRequired()),
    Answer(Question.living_with).match(Condition.Array.Contains(Option.other)),
  ),
})

export const livingWith = GovUKCheckboxInput({
  code: Question.living_with,
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.living_with], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonLocale.select_all_that_apply,
  items: [
    { value: Option.family, text: locale.option[Option.family] },
    { value: Option.friends, text: locale.option[Option.friends] },
    { value: Option.partner, text: locale.option[Option.partner], block: livingWithPartnerDetails },
    { value: Option.person_under_18, text: locale.option[Option.person_under_18] },
    { value: Option.other, text: locale.option[Option.other], block: livingWithOtherDetails },
    { value: Option.unknown, text: locale.option[Option.unknown] },
    { divider: commonLocale.or },
    { value: Option.alone, text: locale.option[Option.alone], behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.living_with],
    }),
  ],
})

// --- Suitable Location Group ---

const suitableHousingLocationConcernsDetails = GovUKCharacterCount({
  code: Question.suitable_housing_location_concerns_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
    Answer(Question.suitable_housing_location_concerns).match(Condition.Array.Contains(Option.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

export const suitableHousingLocationConcerns = GovUKCheckboxInput({
  code: Question.suitable_housing_location_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: locale.question[Question.suitable_housing_location_concerns],
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonLocale.select_all_that_apply_optional,
  dependentWhen: Answer(Question.suitable_housing_location).match(Condition.Equals(Option.no)),
  items: [
    { value: Option.criminal_associates, text: locale.option[Option.criminal_associates] },
    { value: Option.victimisation, text: locale.option[Option.victimisation] },
    { value: Option.victim_proximity, text: locale.option[Option.victim_proximity] },
    { value: Option.neighbour_difficulty, text: locale.option[Option.neighbour_difficulty] },
    { value: Option.area_safety, text: locale.option[Option.area_safety] },
    { value: Option.other, text: locale.option[Option.other], block: suitableHousingLocationConcernsDetails },
  ],
})

export const suitableHousingLocation = GovUKRadioInput({
  code: Question.suitable_housing_location,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.suitable_housing_location], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.option[Option.yes] },
    { value: Option.no, text: locale.option[Option.no], block: suitableHousingLocationConcerns },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.suitable_housing_location],
    }),
  ],
})

// --- Suitable Accommodation Group ---

const suitableHousingConcernsOptions = [
  {
    value: Option.facilities,
    text: locale.option[Question.suitable_housing_concerns + Option.facilities],
  },
  { value: Option.overcrowding, text: locale.option[Question.suitable_housing_concerns + Option.overcrowding] },
  {
    value: Option.exploitation,
    text: locale.option[Question.suitable_housing_concerns + Option.exploitation],
  },
  { value: Option.safety, text: locale.option[Question.suitable_housing_concerns + Option.safety] },
  {
    value: Option.lives_with_victim,
    text: locale.option[Question.suitable_housing_concerns + Option.lives_with_victim],
  },
  { value: Option.victimisation, text: locale.option[Question.suitable_housing_concerns + Option.victimisation] },
]

const suitableHousingConcernsDetails = GovUKCharacterCount({
  code: Question.suitable_housing_concerns_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.suitable_housing_concerns).match(Condition.IsRequired()),
    Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

export const suitableHousingConcerns = GovUKCheckboxInput({
  code: Question.suitable_housing_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: locale.question[Question.suitable_housing_concerns],
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonLocale.select_all_that_apply_optional,
  dependentWhen: Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
  items: [
    ...suitableHousingConcernsOptions,
    { value: Option.other, text: locale.option[Option.other], block: suitableHousingConcernsDetails },
  ],
})

const unsuitableHousingConcernsDetails = GovUKCharacterCount({
  code: Question.unsuitable_housing_concerns_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.unsuitable_housing_concerns).match(Condition.IsRequired()),
    Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

export const unsuitableHousingConcerns = GovUKCheckboxInput({
  code: Question.unsuitable_housing_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: locale.question[Question.unsuitable_housing_concerns],
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonLocale.select_all_that_apply_optional,
  dependentWhen: Answer(Question.suitable_housing).match(Condition.Equals(Option.no)),
  items: [
    ...suitableHousingConcernsOptions,
    { value: Option.other, text: locale.option[Option.other], block: unsuitableHousingConcernsDetails },
  ],
})

export const suitableHousing = GovUKRadioInput({
  code: Question.suitable_housing,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.suitable_housing], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.suitable_housing],
  items: [
    { value: Option.yes, text: locale.option[Option.yes] },
    { value: Option.yes_with_concerns, text: locale.option[Option.yes_with_concerns], block: suitableHousingConcerns },
    { value: Option.no, text: locale.option[Option.no], block: unsuitableHousingConcerns },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.suitable_housing],
    }),
  ],
})

// --- Want to Make Changes Group ---

export const accommodationChanges = GovUKRadioInput({
  code: Question.accommodation_changes,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.accommodation_changes], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.made_changes, text: locale.option[Option.made_changes] },
    { value: Option.making_changes, text: locale.option[Option.making_changes] },
    { value: Option.want_to_make_changes, text: locale.option[Option.want_to_make_changes] },
    { value: Option.needs_help_to_make_changes, text: locale.option[Option.needs_help_to_make_changes] },
    { value: Option.thinking_about_making_changes, text: locale.option[Option.thinking_about_making_changes] },
    { value: Option.does_not_want_to_make_changes, text: locale.option[Option.does_not_want_to_make_changes] },
    { value: Option.does_not_want_to_answer, text: locale.option[Option.does_not_want_to_answer] },
    { divider: commonLocale.or },
    { value: Option.not_present, text: Format(locale.option[Option.not_present], CaseData.Forename) },
    { value: Option.not_applicable, text: locale.option[Option.not_applicable] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.accommodation_changes],
    }),
  ],
})
