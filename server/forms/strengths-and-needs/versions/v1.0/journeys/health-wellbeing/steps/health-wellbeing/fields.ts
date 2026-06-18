import {Answer, Condition, Format, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKCharacterCount, GovUKRadioInput} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants'
import locale from '../../locale.json'

// --- Physical health conditions Group ---

const hasHealthConditions = GovUKCharacterCount({
  code: 'has_health_conditions_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('health_conditions').match(Condition.Equals('YES'))
})

export const healthConditions = GovUKRadioInput({
  code: 'health_conditions',
  fieldset: {
    legend: {
      text: Format(locale.health_wellbeing.health_conditions.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: "YES", text: locale.options.YES, block: hasHealthConditions },
    { value: "NO", text: locale.options.NO },
    { value: "UNKNOWN", text: locale.options.UNKNOWN },
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
  code: 'severe_mental_health_problems_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('mental_health_problems').match(Condition.Equals('YES_ONGOING_SEVERE')),
})

const ongoingDurationUnknownMentalHealthProblemsDetails = GovUKCharacterCount({
  code: 'ongoing_duration_unknown_mental_health_problems_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('mental_health_problems').match(Condition.Equals('YES_ONGOING_DURATION_UNKNOWN')),
})

const pastMentalHealthProblemsDetails = GovUKCharacterCount({
  code: 'past_mental_health_problems_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('mental_health_problems').match(Condition.Equals('YES_PAST')),
})

export const mentalHealthProblems = GovUKRadioInput({
  code: 'mental_health_problems',
  fieldset: {
    legend: {
      text: Format(locale.health_wellbeing.mental_health_problems.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: "YES_ONGOING_SEVERE", text: locale.options.YES_ONGOING_SEVERE, block: severeMentalHealthProblemsDetails },
    { value: "YES_ONGOING_DURATION_UNKNOWN", text: locale.options.YES_ONGOING_DURATION_UNKNOWN, block: ongoingDurationUnknownMentalHealthProblemsDetails },
    { value: "YES_PAST", text: locale.options.YES_PAST, block: pastMentalHealthProblemsDetails },
    { value: "NO", text: locale.options.NO },
    { value: "UNKNOWN", text: locale.options.UNKNOWN },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select the type of employment they currently have',
    }),
  ],
})
