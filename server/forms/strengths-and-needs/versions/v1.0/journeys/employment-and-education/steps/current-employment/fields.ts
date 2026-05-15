import {validation, Self, Answer, Format, Condition, not, when} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKRadioInput, GovUKTag, GovUKUtilityClasses} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'
import locale from '../../locale.json'

export const employmentProgressStatus = GovUKTag({ text: 'Incomplete', classes: GovUKUtilityClasses.Tag.Blue })

export const typeOfEmployment = GovUKRadioInput({
  code: 'type_of_employment',
  fieldset: {
    legend: {
      text: 'Select the type of employment',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_employment').match(Condition.Equals('EMPLOYED')),
  items: [
    { value: "FULL_TIME", text: locale.options['FULL_TIME'] },
    { value: "PART_TIME", text: locale.options['PART_TIME'] },
    { value: "TEMPORARY_OR_CASUAL", text: locale.options['TEMPORARY_OR_CASUAL'] },
    { value: "APPRENTICESHIP", text: locale.options['APPRENTICESHIP'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of employment',
    }),
  ],
})

export const hadPreviousEmploymentUnavailableForWork = GovUKRadioInput({
  code: 'had_previous_employment_unavailable_for_work',
  fieldset: {
    legend: {
      text: 'Have they been employed before?',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_employment').match(Condition.Equals('CURRENTLY_UNAVAILABLE_FOR_WORK')),
  items: [
    { value: "YES_HAS_BEEN_EMPLOYED_BEFORE", text: locale.options['YES_HAS_BEEN_EMPLOYED_BEFORE'] },
    { value: "NO_HAS_NEVER_BEEN_EMPLOYED", text: locale.options['NO_HAS_NEVER_BEEN_EMPLOYED'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select one option',
    }),
  ],
})

export const hadPreviousEmploymentActivelyLookingForWork = GovUKRadioInput({
  code: 'had_previous_employment_actively_looking_for_work',
  fieldset: {
    legend: {
      text: 'Have they been employed before?',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_employment').match(Condition.Equals('UNEMPLOYED_ACTIVELY_LOOKING')),
  items: [
    { value: "YES_HAS_BEEN_EMPLOYED_BEFORE", text: locale.options['YES_HAS_BEEN_EMPLOYED_BEFORE'] },
    { value: "NO_HAS_NEVER_BEEN_EMPLOYED", text: locale.options['NO_HAS_NEVER_BEEN_EMPLOYED'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select one option',
    }),
  ],
})

export const hadPreviousEmploymentNotLookingForWork = GovUKRadioInput({
  code: 'had_previous_employment_not_looking_for_work',
  fieldset: {
    legend: {
      text: 'Have they been employed before?',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_employment').match(Condition.Equals('UNEMPLOYED_NOT_ACTIVELY_LOOKING')),
  items: [
    { value: "YES_HAS_BEEN_EMPLOYED_BEFORE", text: locale.options['YES_HAS_BEEN_EMPLOYED_BEFORE'] },
    { value: "NO_HAS_NEVER_BEEN_EMPLOYED", text: locale.options['NO_HAS_NEVER_BEEN_EMPLOYED'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select one option',
    }),
  ],
})

export const currentEmployment = GovUKRadioInput({
  code: 'current_employment',
  fieldset: {
    legend: {
      text: Format(locale.current_employment.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: "EMPLOYED", text: locale.options['EMPLOYED'], block: typeOfEmployment },
    { value: "SELF_EMPLOYED", text: locale.options['SELF_EMPLOYED'] },
    { value: "RETIRED", text: locale.options['RETIRED'] },
    { value: "CURRENTLY_UNAVAILABLE_FOR_WORK", text: locale.options['CURRENTLY_UNAVAILABLE_FOR_WORK'], block: hadPreviousEmploymentUnavailableForWork },
    { value: "UNEMPLOYED_ACTIVELY_LOOKING", text: locale.options['UNEMPLOYED_ACTIVELY_LOOKING'], block: hadPreviousEmploymentActivelyLookingForWork },
    { value: "UNEMPLOYED_NOT_ACTIVELY_LOOKING", text: locale.options['UNEMPLOYED_NOT_ACTIVELY_LOOKING'], block: hadPreviousEmploymentNotLookingForWork },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of employment they currently have',
    }),
  ],
})
