import { validation, Self, Answer, Format, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { locale } from '../../constants/locale'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { commonLocale } from '../../../../constants/locale'

export const typeOfEmployment = GovUKRadioInput({
  code: Question.type_of_employment,
  fieldset: {
    legend: {
      text: locale.question[Question.type_of_employment],
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
  items: [
    { value: Option.full_time, text: locale.option[Option.full_time] },
    { value: Option.part_time, text: locale.option[Option.part_time] },
    { value: Option.temporary_or_casual, text: locale.option[Option.temporary_or_casual] },
    { value: Option.apprenticeship, text: locale.option[Option.apprenticeship] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.type_of_employment],
    }),
  ],
})

export const hadPreviousEmploymentUnavailableForWork = GovUKRadioInput({
  code: Question.had_previous_employment_unavailable_for_work,
  fieldset: {
    legend: {
      text: locale.question[Question.had_previous_employment_unavailable_for_work],
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(
    Condition.Equals(Option.currently_unavailable_for_work),
  ),
  items: [
    { value: Option.yes_has_been_employed_before, text: locale.option[Option.yes_has_been_employed_before] },
    { value: Option.no_has_never_been_employed, text: locale.option[Option.no_has_never_been_employed] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonLocale.select_one_option,
    }),
  ],
})

export const hadPreviousEmploymentActivelyLookingForWork = GovUKRadioInput({
  code: Question.had_previous_employment_actively_looking_for_work,
  fieldset: {
    legend: {
      text: locale.question[Question.had_previous_employment_actively_looking_for_work],
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(Condition.Equals(Option.unemployed_actively_looking)),
  items: [
    { value: Option.yes_has_been_employed_before, text: locale.option[Option.yes_has_been_employed_before] },
    { value: Option.no_has_never_been_employed, text: locale.option[Option.no_has_never_been_employed] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonLocale.select_one_option,
    }),
  ],
})

export const hadPreviousEmploymentNotLookingForWork = GovUKRadioInput({
  code: Question.had_previous_employment_not_looking_for_work,
  fieldset: {
    legend: {
      text: locale.question[Question.had_previous_employment_not_looking_for_work],
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(
    Condition.Equals(Option.unemployed_not_actively_looking),
  ),
  items: [
    { value: Option.yes_has_been_employed_before, text: locale.option[Option.yes_has_been_employed_before] },
    { value: Option.no_has_never_been_employed, text: locale.option[Option.no_has_never_been_employed] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonLocale.select_one_option,
    }),
  ],
})

export const currentEmploymentStatus = GovUKRadioInput({
  code: Question.current_employment_status,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.current_employment_status], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.employed, text: locale.option[Option.employed], block: typeOfEmployment },
    { value: Option.self_employed, text: locale.option[Option.self_employed] },
    { value: Option.retired, text: locale.option[Option.retired] },
    {
      value: Option.currently_unavailable_for_work,
      text: locale.option[Option.currently_unavailable_for_work],
      block: hadPreviousEmploymentUnavailableForWork,
    },
    {
      value: Option.unemployed_actively_looking,
      text: locale.option[Option.unemployed_actively_looking],
      block: hadPreviousEmploymentActivelyLookingForWork,
    },
    {
      value: Option.unemployed_not_actively_looking,
      text: locale.option[Option.unemployed_not_actively_looking],
      block: hadPreviousEmploymentNotLookingForWork,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.current_employment_status],
    }),
  ],
})
