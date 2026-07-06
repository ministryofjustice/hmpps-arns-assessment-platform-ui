import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCharacterCount, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'

// --- Physical health conditions Group ---

const hasHealthConditions = GovUKCharacterCount({
  code: Question.has_health_conditions_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.health_conditions).match(Condition.Equals(Option.yes)),
})

export const healthConditions = GovUKRadioInput({
  code: Question.health_conditions,
  fieldset: {
    legend: {
      text: contentFor('question.health_conditions.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: hasHealthConditions },
    { value: Option.no, text: commonContentFor('option.NO') },
    { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.health_conditions.validation'),
    }),
  ],
})

// --- Mental health conditions Group ---

const severeMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.severe_mental_health_problems_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals(Option.yes_ongoing_severe)),
})

const ongoingDurationUnknownMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.ongoing_duration_unknown_mental_health_problems_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals(Option.yes_ongoing_duration_unknown)),
})

const pastMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.past_mental_health_problems_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals(Option.yes_past)),
})

export const mentalHealthProblems = GovUKRadioInput({
  code: Question.mental_health_problems,
  fieldset: {
    legend: {
      text: contentFor('question.mental_health_problems.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    {
      value: Option.yes_ongoing_severe,
      text: contentFor('question.mental_health_problems.option.YES_ONGOING_SEVERE'),
      block: severeMentalHealthProblemsDetails,
    },
    {
      value: Option.yes_ongoing_duration_unknown,
      text: contentFor('question.mental_health_problems.option.YES_ONGOING_DURATION_UNKNOWN'),
      block: ongoingDurationUnknownMentalHealthProblemsDetails,
    },
    {
      value: Option.yes_past,
      text: contentFor('question.mental_health_problems.option.YES_PAST'),
      block: pastMentalHealthProblemsDetails,
    },
    { value: Option.no, text: commonContentFor('option.NO') },
    { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.mental_health_problems.validation'),
    }),
  ],
})
