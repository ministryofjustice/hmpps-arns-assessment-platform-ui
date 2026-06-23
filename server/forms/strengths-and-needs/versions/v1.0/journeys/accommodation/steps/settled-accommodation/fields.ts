import { validation, Self, Answer, and, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'

// --- Living With Group ---

const livingWithPartnerDetails = GovUKCharacterCount({
  code: Question.living_with_partner_details,
  label: commonContentFor('optional_details'),
  hint: contentFor('question.living_with_partner_details.hint'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.living_with).match(Condition.IsRequired()),
    Answer(Question.living_with).match(Condition.Array.Contains(Option.partner)),
  ),
})

const livingWithOtherDetails = GovUKCharacterCount({
  code: Question.living_with_other_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.living_with).match(Condition.IsRequired()),
    Answer(Question.living_with).match(Condition.Array.Contains(CommonOption.other)),
  ),
})

export const livingWith = GovUKCheckboxInput({
  code: Question.living_with,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.living_with.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    { value: Option.family, text: contentFor('question.living_with.option.FAMILY') },
    { value: Option.friends, text: contentFor('question.living_with.option.FRIENDS') },
    { value: Option.partner, text: contentFor('question.living_with.option.PARTNER'), block: livingWithPartnerDetails },
    { value: Option.person_under_18, text: contentFor('question.living_with.option.PERSON_UNDER_18') },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: livingWithOtherDetails },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    { divider: commonContentFor('or') },
    { value: Option.alone, text: contentFor('question.living_with.option.ALONE'), behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.living_with.validation'),
    }),
  ],
})

// --- Suitable Location Group ---

const suitableHousingLocationConcernsDetails = GovUKCharacterCount({
  code: Question.suitable_housing_location_concerns_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
    Answer(Question.suitable_housing_location_concerns).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const suitableHousingLocationConcerns = GovUKCheckboxInput({
  code: Question.suitable_housing_location_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.suitable_housing_location_concerns.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonContentFor('select_all_that_apply_optional'),
  dependentWhen: Answer(Question.suitable_housing_location).match(Condition.Equals(CommonOption.no)),
  items: [
    { value: Option.criminal_associates, text: contentFor('question.suitable_housing_location_concerns.option.CRIMINAL_ASSOCIATES') },
    { value: Option.victimisation, text: contentFor('question.suitable_housing_location_concerns.option.VICTIMISATION') },
    { value: Option.victim_proximity, text: contentFor('question.suitable_housing_location_concerns.option.VICTIM_PROXIMITY') },
    { value: Option.neighbour_difficulty, text: contentFor('question.suitable_housing_location_concerns.option.NEIGHBOUR_DIFFICULTY') },
    { value: Option.area_safety, text: contentFor('question.suitable_housing_location_concerns.option.AREA_SAFETY') },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: suitableHousingLocationConcernsDetails },
  ],
})

export const suitableHousingLocation = GovUKRadioInput({
  code: Question.suitable_housing_location,
  fieldset: {
    legend: {
      text: contentFor('question.suitable_housing_location.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES') },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: suitableHousingLocationConcerns },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.suitable_housing_location.validation'),
    }),
  ],
})

// --- Suitable Accommodation Group ---

const suitableHousingConcernsOptions = [
  {
    value: Option.facilities,
    text: contentFor('question.suitable_housing_concerns.option.FACILITIES'),
  },
  { value: Option.overcrowding, text: contentFor('question.suitable_housing_concerns.option.OVERCROWDING') },
  {
    value: Option.exploitation,
    text: contentFor('question.suitable_housing_concerns.option.EXPLOITATION'),
  },
  { value: Option.safety, text: contentFor('question.suitable_housing_concerns.option.SAFETY') },
  {
    value: Option.lives_with_victim,
    text: contentFor('question.suitable_housing_concerns.option.LIVES_WITH_VICTIM'),
  },
  { value: Option.victimisation, text: contentFor('question.suitable_housing_concerns.option.VICTIMISATION') },
]

const suitableHousingConcernsDetails = GovUKCharacterCount({
  code: Question.suitable_housing_concerns_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.suitable_housing_concerns).match(Condition.IsRequired()),
    Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const suitableHousingConcerns = GovUKCheckboxInput({
  code: Question.suitable_housing_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.suitable_housing_concerns.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonContentFor('select_all_that_apply_optional'),
  dependentWhen: Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
  items: [
    ...suitableHousingConcernsOptions,
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: suitableHousingConcernsDetails },
  ],
})

const unsuitableHousingConcernsDetails = GovUKCharacterCount({
  code: Question.unsuitable_housing_concerns_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.unsuitable_housing_concerns).match(Condition.IsRequired()),
    Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const unsuitableHousingConcerns = GovUKCheckboxInput({
  code: Question.unsuitable_housing_concerns,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.unsuitable_housing_concerns.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  hint: commonContentFor('select_all_that_apply_optional'),
  dependentWhen: Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
  items: [
    ...suitableHousingConcernsOptions,
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: unsuitableHousingConcernsDetails },
  ],
})

export const suitableHousing = GovUKRadioInput({
  code: Question.suitable_housing,
  fieldset: {
    legend: {
      text: contentFor('question.suitable_housing.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.suitable_housing.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES') },
    { value: Option.yes_with_concerns, text: contentFor('question.suitable_housing.option.YES_WITH_CONCERNS'), block: suitableHousingConcerns },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: unsuitableHousingConcerns },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.suitable_housing.validation'),
    }),
  ],
})

// --- Want to Make Changes Group ---

export const accommodationChanges = GovUKRadioInput({
  code: Question.accommodation_changes,
  fieldset: {
    legend: {
      text: contentFor('question.accommodation_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.has_made_changes, text: commonContentFor('option.HAS_MADE_CHANGES') },
    { value: CommonOption.is_making_changes, text: commonContentFor('option.IS_MAKING_CHANGES') },
    { value: CommonOption.wants_to_make_changes_knows_how_to, text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO') },
    { value: CommonOption.wants_to_make_changes_needs_help, text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP') },
    { value: CommonOption.thinking_about_making_changes, text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES') },
    { value: CommonOption.does_not_want_to_make_changes, text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES') },
    { value: CommonOption.does_not_want_to_answer, text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER') },
    { divider: commonContentFor('or') },
    { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_changes.validation'),
    }),
  ],
})
