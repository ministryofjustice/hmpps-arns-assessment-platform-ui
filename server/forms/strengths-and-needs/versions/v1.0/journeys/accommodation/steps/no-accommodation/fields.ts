import { validation, Self, Answer, Format, and, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCheckboxInput, GovUKCharacterCount } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonLocale } from '../../../../constants/locale'
import { locale } from '../../constants/locale'

// --- No Accommodation Reason Group ---

const noAccommodationReasonOtherDetails = GovUKCharacterCount({
  code: Question.no_accommodation_reason_other_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
    Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.other)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: commonLocale.validation.enter_details,
    }),
  ],
})

export const noAccommodationReason = GovUKCheckboxInput({
  code: Question.no_accommodation_reason,
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.no_accommodation_reason], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.no_accommodation_reason],
  items: [
    { value: Option.alcohol_problems, text: locale.option[Question.no_accommodation_reason + Option.alcohol_problems] },
    { value: Option.drug_problems, text: locale.option[Question.no_accommodation_reason + Option.drug_problems] },
    { value: Option.financial_difficulties, text: locale.option[Question.no_accommodation_reason + Option.financial_difficulties] },
    {
      value: Option.risk_to_others,
      text: locale.option[Question.no_accommodation_reason + Option.risk_to_others],
    },
    {
      value: Option.safety,
      text: locale.option[Question.no_accommodation_reason + Option.safety],
    },
    {
      value: Option.prison_release,
      text: locale.option[Question.no_accommodation_reason + Option.prison_release],
    },
    { value: Option.other, text: locale.option[Option.other], block: noAccommodationReasonOtherDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.no_accommodation_reason],
    }),
  ],
})

export const pastAccommodationDetails = GovUKCharacterCount({
  code: Question.past_accommodation_details,
  label: {
    text: Format(locale.question[Question.past_accommodation_details], CaseData.Forename),
    classes: 'govuk-label--m',
  },
  maxLength: 2000,
})
