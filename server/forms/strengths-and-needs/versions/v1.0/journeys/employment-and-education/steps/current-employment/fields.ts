import { validation, Self, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales';
import { commonContentFor } from '../../../../locales';

export const typeOfEmployment = GovUKRadioInput({
  code: Question.type_of_employment,
  fieldset: {
    legend: {
      text: contentFor('question.type_of_employment.text'),
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
  items: [
    { value: Option.full_time, text: contentFor('option.FULL_TIME') },
    { value: Option.part_time, text: contentFor('option.PART_TIME') },
    { value: Option.temporary_or_casual, text: contentFor('option.TEMPORARY_OR_CASUAL') },
    { value: Option.apprenticeship, text: contentFor('option.APPRENTICESHIP') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.type_of_employment.validation'),
    }),
  ],
})

export const hadPreviousEmploymentUnavailableForWork = GovUKRadioInput({
  code: Question.had_previous_employment_unavailable_for_work,
  fieldset: {
    legend: {
      text: contentFor('question.had_previous_employment_unavailable_for_work.text'),
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(
    Condition.Equals(Option.currently_unavailable_for_work),
  ),
  items: [
    { value: Option.yes_has_been_employed_before, text: contentFor('option.YES_HAS_BEEN_EMPLOYED_BEFORE') },
    { value: Option.no_has_never_been_employed, text: contentFor('option.NO_HAS_NEVER_BEEN_EMPLOYED') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('select_one_option'),
    }),
  ],
})

export const hadPreviousEmploymentActivelyLookingForWork = GovUKRadioInput({
  code: Question.had_previous_employment_actively_looking_for_work,
  fieldset: {
    legend: {
      text: contentFor('question.had_previous_employment_actively_looking_for_work.text'),
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(Condition.Equals(Option.unemployed_actively_looking)),
  items: [
    { value: Option.yes_has_been_employed_before, text: contentFor('option.YES_HAS_BEEN_EMPLOYED_BEFORE') },
    { value: Option.no_has_never_been_employed, text: contentFor('option.NO_HAS_NEVER_BEEN_EMPLOYED') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('select_one_option'),
    }),
  ],
})

export const hadPreviousEmploymentNotLookingForWork = GovUKRadioInput({
  code: Question.had_previous_employment_not_looking_for_work,
  fieldset: {
    legend: {
      text: contentFor('question.had_previous_employment_not_looking_for_work.text'),
    },
  },
  dependentWhen: Answer(Question.current_employment_status).match(
    Condition.Equals(Option.unemployed_not_actively_looking),
  ),
  items: [
    { value: Option.yes_has_been_employed_before, text: contentFor('option.YES_HAS_BEEN_EMPLOYED_BEFORE') },
    { value: Option.no_has_never_been_employed, text: contentFor('option.NO_HAS_NEVER_BEEN_EMPLOYED') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('select_one_option'),
    }),
  ],
})

export const currentEmploymentStatus = GovUKRadioInput({
  code: Question.current_employment_status,
  fieldset: {
    legend: {
      text: contentFor('question.current_employment_status.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.employed, text: contentFor('option.EMPLOYED'), block: typeOfEmployment },
    { value: Option.self_employed, text: contentFor('option.SELF_EMPLOYED') },
    { value: Option.retired, text: contentFor('option.RETIRED') },
    {
      value: Option.currently_unavailable_for_work,
      text: contentFor('option.CURRENTLY_UNAVAILABLE_FOR_WORK'),
      block: hadPreviousEmploymentUnavailableForWork,
    },
    {
      value: Option.unemployed_actively_looking,
      text: contentFor('option.UNEMPLOYED_ACTIVELY_LOOKING'),
      block: hadPreviousEmploymentActivelyLookingForWork,
    },
    {
      value: Option.unemployed_not_actively_looking,
      text: contentFor('option.UNEMPLOYED_NOT_ACTIVELY_LOOKING'),
      block: hadPreviousEmploymentNotLookingForWork,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.current_employment_status.validation'),
    }),
  ],
})
