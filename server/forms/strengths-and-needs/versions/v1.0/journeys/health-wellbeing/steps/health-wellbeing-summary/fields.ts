import { and, Answer, block, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKCharacterCount,
  GovUKLinkButton,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { SANGenerators } from '../../../../../../generators'
import { healthConditions, mentalHealthProblems } from '../health-wellbeing/fields'
import {
  attitudeTowardsSelf,
  changesToHealthWellbeing,
  copeWithDayToDayLife,
  feelingsAboutFuture,
  headInjuries,
  helpedDuringPeriodsGoodHealthWellbeing,
  impactOnLearningAbilities,
  neurodiverseConditions,
  psychiatricTreatment,
  selfHarm,
  suicidalTendencies,
} from '../physical-mental-health/fields'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'

// --- Health and Wellbeing Summary Group ---

export const healthWellbeingSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.health_conditions.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(healthConditions.items, Answer(Question.health_conditions)),
          }),
          GovUKBody({ text: Answer(Question.has_health_conditions_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'health-wellbeing', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.health_conditions.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              mentalHealthProblems.items,
              Answer(Question.mental_health_problems),
            ),
          }),
          GovUKBody({ text: Answer(Question.severe_mental_health_problems_details), size: 's' }),
          GovUKBody({ text: Answer(Question.ongoing_duration_unknown_mental_health_problems_details), size: 's' }),
          GovUKBody({ text: Answer(Question.past_mental_health_problems_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'health-wellbeing', text: 'Change' }],
      },
    },
    {
      key: {
        text: contentFor(
          'question.prescribed_physical_health_medications_treatments.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [GovUKBody({ text: Answer(Question.prescribed_physical_health_medications_treatments), size: 's' })],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
      visibleWhen: Answer(Question.prescribed_physical_health_medications_treatments).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor('question.prescribed_mental_health_medications_treatments.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [GovUKBody({ text: Answer(Question.prescribed_mental_health_medications_treatments), size: 's' })],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
      visibleWhen: Answer(Question.prescribed_mental_health_medications_treatments).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.psychiatric_treatment.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              psychiatricTreatment.items,
              Answer(Question.psychiatric_treatment),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
      visibleWhen: Answer(Question.psychiatric_treatment).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.head_injuries.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(headInjuries.items, Answer(Question.head_injuries)),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
      visibleWhen: Answer(Question.head_injuries).match(Condition.IsRequired()),
    },
    {
      key: { text: contentFor('question.neurodiverse_conditions.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              neurodiverseConditions.items,
              Answer(Question.neurodiverse_conditions),
            ),
          }),
          GovUKBody({ text: Answer(Question.neurodiverse_conditions_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.impact_on_learning_abilities.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              impactOnLearningAbilities.items,
              Answer(Question.impact_on_learning_abilities),
            ),
            visibleWhen: Answer(Question.impact_on_learning_abilities).match(Condition.IsRequired()),
          }),
          GovUKBody({
            text: Answer(Question.learning_abilities_impacted_significantly_details),
            size: 's',
            visibleWhen: Answer(Question.learning_abilities_impacted_significantly_details).match(
              Condition.String.HasMinLength(1),
            ),
          }),
          GovUKBody({
            text: Answer(Question.learning_abilities_impacted_slightly_details),
            size: 's',
            visibleWhen: Answer(Question.learning_abilities_impacted_slightly_details).match(
              Condition.String.HasMinLength(1),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.cope_with_day_to_day_life.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              copeWithDayToDayLife.items,
              Answer(Question.cope_with_day_to_day_life),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.attitude_towards_self.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              attitudeTowardsSelf.items,
              Answer(Question.attitude_towards_self),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.self_harm.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({ text: SANGenerators.getTextFromListDefinition(selfHarm.items, Answer(Question.self_harm)) }),
          GovUKBody({
            text: Answer(Question.self_harm_details),
            size: 's',
            visibleWhen: Answer(Question.self_harm_details).match(Condition.IsRequired()),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.suicidal_tendencies.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              suicidalTendencies.items,
              Answer(Question.suicidal_tendencies),
            ),
          }),
          GovUKBody({
            text: Answer(Question.suicidal_tendencies_details),
            size: 's',
            visibleWhen: Answer(Question.suicidal_tendencies_details).match(Condition.IsRequired()),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.feeling_about_future_health_wellbeing.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              feelingsAboutFuture.items,
              Answer(Question.feeling_about_future_health_wellbeing),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: {
        text: contentFor('question.helped_during_periods_good_health_wellbeing.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.accommodation,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.accommodation),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.employment,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.employment),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.faith_religion,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.faith_religion),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.feeling_part_of_community,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.feeling_part_of_community),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.medication_or_treatment,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.medication_or_treatment),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, Option.money),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.money),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              helpedDuringPeriodsGoodHealthWellbeing.items,
              Option.relationships,
            ),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.relationships),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, Option.other),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(
              Condition.Array.Contains(Option.other),
            ),
          }),
          GovUKBody({ text: Answer(Question.helped_during_periods_good_health_wellbeing_details), size: 's' }),
        ],
      },
      visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.IsRequired()),
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
    {
      key: { text: contentFor('question.changes_to_health_wellbeing.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              changesToHealthWellbeing.items,
              Answer(Question.changes_to_health_wellbeing),
            ),
          }),
          GovUKBody({ text: Answer(Question.has_made_positive_changes_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.actively_making_changes_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.wants_to_make_changes_knows_how_to_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.wants_to_make_changes_needs_help_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.thinking_about_making_changes_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.does_not_want_to_make_changes_health_wellbeing_details), size: 's' }),
          GovUKBody({ text: Answer(Question.does_not_want_to_answer_health_wellbeing_details), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'physical-mental-health', text: 'Change' }],
      },
    },
  ],
})

// --- Practitioner Analysis Button Group ---

const goToPractitionerAnalysis = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href: 'health-wellbeing-summary#practitioner-analysis',
  classes: 'govuk-button--secondary',
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.strengths_protective_factors_health_wellbeing_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.IsRequired()),
    Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.Equals(Option.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.strengths_protective_factors_health_wellbeing_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.no_strengths_protective_factors_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.Equals(Option.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const strengthsProtectiveFactorsHealthWellbeing = GovUKRadioInput({
  code: Question.strengths_protective_factors_health_wellbeing,
  fieldset: {
    legend: {
      text: contentFor('question.strengths_protective_factors_health_wellbeing.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.strengths_protective_factors_health_wellbeing.hint'),
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: Option.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.strengths_protective_factors_health_wellbeing.validation'),
    }),
  ],
})

// --- Employment and Education Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.serious_harm_health_wellbeing_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.serious_harm_health_wellbeing).match(Condition.IsRequired()),
    Answer(Question.serious_harm_health_wellbeing).match(Condition.Equals(Option.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on the risk of serious harm',
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.no_serious_harm_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.serious_harm_health_wellbeing).match(Condition.Equals(Option.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const seriousHarmHealthWellbeing = GovUKRadioInput({
  code: Question.serious_harm_health_wellbeing,
  fieldset: {
    legend: {
      text: contentFor('question.serious_harm_health_wellbeing.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: Option.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.serious_harm_health_wellbeing.validation'),
    }),
  ],
})

// --- Employment and Education Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.risk_of_reoffending_health_wellbeing_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.risk_of_reoffending_health_wellbeing).match(Condition.Equals(Option.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.risk_of_reoffending_health_wellbeing_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.no_risk_of_reoffending_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.risk_of_reoffending_health_wellbeing).match(Condition.Equals(Option.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const riskOfReoffendingHealthWellbeing = GovUKRadioInput({
  code: Question.risk_of_reoffending_health_wellbeing,
  fieldset: {
    legend: {
      text: contentFor('question.risk_of_reoffending_health_wellbeing.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: Option.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.risk_of_reoffending_health_wellbeing.validation'),
    }),
  ],
})

// --- Mark As Complete Button Group ---

const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as complete',
  name: 'action',
  value: 'save',
})

export const healthWellbeingSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [healthWellbeingSummary, goToPractitionerAnalysis] },
    },
    {
      id: 'practitioner-analysis',
      label: 'Practitioner analysis',
      panel: {
        blocks: [
          strengthsProtectiveFactorsHealthWellbeing,
          seriousHarmHealthWellbeing,
          riskOfReoffendingHealthWellbeing,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
