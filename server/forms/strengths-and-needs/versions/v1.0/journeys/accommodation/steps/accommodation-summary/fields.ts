import { and, Answer, Condition, not, or, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import { Question } from '../../constants/question'
import { CaseData } from '../../../../constants/formVersion'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import {
  currentAccommodation,
  typeOfNoAccommodation,
  typeOfSettledAccommodation,
  typeOfTemporaryAccommodation,
} from '../current-accommodation/fields'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'

// --- Accommodation Summary Group ---

export const accommodationSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.current_accommodation.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              currentAccommodation.items,
              Answer(Question.current_accommodation),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              typeOfSettledAccommodation.items,
              Answer(Question.type_of_settled_accommodation),
            ),
            size: 's',
            visibleWhen: Answer(Question.type_of_settled_accommodation).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              typeOfTemporaryAccommodation.items,
              Answer(Question.type_of_temporary_accommodation),
            ),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              typeOfNoAccommodation.items,
              Answer(Question.type_of_no_accommodation),
            ),
            size: 's',
            visibleWhen: Answer(Question.type_of_no_accommodation).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: contentFor('expected_end_date'),
            size: 's',
            visibleWhen: or(
              Answer(Question.short_term_accommodation_end_date).match(Condition.IsRequired()),
              Answer(Question.approved_premises_end_date).match(Condition.IsRequired()),
              Answer(Question.cas2_end_date).match(Condition.IsRequired()),
              Answer(Question.cas3_end_date).match(Condition.IsRequired()),
              Answer(Question.immigration_accommodation_end_date).match(Condition.IsRequired()),
            ),
          }),
          GovUKBody({
            text: Answer(Question.short_term_accommodation_end_date),
            size: 's',
            visibleWhen: Answer(Question.short_term_accommodation_end_date).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: Answer(Question.approved_premises_end_date),
            size: 's',
            visibleWhen: Answer(Question.approved_premises_end_date).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: Answer(Question.cas2_end_date),
            size: 's',
            visibleWhen: Answer(Question.cas2_end_date).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: Answer(Question.cas3_end_date),
            size: 's',
            visibleWhen: Answer(Question.cas3_end_date).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: Answer(Question.immigration_accommodation_end_date),
            size: 's',
            visibleWhen: Answer(Question.immigration_accommodation_end_date).match(Condition.IsRequired()),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.current_accommodation.path, text: commonContentFor('change') }],
      },
    },
  ],
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.accommodation_strengths_protective_factors_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.accommodation_strengths_protective_factors).match(Condition.IsRequired()),
    Answer(Question.accommodation_strengths_protective_factors).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_strengths_protective_factors_details.validation'),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.accommodation_no_strengths_protective_factors_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_strengths_protective_factors).match(Condition.Equals(CommonOption.no)),
})

export const accommodationStrengthsProtectiveFactors = GovUKRadioInput({
  code: Question.accommodation_strengths_protective_factors,
  fieldset: {
    legend: {
      text: contentFor('question.accommodation_strengths_protective_factors.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.accommodation_strengths_protective_factors.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_strengths_protective_factors.validation'),
    }),
  ],
})

// --- Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.accommodation_serious_harm_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.accommodation_linked_to_serious_harm).match(Condition.IsRequired()),
    Answer(Question.accommodation_linked_to_serious_harm).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_serious_harm_details.validation'),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.accommodation_no_serious_harm_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_linked_to_serious_harm).match(Condition.Equals(CommonOption.no)),
})

export const accommodationLinkedToSeriousHarm = GovUKRadioInput({
  code: Question.accommodation_linked_to_serious_harm,
  fieldset: {
    legend: {
      text: contentFor('question.accommodation_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_linked_to_serious_harm.validation'),
    }),
  ],
})

// --- Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.accommodation_risk_of_reoffending_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.accommodation_linked_to_reoffending).match(Condition.IsRequired()),
    Answer(Question.accommodation_linked_to_reoffending).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_risk_of_reoffending_details.validation'),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.accommodation_no_risk_of_reoffending_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.accommodation_linked_to_reoffending).match(Condition.Equals(CommonOption.no)),
})

export const accommodationLinkedReoffending = GovUKRadioInput({
  code: Question.accommodation_linked_to_reoffending,
  fieldset: {
    legend: {
      text: contentFor('question.accommodation_linked_to_reoffending.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.accommodation_linked_to_reoffending.validation'),
    }),
  ],
})

export const accommodationSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [accommodationSummary, goToPractitionerAnalysisButton(Step.accommodation_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          accommodationStrengthsProtectiveFactors,
          accommodationLinkedToSeriousHarm,
          accommodationLinkedReoffending,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
