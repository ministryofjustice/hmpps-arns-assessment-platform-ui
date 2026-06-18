import {
  validation,
  Self,
  Answer,
  Format,
  and,
  or,
  Condition,
  Transformer,
  not,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKDateInputFull } from '@ministryofjustice/hmpps-forge/govuk-components'

import { CaseData } from '../../../../constants/formVersion'
import { commonLocale } from '../../../../constants/locale'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { locale } from '../../constants/locale'

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
      message: commonLocale.validation.valid_date_day,
      details: { field: 'day' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('month')))),
      message: commonLocale.validation.valid_date_month,
      details: { field: 'month' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('year')))),
      message: commonLocale.validation.valid_date_year,
      details: { field: 'year' },
    }),
    validation({
      condition: not(hasAllDateParts()),
      message: commonLocale.validation.valid_date,
    }),
    validation({
      condition: not(
        and(
          Self().match(Condition.IsRequired()),
          Self().not.match(Condition.Object.IsObject()),
          Self().not.match(Condition.Date.IsValid()),
        ),
      ),
      message: commonLocale.validation.valid_date,
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
      message: commonLocale.validation.future_date,
    }),
  ]
}

const shortTermEndDate = GovUKDateInputFull({
  code: Question.short_term_accommodation_end_date,
  fieldset: {
    legend: { text: locale.question[Question.short_term_accommodation_end_date] },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const approvedPremisesEndDate = GovUKDateInputFull({
  code: Question.approved_premises_end_date,
  fieldset: {
    legend: { text: locale.question[Question.approved_premises_end_date] },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.approved_premises)),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const cas2EndDate = GovUKDateInputFull({
  code: Question.cas2_end_date,
  fieldset: {
    legend: { text: locale.question[Question.cas2_end_date] },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas2)),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const cas3EndDate = GovUKDateInputFull({
  code: Question.cas3_end_date,
  fieldset: {
    legend: { text: locale.question[Question.cas3_end_date] },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas3)),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const immigrationEndDate = GovUKDateInputFull({
  code: Question.immigration_accommodation_end_date,
  fieldset: {
    legend: { text: locale.question[Question.immigration_accommodation_end_date] },
  },
  dependentWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

export const typeOfSettledAccommodation = GovUKRadioInput({
  code: Question.type_of_settled_accommodation,
  fieldset: {
    legend: {
      text: locale.question[Question.type_of_settled_accommodation],
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.settled)),
  items: [
    { value: Option.homeowner, text: locale.option[Option.homeowner] },
    { value: Option.friends_or_family, text: locale.option[Option.friends_or_family] },
    { value: Option.renting_privately, text: locale.option[Option.renting_privately] },
    { value: Option.renting_other, text: locale.option[Option.renting_other] },
    { value: Option.residential_healthcare, text: locale.option[Option.residential_healthcare] },
    { value: Option.supported_accommodation, text: locale.option[Option.supported_accommodation] },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.type_of_settled_accommodation],
    }),
  ],
})

export const typeOfTemporaryAccommodation = GovUKRadioInput({
  code: Question.type_of_temporary_accommodation,
  fieldset: {
    legend: {
      text: locale.question[Question.type_of_temporary_accommodation],
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
  items: [
    { value: Option.approved_premises, text: locale.option[Option.approved_premises], block: approvedPremisesEndDate },
    {
      value: Option.cas2,
      text: locale.option[Option.cas2],
      block: cas2EndDate,
    },
    {
      value: Option.cas3,
      text: locale.option[Option.cas3],
      block: cas3EndDate,
    },
    {
      value: Option.immigration,
      text: locale.option[Option.immigration],
      hint: {
        text: locale.hint[`${Question.type_of_temporary_accommodation}_${Option.immigration}`],
      },
      block: immigrationEndDate,
    },
    {
      value: Option.short_term,
      text: locale.option[Option.short_term],
      hint: { text: locale.hint[`${Question.type_of_temporary_accommodation}_${Option.short_term}`] },
      block: shortTermEndDate,
    },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.type_of_temporary_accommodation],
    }),
  ],
})

export const typeOfNoAccommodation = GovUKRadioInput({
  code: Question.type_of_no_accommodation,
  fieldset: {
    legend: {
      text: locale.question[Question.type_of_no_accommodation],
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
  items: [
    { value: Option.campsite, text: locale.option[Option.campsite] },
    { value: Option.emergency_hostel, text: locale.option[Option.emergency_hostel] },
    { value: Option.homeless, text: locale.option[Option.homeless] },
    { value: Option.rough_sleeping, text: locale.option[Option.rough_sleeping] },
    { value: Option.shelter, text: locale.option[Option.shelter] },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.type_of_no_accommodation],
    }),
  ],
})

export const currentAccommodation = GovUKRadioInput({
  code: Question.current_accommodation,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.current_accommodation], CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.settled, text: locale.option[Option.settled], block: typeOfSettledAccommodation },
    { value: Option.temporary, text: locale.option[Option.temporary], block: typeOfTemporaryAccommodation },
    { value: Option.no_accommodation, text: locale.option[Option.no_accommodation], block: typeOfNoAccommodation },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.current_accommodation],
    }),
  ],
})
