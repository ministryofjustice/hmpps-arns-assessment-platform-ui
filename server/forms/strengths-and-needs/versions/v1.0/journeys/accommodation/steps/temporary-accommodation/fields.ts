import { validation, Self, Answer, Format, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKCharacterCount } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { commonLocale } from '../../../../constants/locale'
import { Option } from '../../constants/option'
import { locale } from '../../constants/locale'

// --- Suitable Housing Planned Group ---

const futureAccommodationAwaitingAssessmentDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_awaiting_assessment_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(Option.awaiting_assessment)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

const futureAccommodationAwaitingPlacementDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_awaiting_placement_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(Option.awaiting_placement)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

const futureAccommodationOtherDetails = GovUKCharacterCount({
  code: Question.future_accommodation_type_other_details,
  label: commonLocale.required_details,
  hint: locale.hint[Question.future_accommodation_type_other_details],
  maxLength: 2000,
  dependentWhen: Answer(Question.future_accommodation_type).match(Condition.Equals(Option.other)),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

export const futureAccommodationType = GovUKRadioInput({
  code: Question.future_accommodation_type,
  fieldset: {
    legend: {
      text: locale.question[Question.future_accommodation_type],
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.suitable_housing_planned).match(Condition.Equals(Option.yes)),
  items: [
    {
      value: Option.awaiting_assessment,
      text: locale.option[Question.future_accommodation_type + Option.awaiting_assessment],
      block: futureAccommodationAwaitingAssessmentDetails,
    },
    {
      value: Option.awaiting_placement,
      text: locale.option[Question.future_accommodation_type + Option.awaiting_placement],
      block: futureAccommodationAwaitingPlacementDetails,
    },
    { value: Option.buying_house, text: locale.option[Question.future_accommodation_type + Option.buying_house] },
    { value: Option.living_with_friends_or_family, text: locale.option[Question.future_accommodation_type + Option.living_with_friends_or_family] },
    { value: Option.rent_privately, text: locale.option[Question.future_accommodation_type + Option.rent_privately] },
    { value: Option.rent_social, text: locale.option[Question.future_accommodation_type + Option.rent_social] },
    { value: Option.residential_healthcare, text: locale.option[Question.future_accommodation_type + Option.residential_healthcare] },
    { value: Option.supported_accommodation, text: locale.option[Question.future_accommodation_type + Option.supported_accommodation] },
    { value: Option.other, text: locale.option[Option.other], block: futureAccommodationOtherDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.future_accommodation_type],
    }),
  ],
})

export const suitableHousingPlanned = GovUKRadioInput({
  code: Question.suitable_housing_planned,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.suitable_housing_planned], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.option[Option.yes], block: futureAccommodationType },
    { value: Option.no, text: locale.option[Option.no] },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.suitable_housing_planned],
    }),
  ],
})
