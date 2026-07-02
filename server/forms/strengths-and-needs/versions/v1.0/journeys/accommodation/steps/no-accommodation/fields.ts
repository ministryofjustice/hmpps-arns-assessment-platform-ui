import { validation, Self, Answer, and, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCheckboxInput, GovUKCharacterCount } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'

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
  hint: contentFor('question.no_accommodation_reason.hint'),
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
})
