import { validation, Self, Answer, and, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'
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
  visibleWhen: or(
    Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
    Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
    Answer(Question.current_accommodation).match(Condition.Equals(Option.settled)),
  ),
  dependentWhen: or(
    Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
    Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
    Answer(Question.current_accommodation).match(Condition.Equals(Option.settled)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.living_with.validation'),
    }),
  ],
})

// --- No Accommodation Reason Group ---

const noAccommodationReasonOtherDetails = GovUKCharacterCount({
  code: Question.no_accommodation_reason_other_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
    Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const noAccommodationReason = GovUKCheckboxInput({
  code: Question.no_accommodation_reason,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.no_accommodation_reason.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: {
    html: contentFor('question.no_accommodation_reason.hint'),
  },
  items: [
    { value: Option.alcohol_problems, text: contentFor('question.no_accommodation_reason.option.ALCOHOL_PROBLEMS') },
    { value: Option.drug_problems, text: contentFor('question.no_accommodation_reason.option.DRUG_PROBLEMS') },
    {
      value: Option.financial_difficulties,
      text: contentFor('question.no_accommodation_reason.option.FINANCIAL_DIFFICULTIES'),
    },
    {
      value: Option.risk_to_others,
      text: contentFor('question.no_accommodation_reason.option.RISK_TO_OTHERS'),
    },
    {
      value: Option.safety,
      text: contentFor('question.no_accommodation_reason.option.SAFETY'),
    },
    {
      value: Option.prison_release,
      text: contentFor('question.no_accommodation_reason.option.PRISON_RELEASE'),
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: noAccommodationReasonOtherDetails },
  ],
  visibleWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.no_accommodation_reason.validation'),
    }),
  ],
})

export const pastAccommodationDetails = GovUKCharacterCount({
  code: Question.past_accommodation_details,
  label: {
    text: contentFor('question.past_accommodation_details.text', CaseData.Forename),
    classes: 'govuk-label--m',
  },
  maxLength: 2000,
  visibleWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
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
    {
      value: Option.criminal_associates,
      text: contentFor('question.suitable_housing_location_concerns.option.CRIMINAL_ASSOCIATES'),
    },
    {
      value: Option.victimisation,
      text: contentFor('question.suitable_housing_location_concerns.option.VICTIMISATION'),
    },
    {
      value: Option.victim_proximity,
      text: contentFor('question.suitable_housing_location_concerns.option.VICTIM_PROXIMITY'),
    },
    {
      value: Option.neighbour_difficulty,
      text: contentFor('question.suitable_housing_location_concerns.option.NEIGHBOUR_DIFFICULTY'),
    },
    { value: Option.area_safety, text: contentFor('question.suitable_housing_location_concerns.option.AREA_SAFETY') },
    {
      value: CommonOption.other,
      text: commonContentFor('option.OTHER'),
      block: suitableHousingLocationConcernsDetails,
    },
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
  dependentWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
  visibleWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
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
    {
      value: Option.yes_with_concerns,
      text: contentFor('question.suitable_housing.option.YES_WITH_CONCERNS'),
      block: suitableHousingConcerns,
    },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: unsuitableHousingConcerns },
  ],
  visibleWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
  dependentWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.suitable_housing.validation'),
    }),
  ],
})

// --- Suitable Housing Planned Group ---

const futureAccommodationAwaitingAssessmentDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_awaiting_assessment_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(Option.awaiting_assessment)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const futureAccommodationAwaitingPlacementDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_awaiting_placement_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(Option.awaiting_placement)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const futureAccommodationOtherDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_other_details,
  label: commonContentFor('required_details'),
  hint: contentFor('question.future_accommodation_type_other_details.hint'),
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(CommonOption.other)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const futureAccommodationType = GovUKRadioInput({
  code: Question.future_accommodation_type,
  fieldset: {
    legend: {
      text: contentFor('question.future_accommodation_type.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.suitable_housing_planned).match(Condition.Equals(CommonOption.yes)),
  items: [
    {
      value: Option.awaiting_assessment,
      text: contentFor('question.future_accommodation_type.option.AWAITING_ASSESSMENT'),
      block: futureAccommodationAwaitingAssessmentDetails,
    },
    {
      value: Option.awaiting_placement,
      text: contentFor('question.future_accommodation_type.option.AWAITING_PLACEMENT'),
      block: futureAccommodationAwaitingPlacementDetails,
    },
    { value: Option.buying_house, text: contentFor('question.future_accommodation_type.option.BUYING_HOUSE') },
    {
      value: Option.living_with_friends_or_family,
      text: contentFor('question.future_accommodation_type.option.LIVING_WITH_FRIENDS_OR_FAMILY'),
    },
    { value: Option.rent_privately, text: contentFor('question.future_accommodation_type.option.RENT_PRIVATELY') },
    { value: Option.rent_social, text: contentFor('question.future_accommodation_type.option.RENT_SOCIAL') },
    {
      value: Option.residential_healthcare,
      text: contentFor('question.future_accommodation_type.option.RESIDENTIAL_HEALTHCARE'),
    },
    {
      value: Option.supported_accommodation,
      text: contentFor('question.future_accommodation_type.option.SUPPORTED_ACCOMMODATION'),
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: futureAccommodationOtherDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.future_accommodation_type.validation'),
    }),
  ],
})

export const suitableHousingPlanned = GovUKRadioInput({
  code: Question.suitable_housing_planned,
  fieldset: {
    legend: {
      text: contentFor('question.suitable_housing_planned.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: futureAccommodationType },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  visibleWhen: or(
    Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
    Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  ),
  dependentWhen: or(
    Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
    Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.suitable_housing_planned.validation'),
    }),
  ],
})

// --- Want to Make Changes Group ---

const hasMadeChangesAccommodationDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.has_made_changes)),
})

const activelyMakingChangesAccommodationDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.is_making_changes)),
})

const wantsToMakeChangesKnowsHowToAccommodationDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.wants_to_make_changes_knows_how_to)),
})

const wantsToMakeChangesNeedsHelpAccommodationDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.wants_to_make_changes_needs_help)),
})

const thinkingAboutMakingChangesAccommodationDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.thinking_about_making_changes)),
})

const doesNotWantToMakeChangesAccommodationDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.does_not_want_to_make_changes)),
})

const doesNotWantToAnswerAccommodationDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_accommodation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_changes)
    .match(Condition.Equals(CommonOption.does_not_want_to_answer)),
})

export const accommodationChanges = GovUKRadioInput({
  code: Question.accommodation_changes,
  fieldset: {
    legend: {
      text: contentFor('question.accommodation_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadeChangesAccommodationDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: activelyMakingChangesAccommodationDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowToAccommodationDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpAccommodationDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesAccommodationDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesAccommodationDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerAccommodationDetails,
    },
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
