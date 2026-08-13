import { and, Answer, Condition, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../constants/formVersion'
import { CharacterLimit } from '../../constants/characterLimit'
import { CommonOption } from '../../constants/commonOption'
import {
  characterCountField,
  checkboxField,
  itemisedSummaryRow,
  optionalDetails,
  question,
  QuestionFormat,
  radioDetails,
  radioField,
  requiredDetails,
  revealedQuestion,
  SummaryRow,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { getDisplayTextForItems } from '../../../../i18n'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'

// The history and experience questions only apply once we know the person has
// been employed before (or their employment status implies it).
const hasBeenEmployed = or(
  Answer(Question.employment_status).match(Condition.Equals(Option.employed)),
  Answer(Question.has_been_employed_not_actively_seeking).match(Condition.Equals(CommonOption.yes)),
  Answer(Question.has_been_employed_actively_seeking).match(Condition.Equals(CommonOption.yes)),
  Answer(Question.has_been_employed_unavailable_for_work).match(Condition.Equals(CommonOption.yes)),
)

const hasBeenEmployedOrRetired = or(
  hasBeenEmployed,
  Answer(Question.employment_status).match(Condition.Equals(Option.retired)),
)

const isEmployedOrSelfEmployed = or(
  Answer(Question.employment_status).match(Condition.Equals(Option.employed)),
  Answer(Question.employment_status).match(Condition.Equals(Option.self_employed)),
)

const typeOfEmploymentRevealed = revealedQuestion({
  content: {
    code: Question.employment_type,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_type.text'),
    options: [
      { value: Option.full_time, text: contentFor('question.employment_type.option.FULL_TIME') },
      { value: Option.part_time, text: contentFor('question.employment_type.option.PART_TIME') },
      {
        value: Option.temporary_or_casual,
        text: contentFor('question.employment_type.option.TEMPORARY_OR_CASUAL'),
      },
      { value: Option.apprenticeship, text: contentFor('question.employment_type.option.APPRENTICESHIP') },
    ],
    validationMessage: commonContentFor('select_one_option'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

/*
  TODO: this question shares a code in private beta, however looks like we're limited in forge,
        we'll need to figure out if and how we support this, if not we need to update the migration
        to handle this change
*/
const createPreviousEmploymentRevealed = (code: string) =>
  revealedQuestion({
    content: {
      code,
      format: QuestionFormat.RADIO,
      text: contentFor('question.has_been_employed.text'),
      options: [
        { value: CommonOption.yes, text: contentFor(`question.has_been_employed.option.YES`) },
        { value: CommonOption.no, text: contentFor(`question.has_been_employed.option.NO`) },
      ],
      validationMessage: commonContentFor('select_one_option'),
    },
    displayModes: { field: radioDetails() },
  })

const currentEmploymentStatus = question({
  content: {
    code: Question.employment_status,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_status.text', CaseData.ForenamePossessive),
    options: [
      {
        value: Option.employed,
        text: contentFor('question.employment_status.option.EMPLOYED'),
        reveals: typeOfEmploymentRevealed,
      },
      { value: Option.self_employed, text: contentFor('question.employment_status.option.SELF_EMPLOYED') },
      { value: Option.retired, text: contentFor('question.employment_status.option.RETIRED') },
      {
        value: Option.currently_unavailable_for_work,
        text: contentFor('question.employment_status.option.CURRENTLY_UNAVAILABLE_FOR_WORK'),
        reveals: createPreviousEmploymentRevealed(Question.has_been_employed_unavailable_for_work),
      },
      {
        value: Option.unemployed_looking_for_work,
        text: contentFor('question.employment_status.option.UNEMPLOYED_LOOKING_FOR_WORK'),
        reveals: createPreviousEmploymentRevealed(Question.has_been_employed_actively_seeking),
      },
      {
        value: Option.unemployed_not_looking_for_work,
        text: contentFor('question.employment_status.option.UNEMPLOYED_NOT_LOOKING_FOR_WORK'),
        reveals: createPreviousEmploymentRevealed(Question.has_been_employed_not_actively_seeking),
      },
    ],
    validationMessage: commonContentFor('select_one_option'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    // Bespoke row: of the revealed questions, only the type of employment is
    // shown — the "employed before?" answers deliberately stay off the summary.
    summaryRow: (content): SummaryRow => ({
      key: { text: content.text },
      value: {
        blocks: [
          ...getDisplayTextForItems(content.code, content.options),
          ...getDisplayTextForItems(Question.employment_type, typeOfEmploymentRevealed.content.options, {
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.current_employment.path, text: commonContentFor('change') }],
      },
    }),
  },
})

const employmentSector = question({
  content: {
    code: Question.employment_area,
    format: QuestionFormat.TEXT,
    text: contentFor('question.employment_area.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: isEmployedOrSelfEmployed,
      visibleWhen: isEmployedOrSelfEmployed,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.employed.path,
      visibleWhen: and(
        isEmployedOrSelfEmployed,
        Answer(Question.employment_area).match(Condition.String.HasMinLength(1)),
      ),
    }),
  },
})

const employmentHistory = question({
  content: {
    code: Question.employment_history,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_history.text', CaseData.ForenamePossessive),
    hint: contentFor('question.employment_history.hint'),
    options: [
      {
        value: Option.stable,
        text: contentFor('question.employment_history.option.STABLE.text'),
        hint: contentFor('question.employment_history.option.STABLE.hint'),
        reveals: optionalDetails({
          code: Question.employment_history_stable_details,
          hint: contentFor('question.employment_history_stable_details.hint'),
        }),
      },
      {
        value: Option.periods_of_instability,
        text: contentFor('question.employment_history.option.PERIODS_OF_INSTABILITY'),
        reveals: optionalDetails({
          code: Question.employment_history_periods_of_instability_details,
          hint: contentFor('question.employment_history_periods_of_instability_details.hint'),
        }),
      },
      {
        value: Option.unstable,
        text: contentFor('question.employment_history.option.UNSTABLE'),
        reveals: optionalDetails({
          code: Question.employment_history_unstable_details,
          hint: contentFor('question.employment_history_unstable_details.hint'),
        }),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        reveals: optionalDetails({
          code: Question.employment_history_unknown_details,
          hint: contentFor('question.employment_history_unknown_details.hint'),
        }),
      },
    ],
    validationMessage: contentFor('question.employment_history.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasBeenEmployedOrRetired, visibleWhen: hasBeenEmployedOrRetired }),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path, visibleWhen: hasBeenEmployedOrRetired }),
  },
})

const dayToDayCommitments = question({
  content: {
    code: Question.employment_other_responsibilities,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.employment_other_responsibilities.text', CaseData.Forename),
    hint: contentFor('question.employment_other_responsibilities.hint'),
    options: [
      {
        value: Option.carer,
        text: contentFor('question.employment_other_responsibilities.option.CARER'),
        reveals: optionalDetails({ code: Question.employment_other_responsibilities_carer_details }),
      },
      {
        value: Option.child,
        text: contentFor('question.employment_other_responsibilities.option.CHILD'),
        reveals: optionalDetails({ code: Question.employment_other_responsibilities_child_details }),
      },
      { value: Option.studying, text: contentFor('question.employment_other_responsibilities.option.STUDYING') },
      {
        value: Option.volunteer,
        text: contentFor('question.employment_other_responsibilities.option.VOLUNTEER'),
        reveals: optionalDetails({ code: Question.employment_other_responsibilities_volunteer_details }),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.employment_other_responsibilities_other_details }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
      { divider: commonContentFor('or') },
      { value: CommonOption.none, text: commonContentFor('option.NONE'), behaviour: 'exclusive' as const },
    ],
    validationMessage: contentFor('question.employment_other_responsibilities.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const academicQualification = question({
  content: {
    code: Question.education_highest_level_completed,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_highest_level_completed.text', CaseData.Forename),
    options: [
      {
        value: Option.entry_level,
        text: contentFor('question.education_highest_level_completed.option.ENTRY_LEVEL.text'),
        hint: contentFor('question.education_highest_level_completed.option.ENTRY_LEVEL.hint'),
      },
      {
        value: Option.level_1,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_1.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_1.hint'),
      },
      {
        value: Option.level_2,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_2.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_2.hint'),
      },
      {
        value: Option.level_3,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_3.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_3.hint'),
      },
      {
        value: Option.level_4,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_4.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_4.hint'),
      },
      {
        value: Option.level_5,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_5.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_5.hint'),
      },
      {
        value: Option.level_6,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_6.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_6.hint'),
      },
      {
        value: Option.level_7,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_7.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_7.hint'),
      },
      {
        value: Option.level_8,
        text: contentFor('question.education_highest_level_completed.option.LEVEL_8.text'),
        hint: contentFor('question.education_highest_level_completed.option.LEVEL_8.hint'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.none_of_these, text: commonContentFor('option.NONE_OF_THESE') },
      { value: Option.not_sure, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.education_highest_level_completed.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const professionalQualification = question({
  content: {
    code: Question.education_professional_or_vocational_qualifications,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_professional_or_vocational_qualifications.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.education_professional_or_vocational_qualifications_yes_details,
          validationMessage: contentFor(
            'question.education_professional_or_vocational_qualifications_yes_details.validation',
          ),
          maxLength: CharacterLimit.c400,
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { divider: commonContentFor('or') },
      { value: Option.not_sure, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.education_professional_or_vocational_qualifications.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const jobSkills = question({
  content: {
    code: Question.education_transferable_skills,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_transferable_skills.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        hint: contentFor('question.education_transferable_skills.option.YES.hint'),
        reveals: optionalDetails({ code: Question.education_transferable_skills_yes_details }),
      },
      {
        value: Option.yes_some_skills,
        text: contentFor('question.education_transferable_skills.option.YES_SOME_SKILLS.text'),
        hint: contentFor('question.education_transferable_skills.option.YES_SOME_SKILLS.hint'),
        reveals: optionalDetails({ code: Question.education_transferable_skills_yes_some_skills_details }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        hint: contentFor('question.education_transferable_skills.option.NO.hint'),
      },
    ],
    validationMessage: contentFor('question.education_transferable_skills.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

// The three difficulty checkboxes each reveal the same severity question under
// their own code.
const difficultyLevelRevealed = (content: {
  code: string
  text: ResolvableString
  validationMessage: ResolvableString
}) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.RADIO,
      text: content.text,
      options: [
        { value: Option.significant_difficulties, text: contentFor('option.SIGNIFICANT_DIFFICULTIES') },
        { value: Option.some_difficulties, text: contentFor('option.SOME_DIFFICULTIES') },
      ],
      validationMessage: content.validationMessage,
    },
    displayModes: { field: radioDetails() },
  })

const difficultiesReadingWritingNumeracy = question({
  content: {
    code: Question.education_difficulties,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.education_difficulties.text', CaseData.Forename),
    hint: contentFor('question.education_difficulties.hint'),
    options: [
      {
        value: Option.reading,
        text: contentFor('question.education_difficulties.option.READING'),
        reveals: difficultyLevelRevealed({
          code: Question.education_difficulties_reading_severity,
          text: contentFor('question.education_difficulties_reading_severity.text'),
          validationMessage: contentFor('question.education_difficulties_reading_severity.validation'),
        }),
      },
      {
        value: Option.writing,
        text: contentFor('question.education_difficulties.option.WRITING'),
        reveals: difficultyLevelRevealed({
          code: Question.education_difficulties_writing_severity,
          text: contentFor('question.education_difficulties_writing_severity.text'),
          validationMessage: contentFor('question.education_difficulties_writing_severity.validation'),
        }),
      },
      {
        value: Option.numeracy,
        text: contentFor('question.education_difficulties.option.NUMERACY'),
        reveals: difficultyLevelRevealed({
          code: Question.education_difficulties_numeracy_severity,
          text: contentFor('question.education_difficulties_numeracy_severity.text'),
          validationMessage: contentFor('question.education_difficulties_numeracy_severity.validation'),
        }),
      },
      { divider: commonContentFor('or') },
      {
        value: CommonOption.none,
        text: contentFor('question.education_difficulties.option.NONE'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.education_difficulties.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

// The employment and education experience questions share their option shape:
// a positive-to-negative scale where each rating reveals optional details.
const experienceOptions = (detailsCodes: {
  positive: string
  mostlyPositive: string
  positiveAndNegative: string
  mostlyNegative: string
  negative: string
}) => [
  {
    value: Option.positive,
    text: contentFor('option.POSITIVE'),
    reveals: optionalDetails({ code: detailsCodes.positive }),
  },
  {
    value: Option.mostly_positive,
    text: contentFor('option.MOSTLY_POSITIVE'),
    reveals: optionalDetails({ code: detailsCodes.mostlyPositive }),
  },
  {
    value: Option.positive_and_negative,
    text: contentFor('option.POSITIVE_AND_NEGATIVE'),
    reveals: optionalDetails({ code: detailsCodes.positiveAndNegative }),
  },
  {
    value: Option.mostly_negative,
    text: contentFor('option.MOSTLY_NEGATIVE'),
    reveals: optionalDetails({ code: detailsCodes.mostlyNegative }),
  },
  {
    value: Option.negative,
    text: contentFor('option.NEGATIVE'),
    reveals: optionalDetails({ code: detailsCodes.negative }),
  },
  { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
]

const employmentExperience = question({
  content: {
    code: Question.employment_experience,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_experience.text', CaseData.ForenamePossessive),
    options: experienceOptions({
      positive: Question.employment_experience_positive_details,
      mostlyPositive: Question.employment_experience_mostly_positive_details,
      positiveAndNegative: Question.employment_experience_positive_and_negative_details,
      mostlyNegative: Question.employment_experience_mostly_negative_details,
      negative: Question.employment_experience_negative_details,
    }),
    validationMessage: contentFor('question.employment_experience.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasBeenEmployed, visibleWhen: hasBeenEmployed }),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path, visibleWhen: hasBeenEmployed }),
  },
})

const educationExperience = question({
  content: {
    code: Question.education_experience,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_experience.text', CaseData.ForenamePossessive),
    options: experienceOptions({
      positive: Question.education_experience_positive_details,
      mostlyPositive: Question.education_experience_mostly_positive_details,
      positiveAndNegative: Question.education_experience_positive_and_negative_details,
      mostlyNegative: Question.education_experience_mostly_negative_details,
      negative: Question.education_experience_negative_details,
    }),
    validationMessage: contentFor('question.education_experience.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const changes = question({
  content: {
    code: Question.employment_education_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_education_changes.text', CaseData.Forename),
    hint: contentFor('question.employment_education_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.employment_education_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.employment_education_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.employment_education_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.employment_education_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.employment_education_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.employment_education_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_serious_harm.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.employment_education_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.employment_education_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.employment_education_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.employment_education_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const employmentEducationSection = {
  fields: {
    currentEmploymentStatus,
    employmentSector,
    employmentHistory,
    dayToDayCommitments,
    academicQualification,
    professionalQualification,
    jobSkills,
    difficultiesReadingWritingNumeracy,
    employmentExperience,
    educationExperience,
    changes,
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
