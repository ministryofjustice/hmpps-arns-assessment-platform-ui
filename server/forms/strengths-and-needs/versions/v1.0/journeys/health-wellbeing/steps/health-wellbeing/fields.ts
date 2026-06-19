import {Answer, Condition, Format, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKCharacterCount, GovUKRadioInput} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants/formVersion'
import locale from '../../locale.json'
import {Question} from "../../constants/question";
import {Option} from "../../constants/option";

// --- Physical health conditions Group ---

const hasHealthConditions = GovUKCharacterCount({
  code: Question.has_health_conditions_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.health_conditions).match(Condition.Equals('YES'))
})

export const healthConditions = GovUKRadioInput({
  code: Question.health_conditions,
  fieldset: {
    legend: {
      text: Format(locale.health_wellbeing.health_conditions.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.yes, text: locale.options.YES, block: hasHealthConditions },
    { value: Option.no, text: locale.options.NO },
    { value: Option.unknown, text: locale.options.UNKNOWN },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select the type of employment they currently have',
    }),
  ],
})

// --- Mental health conditions Group ---

const severeMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.severe_mental_health_problems_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals('YES_ONGOING_SEVERE')),
})

const ongoingDurationUnknownMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.ongoing_duration_unknown_mental_health_problems_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals('YES_ONGOING_DURATION_UNKNOWN')),
})

const pastMentalHealthProblemsDetails = GovUKCharacterCount({
  code: Question.past_mental_health_problems_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.mental_health_problems).match(Condition.Equals('YES_PAST')),
})

export const mentalHealthProblems = GovUKRadioInput({
  code: Question.mental_health_problems,
  fieldset: {
    legend: {
      text: Format(locale.health_wellbeing.mental_health_problems.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: Option.yes_ongoing_severe, text: locale.options.YES_ONGOING_SEVERE, block: severeMentalHealthProblemsDetails },
    { value: Option.yes_ongoing_duration_unknown, text: locale.options.YES_ONGOING_DURATION_UNKNOWN, block: ongoingDurationUnknownMentalHealthProblemsDetails },
    { value: Option.yes_past, text: locale.options.YES_PAST, block: pastMentalHealthProblemsDetails },
    { value: Option.no, text: locale.options.NO },
    { value: Option.unknown, text: locale.options.UNKNOWN },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select the type of employment they currently have',
    }),
  ],
})
