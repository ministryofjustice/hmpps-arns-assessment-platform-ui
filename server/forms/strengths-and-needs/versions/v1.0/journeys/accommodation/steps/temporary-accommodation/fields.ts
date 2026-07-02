import { validation, Self, Answer, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKCharacterCount } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'

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
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.suitable_housing_planned.validation'),
    }),
  ],
})
