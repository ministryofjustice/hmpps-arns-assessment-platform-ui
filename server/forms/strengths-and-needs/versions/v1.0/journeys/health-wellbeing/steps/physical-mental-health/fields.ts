import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKRadioInput
} from "@ministryofjustice/hmpps-forge/govuk-components";
import locale from "../../locale.json";
import {and, Answer, Condition, Format, not, or, Self, validation} from "@ministryofjustice/hmpps-forge/core/authoring";
import {CaseData} from "../../../../constants/formVersion";
import {Question} from "../../constants/question";
import {Option} from "../../constants/option";
import {commonLocale} from "../../../../constants/locale";

// --- Prescribed physical health treatments Group ---

export const prescribedPhysicalHealthMedicationsTreatments = GovUKCharacterCount({
  code: Question.prescribed_physical_health_medications_treatments,
  label: {
    text: Format(locale.phyisical_mental_health.prescribed_physical_health_medications_treatments.text, CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: Answer(Question.health_conditions).match(Condition.Equals(Option.yes)),
  dependentWhen: Answer(Question.health_conditions).match(Condition.Equals(Option.yes)),
})

// --- Prescribed mental health treatments Group ---

export const prescribedMentalHealthMedicationsTreatments = GovUKCharacterCount({
  code: Question.prescribed_mental_health_medications_treatments,
  label: {
    text: Format(locale.phyisical_mental_health.prescribed_mental_health_medications_treatments.text, CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: not(
      or(
        Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
        Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
      )
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    )
  ),
})

// --- Prescribed psychiatric treatments Group ---

export const psychiatricTreatment = GovUKRadioInput({
  code: Question.psychiatric_treatment,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.psychiatric_treatment.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.options.YES },
    { value: Option.pending_treatment, text: locale.options.PENDING_TREATMENT},
    { value: Option.no, text: locale.options.NO },
    { value: Option.unknown, text: locale.options.UNKNOWN }
  ],
  visibleWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    )
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
      Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
    )
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they are currently having psychiatric treatment",
    }),
  ],
})

// --- Head injuries Group ---

export const headInjuries = GovUKRadioInput({
  code: Question.head_injuries,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.head_injuries.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: {
    html:
      '<div class="govuk-grid-width-full">' +
      '<p class="govuk-hint">This includes:</p>' +
      '<ul class="govuk-hint govuk-list govuk-list--bullet">' +
      '<li>traumatic brain injury</li>' +
      '<li>acquired brain injury</li>' +
      '<li>having fits</li>'+
      '<li>significant episodes of unconsciousness as a result of a head injury</li>'+
      '</ul>'+
      '</div>'
  },
  items: [
    { value: Option.yes, text: locale.options.YES },
    { value: Option.no, text: locale.options.NO },
    { value: Option.unknown, text: locale.options.UNKNOWN }
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they have had a head injury or any illness affecting the brain",
    }),
  ],
})

// --- Neurodiverse Group ---

const neurodiverseConditionsDetails = GovUKCharacterCount({
  code: Question.neurodiverse_conditions_details,
  label: locale.optional_details,
  maxLength: 2000,
})

export const neurodiverseConditions = GovUKRadioInput({
  code: Question.neurodiverse_conditions,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.neurodiverse_conditions.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Include diagnosis and neurodiverse characteristics.',
  items: [
    { value: Option.yes, text: locale.options.YES, block: neurodiverseConditionsDetails },
    { value: Option.no, text: locale.options.NO },
    { value: Option.unknown, text: locale.options.UNKNOWN }
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they have any neurodiverse conditions",
    }),
  ],
})

// --- Learning abilities impact Group ---

const learningAbilitiesImpactedSignificantlyDetails = GovUKCharacterCount({
  code: Question.learning_abilities_impacted_significantly_details,
  label: locale.optional_details,
  maxLength: 2000,
})

const learningAbilitiesImpactedSlightlyDetails = GovUKCharacterCount({
  code: Question.learning_abilities_impacted_slightly_details,
  label: locale.optional_details,
  maxLength: 2000,
})

export const impactOnLearningAbilities = GovUKRadioInput({
  code: Question.impact_on_learning_abilities,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.impact_on_learning_abilities.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
  items: [
    { value: Option.yes_learning_significantly_impacted, text: locale.options.YES_LEARNING_SIGNIFICANTLY_IMPACTED, block: learningAbilitiesImpactedSignificantlyDetails },
    { value: Option.yes_learning_slightly_impacted, text: locale.options.YES_LEARNING_SLIGHTLY_IMPACTED, block: learningAbilitiesImpactedSlightlyDetails},
    { value: Option.no_learning_abilities_impact, text: locale.options.NO_LEARNING_ABILITIES_IMPACT },
  ],
})

// --- Cope with daya to day life Group ---

export const copeWithDayToDayLife = GovUKRadioInput({
  code: Question.cope_with_day_to_day_life,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.cope_with_day_to_day_life.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: '',
  items: [
    { value: Option.yes_able_to_cope, text: locale.options.YES_ABLE_TO_COPE },
    { value: Option.has_difficulties_coping, text: locale.options.HAS_DIFFICULTIES_COPING },
    { value: Option.not_able_to_cope, text: locale.options.NOT_ABLE_TO_COPE },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they are able to cope with day-to-day life",
    }),
  ],
})

// --- Attitude towards self Group ---

export const attitudeTowardsSelf = GovUKRadioInput({
  code: Question.attitude_towards_self,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.attitude_towards_self.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: '',
  items: [
    { value: Option.positive_reasonably_happy, text: locale.options.POSITIVE_REASONABLY_HAPPY },
    { value: Option.would_like_to_change_aspects, text: locale.options.WOULD_LIKE_TO_CHANGE_ASPECTS },
    { value: Option.negative_unhappy, text: locale.options.NEGATIVE_UNHAPPY, hint:'This includes if they have an overly positive or unrealistic self-image which in reality is not true.' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select their attitude towards themselves",
    }),
  ],
})

// --- Self harm Group ---

const selfHarmDetails = GovUKCharacterCount({
  code: Question.self_harm_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.self_harm).match(Condition.IsRequired()),
    Answer(Question.self_harm).match(Condition.Equals('YES'))),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMinLength(1)),
      message: 'Enter details',
    }),
  ],
})

export const selfHarm = GovUKRadioInput({
  code: Question.self_harm,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.self_harm.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Consider what factors or circumstances are associated and if it\'s recurring.',
  items: [
    { value: Option.yes, text: locale.options.YES, block: selfHarmDetails },
    { value: Option.no, text: locale.options.NO },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they have ever self-harmed",
    }),
  ],
})

// --- Suicidal tendencies Group ---

const suicidalTendenciesDetails = GovUKCharacterCount({
  code: Question.suicidal_tendencies_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.suicidal_tendencies).match(Condition.IsRequired()),
    Answer(Question.suicidal_tendencies).match(Condition.Equals(Option.yes))),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on the risk of serious harm',
    }),
  ],
})

export const suicidalTendencies = GovUKRadioInput({
  code: Question.suicidal_tendencies,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.suicidal_tendencies.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Consider what factors or circumstances are associated and if it\'s recurring.',
  items: [
    { value: Option.yes, text: locale.options.YES, block: suicidalTendenciesDetails },
    { value: Option.no, text: locale.options.NO },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select if they have ever attempted suicide or had suicidal thoughts",
    }),
  ],
})

// --- Feelings about future Group ---

export const feelingsAboutFuture = GovUKRadioInput({
  code: Question.feeling_about_future_health_wellbeing,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.feeling_about_future_health_wellbeing.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: Format('%1 must answer this question.', CaseData.Forename),
  items: [
    { value: Option.optimistic_outlook, text: locale.options.OPTIMISTIC_OUTLOOK },
    { value: Option.unsure_outlook, text: locale.options.UNSURE_OUTLOOK },
    { value: Option.not_optimistic_outlook, text: locale.options.NOT_OPTIMISTIC_OUTLOOK },
    { divider: commonLocale.or },
    { value: Option.does_not_want_to_answer, text: Format(locale.options.DOES_NOT_WANT_TO_ANSWER, CaseData.Forename) },
    { value: Option.not_present, text: Format(locale.options.NOT_PRESENT, CaseData.Forename) },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select how optimistic they are about their future",
    }),
  ],
})

// --- Helped during periods of good health Group ---

const helpedDuringPeriodsGoodHealthWellbeingDetails = GovUKCharacterCount({
  code: Question.helped_during_periods_good_health_wellbeing_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen:
    and(
      Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.IsRequired()),
      Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains(Option.other))
    ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on the risk of serious harm',
    }),
  ],
})

export const helpedDuringPeriodsGoodHealthWellbeing = GovUKCheckboxInput({
  code: Question.helped_during_periods_good_health_wellbeing,
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.helped_during_periods_good_health_wellbeing.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: {html: 'Consider what\'s helped them feel more hopeful.<br><br> Select all that apply.'},
  items: [
    { value: Option.accommodation, text: locale.options.ACCOMMODATION },
    { value: Option.employment, text: locale.options.EMPLOYMENT },
    { value: Option.faith_religion, text: locale.options.FAITH_RELIGION },
    { value: Option.feeling_part_of_community, text: locale.options.FEELING_PART_OF_COMMUNITY },
    { value: Option.medication_or_treatment, text: locale.options.MEDICATION_OR_TREATMENT },
    { value: Option.money, text: locale.options.MONEY },
    { value: Option.relationships, text: locale.options.RELATIONSHIPS },
    { value: Option.other, text: locale.options.OTHER, block: helpedDuringPeriodsGoodHealthWellbeingDetails},
  ],
})

// --- Changes to health wellbeing Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.has_made_changes)),
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.is_making_changes)),
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.wants_to_make_changes_knows_how_to)),
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.wants_to_make_changes_needs_help)),
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.thinking_about_making_changes)),
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.does_not_want_to_make_changes)),
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals(Option.do_not_want_to_answer)),
})

export const changesToHealthWellbeing = GovUKRadioInput({
  code: Question.changes_to_health_wellbeing,
  fieldset: {
    legend: {
      text: Format(locale.phyisical_mental_health.changes_to_health_wellbeing.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: Format('%1 must answer this question.', CaseData.Forename),
  items: [
    { value: Option.has_made_changes, text: locale.options.HAS_MADE_CHANGES, block: hasMadePositiveChangesDetails },
    { value: Option.is_making_changes, text: locale.options.IS_MAKING_CHANGES, block: isActivelyMakingChangesDetails },
    { value: Option.wants_to_make_changes_knows_how_to, text: locale.options.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO, block: wantsToMakeChangesKnowsHowDetails },
    { value: Option.wants_to_make_changes_needs_help, text: locale.options.WANTS_TO_MAKE_CHANGES_NEEDS_HELP, block: wantsToMakeChangesNeedsHelpDetails },
    { value: Option.thinking_about_making_changes, text: locale.options.THINKING_ABOUT_MAKING_CHANGES, block: thinkingAboutMakingChangesDetails },
    { value: Option.does_not_want_to_make_changes, text: locale.options.DOES_NOT_WANT_TO_MAKE_CHANGES, block: doesNotWantToMakeChangesDetails },
    { value: Option.do_not_want_to_answer, text: locale.options.DO_NOT_WANT_TO_ANSWER, block: doesNotWantToAnswerChangesDetails },
    { divider: commonLocale.or },
    { value: Option.not_present, text: Format(locale.options.NOT_PRESENT, CaseData.Forename) },
    { value: Option.not_applicable, text: locale.options.NOT_APPLICABLE },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their health and wellbeing',
    }),
  ],
})
