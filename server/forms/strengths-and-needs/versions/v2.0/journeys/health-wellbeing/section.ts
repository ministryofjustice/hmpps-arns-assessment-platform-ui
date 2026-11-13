import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'

import { CaseData } from '../../../../constants/common'
import {
  checkboxField,
  question,
  QuestionFormat,
  radioField,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import { itemisedSummaryRow, optionalDetails, requiredDetails, yesNo } from '../../constants/questionContent'
import { CommonOption } from '../../constants/commonOption'

// The physical treatment question only applies once physical health conditions
// are confirmed; the mental treatment questions apply unless mental health
// problems are ruled out (or unknown).
const mayHaveMentalHealthConditions = Answer(Question.health_wellbeing_any_mental_health_conditions).match(
  Condition.Equals(CommonOption.yes),
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
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_status.path }),
  },
})

const anyMentalHealthConditions = question({
  content: {
    code: Question.health_wellbeing_any_mental_health_conditions,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_any_mental_health_conditions.text', CaseData.Forename),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.health_wellbeing_any_mental_health_conditions.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_status.path }),
  },
})

const mentalHealthProblems = question({
  content: {
    code: Question.health_wellbeing_mental_health_condition,
    format: QuestionFormat.RADIO,
    text: contentFor('question.health_wellbeing_mental_health_condition.text', CaseData.ForenamePossessive),
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
      {
        value: Option.undiagnosed,
        text: contentFor('question.health_wellbeing_mental_health_condition.option.UNDIAGNOSED'),
        reveals: optionalDetails({ code: Question.health_wellbeing_mental_health_condition_undiagnosed_details }),

      },
    ],
    validationMessage: contentFor('question.health_wellbeing_mental_health_condition.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: mayHaveMentalHealthConditions, visibleWhen: mayHaveMentalHealthConditions }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.health_wellbeing_details.path,
      visibleWhen: Answer(Question.health_wellbeing_mental_health_condition).match(Condition.IsRequired()),
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
    field: radioField({ dependentWhen: mayHaveMentalHealthConditions, visibleWhen: mayHaveMentalHealthConditions }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.health_wellbeing_details.path,
      visibleWhen: Answer(Question.health_wellbeing_psychiatric_treatment).match(Condition.IsRequired()),
    }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
  },
})

const gambling = question({
  content: {
    code: Question.health_wellbeing_gambling,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.health_wellbeing_gambling.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.yes_their_gambling,
        text: contentFor('question.health_wellbeing_gambling.option.YES_THEIR_GAMBLING'),
        reveals: optionalDetails({ code: Question.health_wellbeing_gambling_yes_their_gambling_details }),
      },
      {
        value: Option.yes_someone_elses_gambling,
        text: contentFor('question.health_wellbeing_gambling.option.YES_SOMEONE_ELSES_GAMBLING'),
        reveals: optionalDetails({ code: Question.health_wellbeing_gambling_yes_someone_elses_gambling_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.no, text: commonContentFor('option.NO'), behaviour: 'exclusive' as const },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        behaviour: 'exclusive' as const,
        reveals: optionalDetails({ code: Question.health_wellbeing_gambling_unknown_details }),
      },
    ],
    validationMessage: contentFor('question.health_wellbeing_gambling.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_details.path }),
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
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.health_wellbeing_want_to_make_changes.path }),
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
      changeHref: Step.health_wellbeing_summary.path,
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
      changeHref: Step.health_wellbeing_summary.path,
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
      changeHref: Step.health_wellbeing_summary.path,
    }),
  },
})

export const healthWellbeingSection = {
  code: Section.health_and_wellbeing.code,
  questions: {
    healthConditions,
    anyMentalHealthConditions,
    mentalHealthProblems,
    psychiatricTreatment,
    impactOnLearningAbilities,
    copeWithDayToDayLife,
    gambling,
    attitudeTowardsSelf,
    selfHarm,
    suicidalTendencies,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
