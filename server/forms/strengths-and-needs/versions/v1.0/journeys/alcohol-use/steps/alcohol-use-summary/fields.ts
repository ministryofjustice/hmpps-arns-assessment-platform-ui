import { and, Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  alcoholBingeDrinking,
  alcoholBingeDrinkingFrequency,
  alcoholBingeDrinkingLegend,
  alcoholChanges,
  alcoholEvidenceOfExcessDrinking,
  alcoholFrequency,
  alcoholPastIssues,
  alcoholStoppedOrReduced,
  alcoholUnits,
} from '../alcohol-use-details/fields'
import { alcoholUse } from '../alcohol-use/fields'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { CommonOption } from '../../../../constants/commonOption'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { getDisplayTextForItems } from '../../../../../../i18n'

// Base usage rows are shown whenever they have drunk alcohol, the recency rows only
// when they drank in the last 3 months.
const drankAlcohol = Answer(Question.alcohol_use).not.match(Condition.Equals(CommonOption.no))
const drankInLastThreeMonths = Answer(Question.alcohol_use).match(Condition.Equals(Option.yes_within_last_three_months))

// --- Alcohol Use Summary Group ---

export const alcoholSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.alcohol_use.text', CaseData.Forename) },
      value: { blocks: getDisplayTextForItems(Question.alcohol_use, alcoholUse.items) },
      actions: {
        items: [{ href: `${Step.alcohol_use.path}#${Question.alcohol_use}`, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.alcohol_frequency.text', CaseData.Forename) },
      value: { blocks: getDisplayTextForItems(Question.alcohol_frequency, alcoholFrequency.items) },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_frequency}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankInLastThreeMonths,
    },
    {
      key: { text: contentFor('question.alcohol_units.text', CaseData.Forename) },
      value: { blocks: getDisplayTextForItems(Question.alcohol_units, alcoholUnits.items) },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_units}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankInLastThreeMonths,
    },
    {
      key: { text: alcoholBingeDrinkingLegend },
      value: {
        blocks: [
          getDisplayTextForItems(Question.alcohol_binge_drinking, alcoholBingeDrinking.items),
          getDisplayTextForItems(Question.alcohol_binge_drinking_frequency, alcoholBingeDrinkingFrequency.items, {
            size: 's',
          }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_binge_drinking}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankInLastThreeMonths,
    },
    {
      key: { text: contentFor('question.alcohol_evidence_of_excess_drinking.text', CaseData.Forename) },
      value: {
        blocks: getDisplayTextForItems(
          Question.alcohol_evidence_of_excess_drinking,
          alcoholEvidenceOfExcessDrinking.items,
        ),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_evidence_of_excess_drinking}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
    {
      key: { text: contentFor('question.alcohol_past_issues.text', CaseData.Forename) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.alcohol_past_issues, alcoholPastIssues.items),
          GovUKBody({ text: Answer(Question.alcohol_past_issues_yes_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_past_issues}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
    {
      key: { text: contentFor('question.alcohol_reasons_for_use.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.CULTURAL_OR_RELIGIOUS'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.cultural_or_religious)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(
                Condition.Array.Contains(Option.curiosity_or_experimentation),
              ),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.ENJOYMENT'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.enjoyment)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(
                Condition.Array.Contains(Option.managing_emotional_issues),
              ),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.SPECIAL_OCCASIONS'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.special_occasions)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.PEER_PRESSURE'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.peer_pressure)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.SELF_MEDICATION.text'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.self_medication)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_reasons_for_use.option.SOCIAL'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(Option.social)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
          GovUKBody({ text: Answer(Question.alcohol_reasons_for_use_other_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_reasons_for_use}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
    {
      key: { text: contentFor('question.alcohol_impact_of_use.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.BEHAVIOURAL.text'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.behavioural)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.COMMUNITY.text'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.community)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.FINANCES.text'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.finances)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.LINKS_TO_REOFFENDING'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.links_to_reoffending)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.PHYSICAL_OR_MENTAL_HEALTH.text'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.physical_or_mental_health)),
            ),
          }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.RELATIONSHIPS.text'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.relationships)),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(CommonOption.other)),
            ),
          }),
          GovUKBody({ text: Answer(Question.alcohol_impact_of_use_other_details), size: 's' }),
          GovUKBody({
            text: contentFor('question.alcohol_impact_of_use.option.NO_NEGATIVE_IMPACT'),
            visibleWhen: and(
              Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
              Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(Option.no_negative_impact)),
            ),
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_impact_of_use}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
    {
      key: { text: contentFor('question.alcohol_stopped_or_reduced.text', CaseData.Forename) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.alcohol_stopped_or_reduced, alcoholStoppedOrReduced.items),
          GovUKBody({ text: Answer(Question.alcohol_stopped_or_reduced_yes_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_stopped_or_reduced}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
    {
      key: { text: contentFor('question.alcohol_use_changes.text', CaseData.Forename) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.alcohol_use_changes, alcoholChanges.items),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_made_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_making_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_want_to_make_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_needs_help_to_make_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_thinking_about_making_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_does_not_want_to_make_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.alcohol_use_changes_does_not_want_to_answer_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_details.path}#${Question.alcohol_use_changes}`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: drankAlcohol,
    },
  ],
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(
        'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
      ),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholStrengthsProtectiveFactors = GovUKRadioInput({
  code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
  fieldset: {
    legend: {
      text: contentFor(
        'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.validation'),
    }),
  ],
})

// --- Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_risk_of_serious_harm).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_risk_of_serious_harm).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholLinkedToSeriousHarm = GovUKRadioInput({
  code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm,
  fieldset: {
    legend: {
      text: contentFor(
        'question.alcohol_use_practitioner_analysis_risk_of_serious_harm.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_practitioner_analysis_risk_of_serious_harm.validation'),
    }),
  ],
})

// --- Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_risk_of_reoffending).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_practitioner_analysis_risk_of_reoffending).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholLinkedReoffending = GovUKRadioInput({
  code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending,
  fieldset: {
    legend: {
      text: contentFor(
        'question.alcohol_use_practitioner_analysis_risk_of_reoffending.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_practitioner_analysis_risk_of_reoffending.validation'),
    }),
  ],
})

export const alcoholSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [alcoholSummary, goToPractitionerAnalysisButton(Step.alcohol_use_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          alcoholStrengthsProtectiveFactors,
          alcoholLinkedToSeriousHarm,
          alcoholLinkedReoffending,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
