import { Answer, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'

import { CaseData } from '../../constants/formVersion'
import { CharacterLimit } from '../../constants/characterLimit'
import {
  characterCountField,
  checkboxField,
  itemisedSummaryRow,
  optionalDetails,
  question,
  QuestionFormat,
  radioField,
  requiredDetails,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'

// The physical treatment question only applies once physical health conditions
// are confirmed; the mental treatment questions apply unless mental health
// problems are ruled out (or unknown).
const hasPhysicalHealthConditions = Answer(Question.health_conditions).match(Condition.Equals(Option.yes))
const mayHaveMentalHealthProblems = not(
  or(
    Answer(Question.mental_health_problems).match(Condition.Equals(Option.no)),
    Answer(Question.mental_health_problems).match(Condition.Equals(Option.unknown)),
  ),
)

const healthConditions = question({
  content: {
    code: Question.health_conditions,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_conditions.text', CaseData.Forename),
    options: [
      {
        value: Option.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({ code: Question.has_health_conditions_details }),
      },
      { value: Option.no, text: commonContentFor('option.NO') },
      { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_conditions.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.health_wellbeing.path }),
  },
})

const mentalHealthProblems = question({
  content: {
    code: Question.mental_health_problems,
    format: QuestionFormat.RADIO,
    text: contentFor('question.mental_health_problems.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_ongoing_severe,
        text: contentFor('question.mental_health_problems.option.YES_ONGOING_SEVERE'),
        reveals: optionalDetails({ code: Question.severe_mental_health_problems_details }),
      },
      {
        value: Option.yes_ongoing_duration_unknown,
        text: contentFor('question.mental_health_problems.option.YES_ONGOING_DURATION_UNKNOWN'),
        reveals: optionalDetails({ code: Question.ongoing_duration_unknown_mental_health_problems_details }),
      },
      {
        value: Option.yes_past,
        text: contentFor('question.mental_health_problems.option.YES_PAST'),
        reveals: optionalDetails({ code: Question.past_mental_health_problems_details }),
      },
      { value: Option.no, text: commonContentFor('option.NO') },
      { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.mental_health_problems.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.health_wellbeing.path }),
  },
})

const prescribedPhysicalHealthMedicationsTreatments = question({
  content: {
    code: Question.prescribed_physical_health_medications_treatments,
    format: QuestionFormat.TEXT,
    text: contentFor('question.prescribed_physical_health_medications_treatments.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: hasPhysicalHealthConditions,
      visibleWhen: hasPhysicalHealthConditions,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.prescribed_physical_health_medications_treatments).match(Condition.IsRequired()),
    }),
  },
})

const prescribedMentalHealthMedicationsTreatments = question({
  content: {
    code: Question.prescribed_mental_health_medications_treatments,
    format: QuestionFormat.TEXT,
    text: contentFor('question.prescribed_mental_health_medications_treatments.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: mayHaveMentalHealthProblems,
      visibleWhen: mayHaveMentalHealthProblems,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.prescribed_mental_health_medications_treatments).match(Condition.IsRequired()),
    }),
  },
})

const psychiatricTreatment = question({
  content: {
    code: Question.psychiatric_treatment,
    format: QuestionFormat.RADIO,
    text: contentFor('question.psychiatric_treatment.text', CaseData.Forename),
    options: [
      { value: Option.yes, text: commonContentFor('option.YES') },
      { value: Option.pending_treatment, text: contentFor('question.psychiatric_treatment.option.PENDING_TREATMENT') },
      { value: Option.no, text: commonContentFor('option.NO') },
      { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.psychiatric_treatment.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: mayHaveMentalHealthProblems, visibleWhen: mayHaveMentalHealthProblems }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.psychiatric_treatment).match(Condition.IsRequired()),
    }),
  },
})

const headInjuries = question({
  content: {
    code: Question.head_injuries,
    format: QuestionFormat.RADIO,
    text: contentFor('question.head_injuries.text', CaseData.Forename),
    hint: { html: contentFor('question.head_injuries.hint') },
    options: [
      { value: Option.yes, text: commonContentFor('option.YES') },
      { value: Option.no, text: commonContentFor('option.NO') },
      { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.head_injuries.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.head_injuries).match(Condition.IsRequired()),
    }),
  },
})

const neurodiverseConditions = question({
  content: {
    code: Question.neurodiverse_conditions,
    format: QuestionFormat.RADIO,
    text: contentFor('question.neurodiverse_conditions.text', CaseData.Forename),
    hint: contentFor('question.neurodiverse_conditions.hint'),
    options: [
      {
        value: Option.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({ code: Question.neurodiverse_conditions_details }),
      },
      { value: Option.no, text: commonContentFor('option.NO') },
      { value: Option.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.neurodiverse_conditions.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const impactOnLearningAbilities = question({
  content: {
    code: Question.impact_on_learning_abilities,
    format: QuestionFormat.RADIO,
    text: contentFor('question.impact_on_learning_abilities.text', CaseData.Forename),
    hint: contentFor('question.impact_on_learning_abilities.hint'),
    options: [
      {
        value: Option.yes_learning_significantly_impacted,
        text: contentFor('question.impact_on_learning_abilities.option.YES_LEARNING_SIGNIFICANTLY_IMPACTED'),
        reveals: optionalDetails({ code: Question.learning_abilities_impacted_significantly_details }),
      },
      {
        value: Option.yes_learning_slightly_impacted,
        text: contentFor('question.impact_on_learning_abilities.option.YES_LEARNING_SLIGHTLY_IMPACTED'),
        reveals: optionalDetails({ code: Question.learning_abilities_impacted_slightly_details }),
      },
      {
        value: Option.no_learning_abilities_impact,
        text: contentFor('question.impact_on_learning_abilities.option.NO_LEARNING_ABILITIES_IMPACT'),
      },
    ],
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const copeWithDayToDayLife = question({
  content: {
    code: Question.cope_with_day_to_day_life,
    format: QuestionFormat.RADIO,
    text: contentFor('question.cope_with_day_to_day_life.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_able_to_cope,
        text: contentFor('question.cope_with_day_to_day_life.option.YES_ABLE_TO_COPE'),
      },
      {
        value: Option.has_difficulties_coping,
        text: contentFor('question.cope_with_day_to_day_life.option.HAS_DIFFICULTIES_COPING'),
      },
      {
        value: Option.not_able_to_cope,
        text: contentFor('question.cope_with_day_to_day_life.option.NOT_ABLE_TO_COPE'),
      },
    ],
    validationMessage: contentFor('question.cope_with_day_to_day_life.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const attitudeTowardsSelf = question({
  content: {
    code: Question.attitude_towards_self,
    format: QuestionFormat.RADIO,
    text: contentFor('question.attitude_towards_self.text', CaseData.ForenamePossessive),
    options: [
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
    validationMessage: contentFor('question.attitude_towards_self.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const selfHarm = question({
  content: {
    code: Question.self_harm,
    format: QuestionFormat.RADIO,
    text: contentFor('question.self_harm.text', CaseData.Forename),
    hint: contentFor('question.self_harm.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.self_harm_details,
        validationMessage: commonContentFor('validation.enter_details'),
      }),
    }),
    validationMessage: contentFor('question.self_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const suicidalTendencies = question({
  content: {
    code: Question.suicidal_tendencies,
    format: QuestionFormat.RADIO,
    text: contentFor('question.suicidal_tendencies.text', CaseData.Forename),
    hint: contentFor('question.suicidal_tendencies.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.suicidal_tendencies_details,
        validationMessage: commonContentFor('validation.enter_details'),
      }),
    }),
    validationMessage: contentFor('question.suicidal_tendencies.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const feelingsAboutFuture = question({
  content: {
    code: Question.feeling_about_future_health_wellbeing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.feeling_about_future_health_wellbeing.text', CaseData.Forename),
    hint: contentFor('question.feeling_about_future_health_wellbeing.hint', CaseData.Forename),
    options: [
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
    validationMessage: contentFor('question.feeling_about_future_health_wellbeing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const helpedDuringPeriodsGoodHealthWellbeing = question({
  content: {
    code: Question.helped_during_periods_good_health_wellbeing,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.helped_during_periods_good_health_wellbeing.text', CaseData.Forename),
    hint: { html: contentFor('question.helped_during_periods_good_health_wellbeing.hint') },
    options: [
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
        reveals: requiredDetails({
          code: Question.helped_during_periods_good_health_wellbeing_details,
          validationMessage: contentFor('validation.risk_of_serious_harm_details'),
        }),
      },
    ],
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.IsRequired()),
    }),
  },
})

const changes = question({
  content: {
    code: Question.changes_to_health_wellbeing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.changes_to_health_wellbeing.text', CaseData.Forename),
    hint: contentFor('question.changes_to_health_wellbeing.hint', CaseData.Forename),
    options: [
      {
        value: Option.has_made_changes,
        text: contentFor('question.changes_to_health_wellbeing.option.HAS_MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.has_made_positive_changes_health_wellbeing_details }),
      },
      {
        value: Option.is_making_changes,
        text: contentFor('question.changes_to_health_wellbeing.option.IS_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.actively_making_changes_health_wellbeing_details }),
      },
      {
        value: Option.wants_to_make_changes_knows_how_to,
        text: contentFor('question.changes_to_health_wellbeing.option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
        reveals: optionalDetails({ code: Question.wants_to_make_changes_knows_how_to_health_wellbeing_details }),
      },
      {
        value: Option.wants_to_make_changes_needs_help,
        text: contentFor('question.changes_to_health_wellbeing.option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
        reveals: optionalDetails({ code: Question.wants_to_make_changes_needs_help_health_wellbeing_details }),
      },
      {
        value: Option.thinking_about_making_changes,
        text: contentFor('question.changes_to_health_wellbeing.option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.thinking_about_making_changes_health_wellbeing_details }),
      },
      {
        value: Option.does_not_want_to_make_changes,
        text: contentFor('question.changes_to_health_wellbeing.option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.does_not_want_to_make_changes_health_wellbeing_details }),
      },
      {
        value: Option.do_not_want_to_answer,
        text: contentFor('question.changes_to_health_wellbeing.option.DO_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.does_not_want_to_answer_health_wellbeing_details }),
      },
      { divider: commonContentFor('or') },
      { value: Option.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: Option.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.changes_to_health_wellbeing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.strengths_protective_factors_health_wellbeing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.strengths_protective_factors_health_wellbeing.text', CaseData.ForenamePossessive),
    hint: contentFor('question.strengths_protective_factors_health_wellbeing.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.strengths_protective_factors_health_wellbeing_details,
        validationMessage: contentFor('question.strengths_protective_factors_health_wellbeing_details.validation'),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.no_strengths_protective_factors_health_wellbeing_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.strengths_protective_factors_health_wellbeing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.health_wellbeing_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.serious_harm_health_wellbeing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.serious_harm_health_wellbeing.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.serious_harm_health_wellbeing_details,
        validationMessage: contentFor('question.serious_harm_health_wellbeing_details.validation'),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.no_serious_harm_health_wellbeing_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.serious_harm_health_wellbeing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.health_wellbeing_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.risk_of_reoffending_health_wellbeing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.risk_of_reoffending_health_wellbeing.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.risk_of_reoffending_health_wellbeing_details,
        validationMessage: contentFor('question.risk_of_reoffending_health_wellbeing_details.validation'),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.no_risk_of_reoffending_health_wellbeing_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.risk_of_reoffending_health_wellbeing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.health_wellbeing_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const healthWellbeingSection = {
  fields: {
    healthConditions,
    mentalHealthProblems,
    prescribedPhysicalHealthMedicationsTreatments,
    prescribedMentalHealthMedicationsTreatments,
    psychiatricTreatment,
    headInjuries,
    neurodiverseConditions,
    impactOnLearningAbilities,
    copeWithDayToDayLife,
    attitudeTowardsSelf,
    selfHarm,
    suicidalTendencies,
    feelingsAboutFuture,
    helpedDuringPeriodsGoodHealthWellbeing,
    changes,
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
