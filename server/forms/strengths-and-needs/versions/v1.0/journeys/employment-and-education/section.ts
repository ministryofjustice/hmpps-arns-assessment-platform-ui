import { and, Answer, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxField,
  question,
  QuestionFormat,
  radioDetails,
  radioField,
  revealedQuestion,
  SummaryRow,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { getDisplayTextForItems } from '../../../../i18n'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import {
  characterCountField,
  itemisedSummaryRow,
  optionalDetails,
  requiredDetails,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'

// The history and experience questions only apply once we know the person has
// been employed before (or their employment status implies it).
const hasBeenEmployed = not(
  or(
    Answer(Question.had_previous_employment_unavailable_for_work).match(
      Condition.Equals(Option.no_has_never_been_employed),
    ),
    Answer(Question.had_previous_employment_actively_looking_for_work).match(
      Condition.Equals(Option.no_has_never_been_employed),
    ),
    Answer(Question.had_previous_employment_not_looking_for_work).match(
      Condition.Equals(Option.no_has_never_been_employed),
    ),
  ),
)

const isEmployedOrSelfEmployed = or(
  Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
  Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed)),
)

const typeOfEmploymentRevealed = revealedQuestion({
  content: {
    code: Question.type_of_employment,
    format: QuestionFormat.RADIO,
    text: contentFor('question.type_of_employment.text'),
    options: [
      { value: Option.full_time, text: contentFor('question.type_of_employment.option.FULL_TIME') },
      { value: Option.part_time, text: contentFor('question.type_of_employment.option.PART_TIME') },
      {
        value: Option.temporary_or_casual,
        text: contentFor('question.type_of_employment.option.TEMPORARY_OR_CASUAL'),
      },
      { value: Option.apprenticeship, text: contentFor('question.type_of_employment.option.APPRENTICESHIP') },
    ],
    validationMessage: commonContentFor('select_one_option'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

// The three unemployed statuses ask the same "employed before?" question under
// different codes, depending on which status revealed it.
const hadPreviousEmploymentRevealed = (content: { code: string; text: ResolvableString }) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.RADIO,
      text: content.text,
      options: [
        { value: Option.yes_has_been_employed_before, text: contentFor('option.YES_HAS_BEEN_EMPLOYED_BEFORE') },
        { value: Option.no_has_never_been_employed, text: contentFor('option.NO_HAS_NEVER_BEEN_EMPLOYED') },
      ],
      validationMessage: commonContentFor('select_one_option'),
    },
    displayModes: { field: radioDetails() },
  })

const currentEmploymentStatus = question({
  content: {
    code: Question.current_employment_status,
    format: QuestionFormat.RADIO,
    text: contentFor('question.current_employment_status.text', CaseData.ForenamePossessive),
    options: [
      {
        value: Option.employed,
        text: contentFor('question.current_employment_status.option.EMPLOYED'),
        reveals: typeOfEmploymentRevealed,
      },
      { value: Option.self_employed, text: contentFor('question.current_employment_status.option.SELF_EMPLOYED') },
      { value: Option.retired, text: contentFor('question.current_employment_status.option.RETIRED') },
      {
        value: Option.currently_unavailable_for_work,
        text: contentFor('question.current_employment_status.option.CURRENTLY_UNAVAILABLE_FOR_WORK'),
        reveals: hadPreviousEmploymentRevealed({
          code: Question.had_previous_employment_unavailable_for_work,
          text: contentFor('question.had_previous_employment_unavailable_for_work.text'),
        }),
      },
      {
        value: Option.unemployed_actively_looking,
        text: contentFor('question.current_employment_status.option.UNEMPLOYED_ACTIVELY_LOOKING'),
        reveals: hadPreviousEmploymentRevealed({
          code: Question.had_previous_employment_actively_looking_for_work,
          text: contentFor('question.had_previous_employment_actively_looking_for_work.text'),
        }),
      },
      {
        value: Option.unemployed_not_actively_looking,
        text: contentFor('question.current_employment_status.option.UNEMPLOYED_NOT_ACTIVELY_LOOKING'),
        reveals: hadPreviousEmploymentRevealed({
          code: Question.had_previous_employment_not_looking_for_work,
          text: contentFor('question.had_previous_employment_not_looking_for_work.text'),
        }),
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
          ...getDisplayTextForItems(Question.type_of_employment, typeOfEmploymentRevealed.content.options, {
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
    code: Question.employment_sector,
    format: QuestionFormat.TEXT,
    text: contentFor('question.employment_sector.text', CaseData.Forename),
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
        Answer(Question.employment_sector).match(Condition.String.HasMinLength(1)),
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
          code: Question.continuous_employment_history_employment_details,
          hint: contentFor('question.continuous_employment_history_employment_details.hint'),
        }),
      },
      {
        value: Option.periods_of_instability,
        text: contentFor('question.employment_history.option.PERIODS_OF_INSTABILITY'),
        reveals: optionalDetails({
          code: Question.changes_often_employment_history_employment_details,
          hint: contentFor('question.changes_often_employment_history_employment_details.hint'),
        }),
      },
      {
        value: Option.unstable,
        text: contentFor('question.employment_history.option.UNSTABLE'),
        reveals: optionalDetails({
          code: Question.unstable_employment_history_employment_details,
          hint: contentFor('question.unstable_employment_history_employment_details.hint'),
        }),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        reveals: optionalDetails({
          code: Question.unknown_employment_history_employment_details,
          hint: contentFor('question.unknown_employment_history_employment_details.hint'),
        }),
      },
    ],
    validationMessage: contentFor('question.employment_history.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasBeenEmployed, visibleWhen: hasBeenEmployed }),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path, visibleWhen: hasBeenEmployed }),
  },
})

const dayToDayCommitments = question({
  content: {
    code: Question.day_to_day_commitments,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.day_to_day_commitments.text', CaseData.Forename),
    hint: contentFor('question.day_to_day_commitments.hint'),
    options: [
      {
        value: Option.caring,
        text: contentFor('question.day_to_day_commitments.option.CARING'),
        reveals: optionalDetails({ code: Question.day_to_day_caring_responsibilities_details }),
      },
      {
        value: Option.children,
        text: contentFor('question.day_to_day_commitments.option.CHILDREN'),
        reveals: optionalDetails({ code: Question.day_to_day_child_responsibilities_details }),
      },
      { value: Option.studying, text: contentFor('question.day_to_day_commitments.option.STUDYING') },
      {
        value: Option.volunteering,
        text: contentFor('question.day_to_day_commitments.option.VOLUNTEERING'),
        reveals: optionalDetails({ code: Question.day_to_day_volunteering_responsibilities_details }),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.day_to_day_other_commitments_details }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
      { divider: commonContentFor('or') },
      { value: CommonOption.none, text: commonContentFor('option.NONE'), behaviour: 'exclusive' as const },
    ],
    validationMessage: contentFor('question.day_to_day_commitments.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const academicQualification = question({
  content: {
    code: Question.academic_qualification,
    format: QuestionFormat.RADIO,
    text: contentFor('question.academic_qualification.text', CaseData.Forename),
    options: [
      {
        value: Option.entry_level,
        text: contentFor('question.academic_qualification.option.ENTRY_LEVEL.text'),
        hint: contentFor('question.academic_qualification.option.ENTRY_LEVEL.hint'),
      },
      {
        value: Option.level_1,
        text: contentFor('question.academic_qualification.option.LEVEL_1.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_1.hint'),
      },
      {
        value: Option.level_2,
        text: contentFor('question.academic_qualification.option.LEVEL_2.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_2.hint'),
      },
      {
        value: Option.level_3,
        text: contentFor('question.academic_qualification.option.LEVEL_3.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_3.hint'),
      },
      {
        value: Option.level_4,
        text: contentFor('question.academic_qualification.option.LEVEL_4.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_4.hint'),
      },
      {
        value: Option.level_5,
        text: contentFor('question.academic_qualification.option.LEVEL_5.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_5.hint'),
      },
      {
        value: Option.level_6,
        text: contentFor('question.academic_qualification.option.LEVEL_6.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_6.hint'),
      },
      {
        value: Option.level_7,
        text: contentFor('question.academic_qualification.option.LEVEL_7.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_7.hint'),
      },
      {
        value: Option.level_8,
        text: contentFor('question.academic_qualification.option.LEVEL_8.text'),
        hint: contentFor('question.academic_qualification.option.LEVEL_8.hint'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.non_of_these, text: commonContentFor('option.NON_OF_THESE') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.academic_qualification.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const professionalQualification = question({
  content: {
    code: Question.professional_qualification,
    format: QuestionFormat.RADIO,
    text: contentFor('question.professional_qualification.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.professional_qualification_details,
          validationMessage: contentFor('question.professional_qualification_details.validation'),
          maxLength: CharacterLimit.c400,
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.professional_qualification.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const jobSkills = question({
  content: {
    code: Question.job_skills,
    format: QuestionFormat.RADIO,
    text: contentFor('question.job_skills.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        hint: contentFor('question.job_skills.option.YES.hint'),
        reveals: optionalDetails({ code: Question.has_job_skills_details }),
      },
      {
        value: Option.some_skills,
        text: contentFor('question.job_skills.option.SOME_SKILLS.text'),
        hint: contentFor('question.job_skills.option.SOME_SKILLS.hint'),
        reveals: optionalDetails({ code: Question.some_job_skills_details }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        hint: contentFor('question.job_skills.option.NO.hint'),
      },
    ],
    validationMessage: contentFor('question.job_skills.validation'),
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
    code: Question.difficulties_reading_writing_numeracy,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.difficulties_reading_writing_numeracy.text', CaseData.Forename),
    hint: contentFor('question.difficulties_reading_writing_numeracy.hint'),
    options: [
      {
        value: Option.yes_reading,
        text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_READING'),
        reveals: difficultyLevelRevealed({
          code: Question.reading_difficulty_level,
          text: contentFor('question.reading_difficulty_level.text'),
          validationMessage: contentFor('question.reading_difficulty_level.validation'),
        }),
      },
      {
        value: Option.yes_writing,
        text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_WRITING'),
        reveals: difficultyLevelRevealed({
          code: Question.writing_difficulty_level,
          text: contentFor('question.writing_difficulty_level.text'),
          validationMessage: contentFor('question.writing_difficulty_level.validation'),
        }),
      },
      {
        value: Option.yes_numeracy,
        text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_NUMERACY'),
        reveals: difficultyLevelRevealed({
          code: Question.numeracy_difficulty_level,
          text: contentFor('question.numeracy_difficulty_level.text'),
          validationMessage: contentFor('question.numeracy_difficulty_level.validation'),
        }),
      },
      { divider: commonContentFor('or') },
      {
        value: Option.no_difficulties,
        text: contentFor('question.difficulties_reading_writing_numeracy.option.NO_DIFFICULTIES'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.difficulties_reading_writing_numeracy.validation'),
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
      positive: Question.positive_employment_experience_details,
      mostlyPositive: Question.mostly_positive_employment_experience_details,
      positiveAndNegative: Question.positive_and_negative_employment_experience_details,
      mostlyNegative: Question.mostly_negative_employment_experience_details,
      negative: Question.negative_employment_experience_details,
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
      positive: Question.positive_education_experience_details,
      mostlyPositive: Question.mostly_positive_education_experience_details,
      positiveAndNegative: Question.positive_and_negative_education_experience_details,
      mostlyNegative: Question.mostly_negative_education_experience_details,
      negative: Question.negative_education_experience_details,
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
    code: Question.employment_and_education_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_and_education_changes.text', CaseData.Forename),
    hint: contentFor('question.employment_and_education_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.has_made_changes,
        text: commonContentFor('option.HAS_MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.has_made_positive_changes_details }),
      },
      {
        value: CommonOption.is_making_changes,
        text: commonContentFor('option.IS_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.actively_making_changes_details }),
      },
      {
        value: CommonOption.wants_to_make_changes_knows_how_to,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
        reveals: optionalDetails({ code: Question.wants_to_make_changes_knows_how_to_details }),
      },
      {
        value: CommonOption.wants_to_make_changes_needs_help,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
        reveals: optionalDetails({ code: Question.wants_to_make_changes_needs_help_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.employment_and_education_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employed.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.employment_education_strengths_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_education_strengths_protective_factors.text', CaseData.ForenamePossessive),
    hint: contentFor('question.employment_education_strengths_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_strengths_protective_factors_details,
        validationMessage: contentFor('question.employment_education_strengths_protective_factors_details.validation'),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_no_strengths_protective_factors_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.employment_education_strengths_protective_factors.validation'),
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
    code: Question.employment_education_linked_to_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_education_linked_to_serious_harm.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_serious_harm_details,
        validationMessage: contentFor('question.employment_education_serious_harm_details.validation'),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_no_serious_harm_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.employment_education_linked_to_serious_harm.validation'),
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
    code: Question.employment_education_linked_to_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_education_linked_to_reoffending.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_risk_of_reoffending_details,
        validationMessage: contentFor('question.employment_education_risk_of_reoffending_details.validation'),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.employment_education_no_risk_of_reoffending_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.employment_education_linked_to_reoffending.validation'),
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
  code: Section.employment_and_education.code,
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
