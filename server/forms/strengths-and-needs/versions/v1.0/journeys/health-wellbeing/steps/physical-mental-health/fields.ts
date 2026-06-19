import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKRadioInput
} from "@ministryofjustice/hmpps-forge/govuk-components";
import locale from "../../locale.json";
import {and, Answer, Condition, Format, not, or, Self, validation} from "@ministryofjustice/hmpps-forge/core/authoring";
import {CaseData} from "../../../../constants/formVersion";
import {Question} from "../../constants/question";

// --- Prescribed physical health treatments Group ---

export const prescribedPhysicalHealthMedicationsTreatments = GovUKCharacterCount({
  code: Question.prescribed_physical_health_medications_treatments,
  label: {
    text: Format(locale.phyisical_mental_health.prescribed_physical_health_medications_treatments.text, CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: Answer(Question.health_conditions).match(Condition.Equals('YES')),
  dependentWhen: Answer(Question.health_conditions).match(Condition.Equals('YES')),
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
        Answer(Question.mental_health_problems).match(Condition.Equals('NO')),
        Answer(Question.mental_health_problems).match(Condition.Equals('UNKNOWN')),
      )
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals('NO')),
      Answer(Question.mental_health_problems).match(Condition.Equals('UNKNOWN')),
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
    { value: 'YES', text: locale.options.YES },
    { value: 'PENDING_TREATMENT', text: locale.options.PENDING_TREATMENT},
    { value: 'NO', text: locale.options.NO },
    { value: 'UNKNOWN', text: locale.options.UNKNOWN }
  ],
  visibleWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals('NO')),
      Answer(Question.mental_health_problems).match(Condition.Equals('UNKNOWN')),
    )
  ),
  dependentWhen: not(
    or(
      Answer(Question.mental_health_problems).match(Condition.Equals('NO')),
      Answer(Question.mental_health_problems).match(Condition.Equals('UNKNOWN')),
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
    { value: 'YES', text: locale.options.YES },
    { value: 'NO', text: locale.options.NO },
    { value: 'UNKNOWN', text: locale.options.UNKNOWN }
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
    { value: 'YES', text: locale.options.YES, block: neurodiverseConditionsDetails },
    { value: 'NO', text: locale.options.NO },
    { value: 'UNKNOWN', text: locale.options.UNKNOWN }
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
    { value: 'YES_LEARNING_SIGNIFICANTLY_IMPACTED', text: locale.options.YES_LEARNING_SIGNIFICANTLY_IMPACTED, block: learningAbilitiesImpactedSignificantlyDetails },
    { value: 'YES_LEARNING_SLIGHTLY_IMPACTED', text: locale.options.YES_LEARNING_SLIGHTLY_IMPACTED, block: learningAbilitiesImpactedSlightlyDetails},
    { value: 'NO_LEARNING_ABILITIES_IMPACT', text: locale.options.NO_LEARNING_ABILITIES_IMPACT },
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
    { value: 'YES_ABLE_TO_COPE', text: locale.options.YES_ABLE_TO_COPE },
    { value: 'HAS_DIFFICULTIES_COPING', text: locale.options.HAS_DIFFICULTIES_COPING },
    { value: 'NOT_ABLE_TO_COPE', text: locale.options.NOT_ABLE_TO_COPE },
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
    { value: 'POSITIVE_REASONABLY_HAPPY', text: locale.options.POSITIVE_REASONABLY_HAPPY },
    { value: 'WOULD_LIKE_TO_CHANGE_ASPECTS', text: locale.options.WOULD_LIKE_TO_CHANGE_ASPECTS },
    { value: 'NEGATIVE_UNHAPPY', text: locale.options.NEGATIVE_UNHAPPY, hint:'This includes if they have an overly positive or unrealistic self-image which in reality is not true.' },
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
    { value: 'YES', text: locale.options.YES, block: selfHarmDetails },
    { value: 'NO', text: locale.options.NO },
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
    Answer(Question.suicidal_tendencies).match(Condition.Equals('YES'))),
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
    { value: 'YES', text: locale.options.YES, block: suicidalTendenciesDetails },
    { value: 'NO', text: locale.options.NO },
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
    { value: 'OPTIMISTIC_OUTLOOK', text: locale.options.OPTIMISTIC_OUTLOOK },
    { value: 'UNSURE_OUTLOOK', text: locale.options.UNSURE_OUTLOOK },
    { value: 'NOT_OPTIMISTIC_OUTLOOK', text: locale.options.NOT_OPTIMISTIC_OUTLOOK },
    { divider: 'or' },
    { value: 'DOES_NOT_WANT_TO_ANSWER', text: Format(locale.options.DOES_NOT_WANT_TO_ANSWER, CaseData.Forename) },
    { value: 'NOT_PRESENT', text: Format(locale.options.NOT_PRESENT, CaseData.Forename) },
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
      Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('OTHER'))
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
    { value: 'ACCOMMODATION', text: locale.options.ACCOMMODATION },
    { value: 'EMPLOYMENT', text: locale.options.EMPLOYMENT },
    { value: 'FAITH_RELIGION', text: locale.options.FAITH_RELIGION },
    { value: 'FEELING_PART_OF_COMMUNITY', text: locale.options.FEELING_PART_OF_COMMUNITY },
    { value: 'MEDICATION_OR_TREATMENT', text: locale.options.MEDICATION_OR_TREATMENT },
    { value: 'MONEY', text: locale.options.MONEY },
    { value: 'RELATIONSHIPS', text: locale.options.RELATIONSHIPS },
    { value: 'OTHER', text: locale.options.OTHER, block: helpedDuringPeriodsGoodHealthWellbeingDetails},
  ],
})

// --- Changes to health wellbeing Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('HAS_MADE_CHANGES')),
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('IS_MAKING_CHANGES')),
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO')),
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('WANTS_TO_MAKE_CHANGES_NEEDS_HELP')),
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('THINKING_ABOUT_MAKING_CHANGES')),
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('DOES_NOT_WANT_TO_MAKE_CHANGES')),
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.changes_to_health_wellbeing).match(Condition.Equals('DO_NOT_WANT_TO_ANSWER')),
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
    { value: 'HAS_MADE_CHANGES', text: locale.options.HAS_MADE_CHANGES, block: hasMadePositiveChangesDetails },
    { value: 'IS_MAKING_CHANGES', text: locale.options.IS_MAKING_CHANGES, block: isActivelyMakingChangesDetails },
    { value: 'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO', text: locale.options.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO, block: wantsToMakeChangesKnowsHowDetails },
    { value: 'WANTS_TO_MAKE_CHANGES_NEEDS_HELP', text: locale.options.WANTS_TO_MAKE_CHANGES_NEEDS_HELP, block: wantsToMakeChangesNeedsHelpDetails },
    { value: 'THINKING_ABOUT_MAKING_CHANGES', text: locale.options.THINKING_ABOUT_MAKING_CHANGES, block: thinkingAboutMakingChangesDetails },
    { value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', text: locale.options.DOES_NOT_WANT_TO_MAKE_CHANGES, block: doesNotWantToMakeChangesDetails },
    { value: 'DO_NOT_WANT_TO_ANSWER', text: locale.options.DO_NOT_WANT_TO_ANSWER, block: doesNotWantToAnswerChangesDetails },
    { divider: 'or' },
    { value: 'NOT_PRESENT', text: Format(locale.options.NOT_PRESENT, CaseData.Forename) },
    { value: 'NOT_APPLICABLE', text: locale.options.NOT_APPLICABLE },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their health and wellbeing',
    }),
  ],
})
