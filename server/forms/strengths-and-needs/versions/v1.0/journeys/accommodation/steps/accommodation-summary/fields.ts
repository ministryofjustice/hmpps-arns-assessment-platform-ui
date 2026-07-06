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
import { Option } from '../../constants/option'
import {
  accommodationChanges,
  futureAccommodationType,
  suitableHousing,
  suitableHousingLocation,
  suitableHousingPlanned,
} from '../accommodation-details/fields'

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
            visibleWhen: and(
              not(Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(CommonOption.unknown))),
              Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getFormatterDateFromIso(Answer(Question.approved_premises_end_date)),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(
              Condition.Equals(Option.approved_premises),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getFormatterDateFromIso(Answer(Question.cas2_end_date)),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas2)),
          }),
          GovUKBody({
            text: SANGenerators.getFormatterDateFromIso(Answer(Question.cas3_end_date)),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.cas3)),
          }),
          GovUKBody({
            text: SANGenerators.getFormatterDateFromIso(Answer(Question.immigration_accommodation_end_date)),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
          }),
          GovUKBody({
            text: SANGenerators.getFormatterDateFromIso(Answer(Question.short_term_accommodation_end_date)),
            size: 's',
            visibleWhen: Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.current_accommodation.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.living_with.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.living_with.option.FAMILY'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(Option.family)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.living_with.option.FRIENDS'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(Option.friends)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.living_with.option.PARTNER'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(Option.partner)),
            ),
          }),
          GovUKBody({ text: Answer(Question.living_with_partner_details), size: 's' }),
          GovUKBody({
            text: contentFor('question.living_with.option.PERSON_UNDER_18'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(Option.person_under_18)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
          GovUKBody({ text: Answer(Question.living_with_other_details), size: 's' }),
          GovUKBody({
            text: commonContentFor('option.UNKNOWN'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(CommonOption.unknown)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.living_with.option.ALONE'),
            visibleWhen: and(
              Answer(Question.living_with).match(Condition.IsRequired()),
              Answer(Question.living_with).match(Condition.Array.Contains(Option.alone)),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.living_with).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.suitable_housing_location.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              suitableHousingLocation.items,
              Answer(Question.suitable_housing_location),
            ),
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_location_concerns.option.CRIMINAL_ASSOCIATES'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(
                Condition.Array.Contains(Option.criminal_associates),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_location_concerns.option.VICTIMISATION'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(Condition.Array.Contains(Option.victimisation)),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_location_concerns.option.VICTIM_PROXIMITY'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(
                Condition.Array.Contains(Option.victim_proximity),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_location_concerns.option.NEIGHBOUR_DIFFICULTY'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(
                Condition.Array.Contains(Option.neighbour_difficulty),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_location_concerns.option.AREA_SAFETY'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(Condition.Array.Contains(Option.area_safety)),
            ),
            size: 's',
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.suitable_housing_location_concerns).match(Condition.IsRequired()),
              Answer(Question.suitable_housing_location_concerns).match(Condition.Array.Contains(CommonOption.other)),
            ),
            size: 's',
          }),
          GovUKBody({ text: Answer(Question.suitable_housing_location_concerns_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
    },
    {
      key: { text: contentFor('question.suitable_housing.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(suitableHousing.items, Answer(Question.suitable_housing)),
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.FACILITIES'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.facilities)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.facilities)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.OVERCROWDING'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.overcrowding)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.overcrowding)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.EXPLOITATION'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.exploitation)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.exploitation)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.SAFETY'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.safety)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.safety)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.LIVES_WITH_VICTIM'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.lives_with_victim)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.lives_with_victim)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.suitable_housing_concerns.option.VICTIMISATION'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(Option.victimisation)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(Option.victimisation)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: or(
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(CommonOption.no)),
                Answer(Question.unsuitable_housing_concerns).match(Condition.Array.Contains(CommonOption.other)),
              ),
              and(
                Answer(Question.suitable_housing).match(Condition.Equals(Option.yes_with_concerns)),
                Answer(Question.suitable_housing_concerns).match(Condition.Array.Contains(CommonOption.other)),
              ),
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.suitable_housing_concerns_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.unsuitable_housing_concerns_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: not(Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))),
    },
    {
      key: { text: contentFor('question.no_accommodation_reason.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.no_accommodation_reason.option.ALCOHOL_PROBLEMS'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.alcohol_problems)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.no_accommodation_reason.option.DRUG_PROBLEMS'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.drug_problems)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.no_accommodation_reason.option.FINANCIAL_DIFFICULTIES'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.financial_difficulties)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.no_accommodation_reason.option.RISK_TO_OTHERS'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.risk_to_others)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.no_accommodation_reason.option.SAFETY'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(Option.safety)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.no_accommodation_reason).match(Condition.IsRequired()),
              Answer(Question.no_accommodation_reason).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
          GovUKBody({ text: Answer(Question.no_accommodation_reason_other_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
    },
    {
      key: { text: contentFor('question.past_accommodation_details.text', CaseData.Forename) },
      value: {
        blocks: [GovUKBody({ text: Answer(Question.past_accommodation_details) })],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.past_accommodation_details).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.suitable_housing_planned.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              suitableHousingPlanned.items,
              Answer(Question.suitable_housing_planned),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              futureAccommodationType.items,
              Answer(Question.future_accommodation_type),
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.future_accommodation_type_awaiting_assessment_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.future_accommodation_type_awaiting_placement_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.future_accommodation_type_other_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.suitable_housing_planned).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.accommodation_changes.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              accommodationChanges.items,
              Answer(Question.accommodation_changes),
            ),
          }),
          GovUKBody({
            text: Answer(Question.has_made_positive_changes_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.actively_making_changes_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.wants_to_make_changes_knows_how_to_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.wants_to_make_changes_needs_help_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.thinking_about_making_changes_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.does_not_want_to_make_changes_accommodation_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.does_not_want_to_answer_accommodation_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.accommodation_details.path, text: commonContentFor('change') }],
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
