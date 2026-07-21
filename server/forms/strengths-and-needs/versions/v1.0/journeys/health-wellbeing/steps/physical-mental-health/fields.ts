import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKRadioInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { and, Answer, Condition, not, or, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'

// --- Prescribed physical health treatments Group ---

export const prescribedPhysicalHealthMedicationsTreatments = GovUKCharacterCount({
  code: Question.prescribed_physical_health_medications_treatments,
  label: {
    text: contentFor('question.prescribed_physical_health_medications_treatments.text', CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: Answer(Question.health_conditions).match(Condition.Equals(Option.yes)),
  dependentWhen: Answer(Question.health_conditions).match(Condition.Equals(Option.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

// --- Prescribed mental health treatments Group ---

export const prescribedMentalHealthMedicationsTreatments = GovUKCharacterCount({
  code: Question.prescribed_mental_health_medications_treatments,
  label: {
    text: contentFor('question.prescribed_mental_health_medications_treatments.text', CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    ),
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    ),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

// --- Prescribed psychiatric treatments Group ---

export const psychiatricTreatment = GovUKRadioInput({
  code: Question.psychiatric_treatment,
  fieldset: {
    legend: {
      text: contentFor('question.psychiatric_treatment.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: commonContentFor('option.YES') },
    { value: Option.pending_treatment, text: contentFor('question.psychiatric_treatment.option.PENDING_TREATMENT') },
    { value: Option.no, text: commonContentFor('option.NO') },
    { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  visibleWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    ),
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    ),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.psychiatric_treatment.validation'),
    }),
  ],
})

// --- Head injuries Group ---

export const headInjuries = GovUKRadioInput({
  code: Question.head_injuries,
  fieldset: {
    legend: {
      text: contentFor('question.head_injuries.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: {
    html: contentFor('question.head_injuries.hint'),
  },
  items: [
    { value: Option.yes, text: commonContentFor('option.YES') },
    { value: Option.no, text: commonContentFor('option.NO') },
    { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.head_injuries.validation'),
    }),
  ],
})

// --- Neurodiverse Group ---

const neurodiverseConditionsDetails = GovUKCharacterCount({
  code: Question.neurodiverse_conditions_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const neurodiverseConditions = GovUKRadioInput({
  code: Question.neurodiverse_conditions,
  fieldset: {
    legend: {
      text: contentFor('question.neurodiverse_conditions.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Include diagnosis and neurodiverse characteristics.',
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: neurodiverseConditionsDetails },
    { value: Option.no, text: commonContentFor('option.NO') },
    { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.neurodiverse_conditions.validation'),
    }),
  ],
})

// --- Learning abilities impact Group ---

const learningAbilitiesImpactedSignificantlyDetails = GovUKCharacterCount({
  code: Question.learning_abilities_impacted_significantly_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const learningAbilitiesImpactedSlightlyDetails = GovUKCharacterCount({
  code: Question.learning_abilities_impacted_slightly_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const impactOnLearningAbilities = GovUKRadioInput({
  code: Question.impact_on_learning_abilities,
  fieldset: {
    legend: {
      text: contentFor('question.impact_on_learning_abilities.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.impact_on_learning_abilities.hint'),
  items: [
    {
      value: Option.yes_learning_significantly_impacted,
      text: contentFor('question.impact_on_learning_abilities.option.YES_LEARNING_SIGNIFICANTLY_IMPACTED'),
      block: learningAbilitiesImpactedSignificantlyDetails,
    },
    {
      value: Option.yes_learning_slightly_impacted,
      text: contentFor('question.impact_on_learning_abilities.option.YES_LEARNING_SLIGHTLY_IMPACTED'),
      block: learningAbilitiesImpactedSlightlyDetails,
    },
    {
      value: Option.no_learning_abilities_impact,
      text: contentFor('question.impact_on_learning_abilities.option.NO_LEARNING_ABILITIES_IMPACT'),
    },
  ],
})

// --- Cope with daya to day life Group ---

export const copeWithDayToDayLife = GovUKRadioInput({
  code: Question.cope_with_day_to_day_life,
  fieldset: {
    legend: {
      text: contentFor('question.cope_with_day_to_day_life.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes_able_to_cope, text: contentFor('question.cope_with_day_to_day_life.option.YES_ABLE_TO_COPE') },
    {
      value: Option.has_difficulties_coping,
      text: contentFor('question.cope_with_day_to_day_life.option.HAS_DIFFICULTIES_COPING'),
    },
    { value: Option.not_able_to_cope, text: contentFor('question.cope_with_day_to_day_life.option.NOT_ABLE_TO_COPE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.cope_with_day_to_day_life.validation'),
    }),
  ],
})

// --- Attitude towards self Group ---

export const attitudeTowardsSelf = GovUKRadioInput({
  code: Question.attitude_towards_self,
  fieldset: {
    legend: {
      text: contentFor('question.attitude_towards_self.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: '',
  items: [
    {
      value: Option.positive_reasonably_happy,
      text: contentFor('question.attitude_towards_self.option.POSITIVE_REASONABLY_HAPPY'),
    },
    {
      value: Option.would_like_to_change_aspects,
      text: contentFor('question.attitude_towards_self.option.WOULD_LIKE_TO_CHANGE_ASPECTS'),
    },
    {
      value: Option.negative_unhappy,
      text: contentFor('question.attitude_towards_self.option.NEGATIVE_UNHAPPY.text'),
      hint: contentFor('question.attitude_towards_self.option.NEGATIVE_UNHAPPY.hint'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.attitude_towards_self.validation'),
    }),
  ],
})

// --- Self harm Group ---

const selfHarmDetails = GovUKCharacterCount({
  code: Question.self_harm_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.self_harm).match(Condition.IsRequired()),
    Answer(Question.self_harm).match(Condition.Equals(Option.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMinLength(1)),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const selfHarm = GovUKRadioInput({
  code: Question.self_harm,
  fieldset: {
    legend: {
      text: contentFor('question.self_harm.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: "Consider what factors or circumstances are associated and if it's recurring.",
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: selfHarmDetails },
    { value: Option.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.self_harm.validation'),
    }),
  ],
})

// --- Suicidal tendencies Group ---

const suicidalTendenciesDetails = GovUKCharacterCount({
  code: Question.suicidal_tendencies_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.suicidal_tendencies).match(Condition.IsRequired()),
    Answer(Question.suicidal_tendencies).match(Condition.Equals(Option.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const suicidalTendencies = GovUKRadioInput({
  code: Question.suicidal_tendencies,
  fieldset: {
    legend: {
      text: contentFor('question.suicidal_tendencies.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.suicidal_tendencies.hint'),
  items: [
    { value: Option.yes, text: commonContentFor('option.YES'), block: suicidalTendenciesDetails },
    { value: Option.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.suicidal_tendencies.validation'),
    }),
  ],
})

// --- Feelings about future Group ---

export const feelingsAboutFuture = GovUKRadioInput({
  code: Question.feeling_about_future_health_wellbeing,
  fieldset: {
    legend: {
      text: contentFor('question.feeling_about_future_health_wellbeing.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.feeling_about_future_health_wellbeing.hint', CaseData.Forename),
  items: [
    {
      value: Option.optimistic_outlook,
      text: contentFor('question.feeling_about_future_health_wellbeing.option.OPTIMISTIC_OUTLOOK'),
    },
    {
      value: Option.unsure_outlook,
      text: contentFor('question.feeling_about_future_health_wellbeing.option.UNSURE_OUTLOOK'),
    },
    {
      value: Option.not_optimistic_outlook,
      text: contentFor('question.feeling_about_future_health_wellbeing.option.NOT_OPTIMISTIC_OUTLOOK'),
    },
    { divider: commonContentFor('or') },
    {
      value: Option.does_not_want_to_answer,
      text: contentFor(
        'question.feeling_about_future_health_wellbeing.option.DOES_NOT_WANT_TO_ANSWER',
        CaseData.Forename,
      ),
    },
    {
      value: Option.not_present,
      text: contentFor('question.feeling_about_future_health_wellbeing.option.NOT_PRESENT', CaseData.Forename),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.feeling_about_future_health_wellbeing.validation'),
    }),
  ],
})

// --- Helped during periods of good health Group ---

const helpedDuringPeriodsGoodHealthWellbeingDetails = GovUKCharacterCount({
  code: Question.helped_during_periods_good_health_wellbeing_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.IsRequired()),
    Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains(Option.other)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('validation.risk_of_serious_harm_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const helpedDuringPeriodsGoodHealthWellbeing = GovUKCheckboxInput({
  code: Question.helped_during_periods_good_health_wellbeing,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.helped_during_periods_good_health_wellbeing.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: { html: contentFor('question.helped_during_periods_good_health_wellbeing.hint') },
  items: [
    {
      value: Option.accommodation,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.ACCOMMODATION'),
    },
    {
      value: Option.employment,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.EMPLOYMENT'),
    },
    {
      value: Option.faith_religion,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.FAITH_RELIGION'),
    },
    {
      value: Option.feeling_part_of_community,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.FEELING_PART_OF_COMMUNITY'),
    },
    {
      value: Option.medication_or_treatment,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.MEDICATION_OR_TREATMENT'),
    },
    { value: Option.money, text: contentFor('question.helped_during_periods_good_health_wellbeing.option.MONEY') },
    {
      value: Option.relationships,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.RELATIONSHIPS'),
    },
    {
      value: Option.other,
      text: contentFor('question.helped_during_periods_good_health_wellbeing.option.OTHER'),
      block: helpedDuringPeriodsGoodHealthWellbeingDetails,
    },
  ],
})

// --- Changes to health wellbeing Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.has_made_changes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.is_making_changes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(
    Condition.Equals(Option.wants_to_make_changes_knows_how_to),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(
    Condition.Equals(Option.wants_to_make_changes_needs_help),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(
    Condition.Equals(Option.thinking_about_making_changes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(
    Condition.Equals(Option.does_not_want_to_make_changes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_health_wellbeing_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.do_not_want_to_answer)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.two_thousand_characters_max'),
    }),
  ],
})

export const changesToHealthWellbeing = GovUKRadioInput({
  code: Question.changes_to_health_wellbeing,
  fieldset: {
    legend: {
      text: contentFor('question.changes_to_health_wellbeing.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.changes_to_health_wellbeing.hint', CaseData.Forename),
  items: [
    {
      value: Option.has_made_changes,
      text: contentFor('question.changes_to_health_wellbeing.option.HAS_MADE_CHANGES'),
      block: hasMadePositiveChangesDetails,
    },
    {
      value: Option.is_making_changes,
      text: contentFor('question.changes_to_health_wellbeing.option.IS_MAKING_CHANGES'),
      block: isActivelyMakingChangesDetails,
    },
    {
      value: Option.wants_to_make_changes_knows_how_to,
      text: contentFor('question.changes_to_health_wellbeing.option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: Option.wants_to_make_changes_needs_help,
      text: contentFor('question.changes_to_health_wellbeing.option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: Option.thinking_about_making_changes,
      text: contentFor('question.changes_to_health_wellbeing.option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: Option.does_not_want_to_make_changes,
      text: contentFor('question.changes_to_health_wellbeing.option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: Option.do_not_want_to_answer,
      text: contentFor('question.changes_to_health_wellbeing.option.DO_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: commonContentFor('or') },
    { value: Option.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: Option.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their health and wellbeing',
    }),
  ],
})
