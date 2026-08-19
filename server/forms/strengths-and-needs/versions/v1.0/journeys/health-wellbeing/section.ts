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
import { CommonOption } from '../../constants/commonOption'

// The physical treatment question only applies once physical health conditions
// are confirmed; the mental treatment questions apply unless mental health
// problems are ruled out (or unknown).
const hasPhysicalHealthConditions = Answer(Question.health_wellbeing_physical_health_condition).match(
  Condition.Equals(CommonOption.yes),
)
const mayHaveMentalHealthProblems = not(
  or(
    Answer(Question.health_wellbeing_mental_health_condition).match(Condition.Equals(CommonOption.no)),
    Answer(Question.health_wellbeing_mental_health_condition).match(Condition.Equals(CommonOption.unknown)),
  ),
)

const healthConditions = question({
  content: {
    code: Question.health_wellbeing_physical_health_condition,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_physical_health_condition.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_physical_health_condition_yes_details }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_physical_health_condition.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.health_wellbeing.path }),
  },
})

const mentalHealthProblems = question({
  content: {
    code: Question.health_wellbeing_mental_health_condition,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_mental_health_condition.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_ongoing_severe,
        text: contentFor('question.health_wellbeing_mental_health_condition.option.YES_ONGOING_SEVERE'),
        reveals: optionalDetails({
          code: Question.health_wellbeing_mental_health_condition_yes_ongoing_severe_details,
        }),
      },
      {
        value: Option.yes_ongoing,
        text: contentFor('question.health_wellbeing_mental_health_condition.option.YES_ONGOING'),
        reveals: optionalDetails({ code: Question.health_wellbeing_mental_health_condition_yes_ongoing_details }),
      },
      {
        value: Option.yes_in_the_past,
        text: contentFor('question.health_wellbeing_mental_health_condition.option.YES_IN_THE_PAST'),
        reveals: optionalDetails({ code: Question.health_wellbeing_mental_health_condition_yes_in_the_past_details }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_mental_health_condition.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.health_wellbeing.path }),
  },
})

const prescribedPhysicalHealthMedicationsTreatments = question({
  content: {
    code: Question.health_wellbeing_prescribed_medication_physical_conditions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.health_wellbeing_prescribed_medication_physical_conditions.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: hasPhysicalHealthConditions,
      visibleWhen: hasPhysicalHealthConditions,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.health_wellbeing_prescribed_medication_physical_conditions).match(
        Condition.IsRequired(),
      ),
    }),
  },
})

const prescribedMentalHealthMedicationsTreatments = question({
  content: {
    code: Question.health_wellbeing_prescribed_medication_mental_conditions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.health_wellbeing_prescribed_medication_mental_conditions.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: mayHaveMentalHealthProblems,
      visibleWhen: mayHaveMentalHealthProblems,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.health_wellbeing_prescribed_medication_mental_conditions).match(
        Condition.IsRequired(),
      ),
    }),
  },
})

const psychiatricTreatment = question({
  content: {
    code: Question.health_wellbeing_psychiatric_treatment,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_psychiatric_treatment.text', CaseData.Forename),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      {
        value: Option.pending_treatment,
        text: contentFor('question.health_wellbeing_psychiatric_treatment.option.PENDING_TREATMENT'),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_psychiatric_treatment.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: mayHaveMentalHealthProblems, visibleWhen: mayHaveMentalHealthProblems }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.health_wellbeing_psychiatric_treatment).match(Condition.IsRequired()),
    }),
  },
})

const headInjuries = question({
  content: {
    code: Question.health_wellbeing_head_injury_or_illness,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_head_injury_or_illness.text', CaseData.Forename),
    hint: { html: contentFor('question.health_wellbeing_head_injury_or_illness.hint') },
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_head_injury_or_illness.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.health_wellbeing_head_injury_or_illness).match(Condition.IsRequired()),
    }),
  },
})

const neurodiverseConditions = question({
  content: {
    code: Question.health_wellbeing_neurodiverse_conditions,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_neurodiverse_conditions.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_neurodiverse_conditions.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_neurodiverse_conditions_yes_details }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_neurodiverse_conditions.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const impactOnLearningAbilities = question({
  content: {
    code: Question.health_wellbeing_learning_difficulties,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_learning_difficulties.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_learning_difficulties.hint'),
    options: [
      {
        value: Option.yes_significant_difficulties,
        text: contentFor('question.health_wellbeing_learning_difficulties.option.YES_SIGNIFICANT_DIFFICULTIES'),
        reveals: optionalDetails({
          code: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details,
        }),
      },
      {
        value: Option.yes_some_difficulties,
        text: contentFor('question.health_wellbeing_learning_difficulties.option.YES_SOME_DIFFICULTIES'),
        reveals: optionalDetails({
          code: Question.health_wellbeing_learning_difficulties_yes_some_difficulties_details,
        }),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.health_wellbeing_learning_difficulties.option.NO'),
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
    code: Question.health_wellbeing_coping_day_to_day_life,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_coping_day_to_day_life.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.health_wellbeing_coping_day_to_day_life.option.YES'),
      },
      {
        value: Option.yes_some_difficulties,
        text: contentFor('question.health_wellbeing_coping_day_to_day_life.option.YES_SOME_DIFFICULTIES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.health_wellbeing_coping_day_to_day_life.option.NO'),
      },
    ],
    validationMessage: contentFor('question.health_wellbeing_coping_day_to_day_life.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const attitudeTowardsSelf = question({
  content: {
    code: Question.health_wellbeing_attitude_towards_self,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_attitude_towards_self.text', CaseData.ForenamePossessive),
    options: [
      {
        value: Option.positive,
        text: contentFor('question.health_wellbeing_attitude_towards_self.option.POSITIVE'),
      },
      {
        value: Option.some_negative_aspects,
        text: contentFor('question.health_wellbeing_attitude_towards_self.option.SOME_NEGATIVE_ASPECTS'),
      },
      {
        value: Option.negative,
        text: contentFor('question.health_wellbeing_attitude_towards_self.option.NEGATIVE.text'),
        hint: contentFor('question.health_wellbeing_attitude_towards_self.option.NEGATIVE.hint'),
      },
    ],
    validationMessage: contentFor('question.health_wellbeing_attitude_towards_self.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const selfHarm = question({
  content: {
    code: Question.health_wellbeing_self_harmed,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_self_harmed.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_self_harmed.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.health_wellbeing_self_harmed_yes_details,
        validationMessage: commonContentFor('validation.enter_details'),
      }),
    }),
    validationMessage: contentFor('question.health_wellbeing_self_harmed.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const suicidalTendencies = question({
  content: {
    code: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_attempted_suicide_or_suicidal_thoughts.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_attempted_suicide_or_suicidal_thoughts.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details,
        validationMessage: commonContentFor('validation.enter_details'),
      }),
    }),
    validationMessage: contentFor('question.health_wellbeing_attempted_suicide_or_suicidal_thoughts.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const feelingsAboutFuture = question({
  content: {
    code: Question.health_wellbeing_outlook,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_outlook.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_outlook.hint', CaseData.Forename),
    options: [
      {
        value: Option.optimistic,
        text: contentFor('question.health_wellbeing_outlook.option.OPTIMISTIC'),
      },
      {
        value: Option.not_sure,
        text: contentFor('question.health_wellbeing_outlook.option.NOT_SURE'),
      },
      {
        value: Option.not_optimistic,
        text: contentFor('question.health_wellbeing_outlook.option.NOT_OPTIMISTIC'),
      },
      { divider: commonContentFor('or') },
      {
        value: CommonOption.does_not_want_to_answer,
        text: contentFor('question.health_wellbeing_outlook.option.DOES_NOT_WANT_TO_ANSWER', CaseData.Forename),
      },
      {
        value: CommonOption.not_present,
        text: commonContentFor('option.NOT_PRESENT', CaseData.Forename),
      },
    ],
    validationMessage: contentFor('question.health_wellbeing_outlook.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const helpedDuringPeriodsGoodHealthWellbeing = question({
  content: {
    code: Question.health_wellbeing_positive_factors,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.health_wellbeing_positive_factors.text', CaseData.Forename),
    hint: { html: contentFor('question.health_wellbeing_positive_factors.hint') },
    options: [
      {
        value: Option.accommodation,
        text: contentFor('question.health_wellbeing_positive_factors.option.ACCOMMODATION'),
      },
      {
        value: Option.employment,
        text: contentFor('question.health_wellbeing_positive_factors.option.EMPLOYMENT'),
      },
      {
        value: Option.faith_or_religion,
        text: contentFor('question.health_wellbeing_positive_factors.option.FAITH_OR_RELIGION'),
      },
      {
        value: Option.community,
        text: contentFor('question.health_wellbeing_positive_factors.option.COMMUNITY'),
      },
      {
        value: Option.medication_or_treatment,
        text: contentFor('question.health_wellbeing_positive_factors.option.MEDICATION_OR_TREATMENT'),
      },
      { value: Option.money, text: contentFor('question.health_wellbeing_positive_factors.option.MONEY') },
      {
        value: Option.relationships,
        text: contentFor('question.health_wellbeing_positive_factors.option.RELATIONSHIPS'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.health_wellbeing_positive_factors_other_details,
          validationMessage: contentFor('validation.risk_of_serious_harm_details'),
        }),
      },
    ],
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.physical_mental_health.path,
      visibleWhen: Answer(Question.health_wellbeing_positive_factors).match(Condition.IsRequired()),
    }),
  },
})

const changes = question({
  content: {
    code: Question.health_wellbeing_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_changes.text', CaseData.Forename),
    hint: contentFor('question.health_wellbeing_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.health_wellbeing_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.health_wellbeing_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.physical_mental_health.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
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
    code: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.health_wellbeing_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.health_wellbeing_practitioner_analysis_risk_of_serious_harm.validation'),
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
    code: Question.health_wellbeing_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.health_wellbeing_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.health_wellbeing_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.health_wellbeing_practitioner_analysis_risk_of_reoffending.validation'),
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
  questions: {
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
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
