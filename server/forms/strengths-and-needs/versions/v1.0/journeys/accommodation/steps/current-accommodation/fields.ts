import {
  validation,
  Self,
  Answer,
  and,
  or,
  Condition,
  not,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKDateInputFull } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { StrengthsAndNeedsTransformers } from '../../../../../../transformers'

const hasAnyDatePart = () => {
  return and(
    Self().match(Condition.Object.IsObject()),
    or(
      Self().match(Condition.Object.PropertyHasValue('day')),
      Self().match(Condition.Object.PropertyHasValue('month')),
      Self().match(Condition.Object.PropertyHasValue('year')),
    ),
  )
}

const hasAllDateParts = () => {
  return and(
    Self().match(Condition.Object.IsObject()),
    Self().match(Condition.Object.PropertyHasValue('day')),
    Self().match(Condition.Object.PropertyHasValue('month')),
    Self().match(Condition.Object.PropertyHasValue('year')),
  )
}

const optionalFutureDateValidations = () => {
  return [
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('day')))),
      message: commonContentFor('validation.valid_date_day'),
      details: { field: 'day' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('month')))),
      message: commonContentFor('validation.valid_date_month'),
      details: { field: 'month' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('year')))),
      message: commonContentFor('validation.valid_date_year'),
      details: { field: 'year' },
    }),
    validation({
      condition: not(hasAllDateParts()),
      message: commonContentFor('validation.valid_date'),
    }),
    validation({
      condition: not(
        and(
          Self().match(Condition.IsRequired()),
          Self().not.match(Condition.Object.IsObject()),
          Self().not.match(Condition.Date.IsValid()),
        ),
      ),
      message: commonContentFor('validation.valid_date'),
    }),
    validation({
      condition: not(
        and(
          Self().match(Condition.IsRequired()),
          Self().not.match(Condition.Object.IsObject()),
          Self().match(Condition.Date.IsValid()),
          Self().not.match(Condition.Date.IsFutureDate()),
        ),
      ),
      message: commonContentFor('validation.future_date'),
    }),
  ]
}

const shortTermEndDate = GovUKDateInputFull({
  code: Question.short_term_accommodation_end_date,
  fieldset: {
    legend: { text: contentFor('question.short_term_accommodation_end_date.text') },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
  formatters: [StrengthsAndNeedsTransformers.ToISO()],
  validWhen: optionalFutureDateValidations(),
})

const approvedPremisesEndDate = GovUKDateInputFull({
  code: Question.approved_premises_end_date,
  fieldset: {
    legend: { text: contentFor('question.approved_premises_end_date.text') },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.approved_premises)),
  formatters: [StrengthsAndNeedsTransformers.ToISO()],
  validWhen: optionalFutureDateValidations(),
})

const cas2EndDate = GovUKDateInputFull({
  code: Question.cas2_end_date,
  fieldset: {
    legend: { text: contentFor('question.cas2_end_date.text') },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas2)),
  formatters: [StrengthsAndNeedsTransformers.ToISO()],
  validWhen: optionalFutureDateValidations(),
})

const cas3EndDate = GovUKDateInputFull({
  code: Question.cas3_end_date,
  fieldset: {
    legend: { text: contentFor('question.cas3_end_date.text') },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas3)),
  formatters: [StrengthsAndNeedsTransformers.ToISO()],
  validWhen: optionalFutureDateValidations(),
})

const immigrationEndDate = GovUKDateInputFull({
  code: Question.immigration_accommodation_end_date,
  fieldset: {
    legend: { text: contentFor('question.immigration_accommodation_end_date.text') },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
  formatters: [StrengthsAndNeedsTransformers.ToISO()],
  validWhen: optionalFutureDateValidations(),
})

export const typeOfSettledAccommodation = GovUKRadioInput({
  code: Question.type_of_settled_accommodation,
  fieldset: {
    legend: {
      text: contentFor('question.type_of_settled_accommodation.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.settled)),
  items: [
    { value: Option.homeowner, text: contentFor('question.type_of_settled_accommodation.option.HOMEOWNER') },
    {
      value: Option.friends_or_family,
      text: contentFor('question.type_of_settled_accommodation.option.FRIENDS_OR_FAMILY'),
    },
    {
      value: Option.renting_privately,
      text: contentFor('question.type_of_settled_accommodation.option.RENTING_PRIVATELY'),
    },
    { value: Option.renting_other, text: contentFor('question.type_of_settled_accommodation.option.RENTING_OTHER') },
    {
      value: Option.residential_healthcare,
      text: contentFor('question.type_of_settled_accommodation.option.RESIDENTIAL_HEALTHCARE'),
    },
    {
      value: Option.supported_accommodation,
      text: contentFor('question.type_of_settled_accommodation.option.SUPPORTED_ACCOMMODATION'),
    },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.type_of_settled_accommodation.validation'),
    }),
  ],
})

export const typeOfTemporaryAccommodation = GovUKRadioInput({
  code: Question.type_of_temporary_accommodation,
  fieldset: {
    legend: {
      text: contentFor('question.type_of_temporary_accommodation.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
  items: [
    {
      value: Option.approved_premises,
      text: contentFor('question.type_of_temporary_accommodation.option.APPROVED_PREMISES'),
      block: approvedPremisesEndDate,
    },
    {
      value: Option.cas2,
      text: contentFor('question.type_of_temporary_accommodation.option.CAS2'),
      block: cas2EndDate,
    },
    {
      value: Option.cas3,
      text: contentFor('question.type_of_temporary_accommodation.option.CAS3'),
      block: cas3EndDate,
    },
    {
      value: Option.immigration,
      text: contentFor('question.type_of_temporary_accommodation.option.IMMIGRATION.text'),
      hint: {
        html: contentFor('question.type_of_temporary_accommodation.option.IMMIGRATION.hint'),
      },
      block: immigrationEndDate,
    },
    {
      value: Option.short_term,
      text: contentFor('question.type_of_temporary_accommodation.option.SHORT_TERM.text'),
      hint: { text: contentFor('question.type_of_temporary_accommodation.option.SHORT_TERM.hint') },
      block: shortTermEndDate,
    },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.type_of_temporary_accommodation.validation'),
    }),
  ],
})

export const typeOfNoAccommodation = GovUKRadioInput({
  code: Question.type_of_no_accommodation,
  fieldset: {
    legend: {
      text: contentFor('question.type_of_no_accommodation.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  items: [
    { value: Option.campsite, text: contentFor('question.type_of_no_accommodation.option.CAMPSITE') },
    { value: Option.emergency_hostel, text: contentFor('question.type_of_no_accommodation.option.EMERGENCY_HOSTEL') },
    { value: Option.homeless, text: contentFor('question.type_of_no_accommodation.option.HOMELESS') },
    { value: Option.rough_sleeping, text: contentFor('question.type_of_no_accommodation.option.ROUGH_SLEEPING') },
    { value: Option.shelter, text: contentFor('question.type_of_no_accommodation.option.SHELTER') },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.type_of_no_accommodation.validation'),
    }),
  ],
})

export const currentAccommodation = GovUKRadioInput({
  code: Question.current_accommodation,
  fieldset: {
    legend: {
      text: contentFor('question.current_accommodation.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    {
      value: Option.settled,
      text: contentFor('question.current_accommodation.option.SETTLED'),
      block: typeOfSettledAccommodation,
    },
    {
      value: Option.temporary,
      text: contentFor('question.current_accommodation.option.TEMPORARY'),
      block: typeOfTemporaryAccommodation,
    },
    {
      value: Option.no_accommodation,
      text: contentFor('question.current_accommodation.option.NO_ACCOMMODATION'),
      block: typeOfNoAccommodation,
    },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.current_accommodation.validation'),
    }),
  ],
})
