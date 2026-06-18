import {
  validation,
  Self,
  Answer,
  Format,
  and,
  Condition,
  not,
  or,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { locale } from '../../constants/locale'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonLocale } from '../../../../constants/locale'
import { CaseData } from '../../../../constants/formVersion'

// --- Employment Sector Group ---

export const employmentSector = GovUKCharacterCount({
  code: Question.employment_sector,
  label: {
    text: Format(locale.question[Question.employment_sector], CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: or(
    Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
    Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed)),
  ),
  dependentWhen: or(
    Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
    Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed)),
  ),
})

// --- Employment History Group ---

const continuousEmploymentHistoryEmploymentDetails = GovUKCharacterCount({
  code: Question.continuous_employment_history_employment_details,
  label: commonLocale.optional_details,
  hint: locale.hint[Question.continuous_employment_history_employment_details],
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.continuous_employment)),
})

const changesOftenEmploymentHistoryEmploymentOftenDetails = GovUKCharacterCount({
  code: Question.changes_often_employment_history_employment_details,
  label: commonLocale.optional_details,
  hint: locale.hint[Question.changes_often_employment_history_employment_details],
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.changes_jobs_often)),
})

const unstableEmploymentHistoryEmploymentDetails = GovUKCharacterCount({
  code: Question.unstable_employment_history_employment_details,
  label: commonLocale.optional_details,
  hint: locale.hint[Question.unstable_employment_history_employment_details],
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.unstable_employment)),
})

const unknownEmploymentHistoryDetails = GovUKCharacterCount({
  code: Question.unknown_employment_history_employment_details,
  label: commonLocale.optional_details,
  hint: locale.hint[Question.unknown_employment_history_employment_details],
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.unknown)),
})

export const employmentHistory = GovUKRadioInput({
  code: Question.employment_history,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_history], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.employment_history],
  items: [
    {
      value: Option.continuous_employment,
      text: locale.option[Option.continuous_employment],
      hint: locale.hint[`${Question.employment_history}_${Option.continuous_employment}`],
      block: continuousEmploymentHistoryEmploymentDetails,
    },
    {
      value: Option.changes_jobs_often,
      text: locale.option[Option.changes_jobs_often],
      block: changesOftenEmploymentHistoryEmploymentOftenDetails,
    },
    {
      value: Option.unstable_employment,
      text: locale.option[Option.unstable_employment],
      block: unstableEmploymentHistoryEmploymentDetails,
    },
    {
      value: Option.unknown,
      text: locale.option[Option.unknown],
      block: unknownEmploymentHistoryDetails,
    },
  ],
  visibleWhen: not(
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
  ),
  dependentWhen: not(
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
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.employment_history],
    }),
  ],
})

// --- Day To Day Responsibilities Group ---

const dayToDayCaringResponsibilitiesDetails = GovUKCharacterCount({
  code: Question.day_to_day_caring_responsibilities_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.caring)),
})

const dayToDayVolunteeringDetails = GovUKCharacterCount({
  code: Question.day_to_day_volunteering_responsibilities_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.volunteering)),
})

const dayToDayChildResponsibilitiesDetails = GovUKCharacterCount({
  code: Question.day_to_day_child_responsibilities_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.children)),
})

const dayToDayOtherCommitmentsDetails = GovUKCharacterCount({
  code: Question.day_to_day_other_commitments_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.other)),
})

export const dayToDayCommitments = GovUKCheckboxInput({
  code: Question.day_to_day_commitments,
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.day_to_day_commitments], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.day_to_day_commitments],
  items: [
    { value: Option.caring, text: locale.option[Option.caring], block: dayToDayCaringResponsibilitiesDetails },
    { value: Option.children, text: locale.option[Option.children], block: dayToDayChildResponsibilitiesDetails },
    { value: Option.studying, text: locale.option[Option.studying] },
    { value: Option.volunteering, text: locale.option[Option.volunteering], block: dayToDayVolunteeringDetails },
    { value: Option.other, text: locale.option[Option.other], block: dayToDayOtherCommitmentsDetails },
    { value: Option.unknown, text: locale.option[Option.unknown] },
    { divider: commonLocale.or },
    { value: Option.none, text: locale.option[Option.none], behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.day_to_day_commitments],
    }),
  ],
})

// --- Academic Qualification Group ---

export const academicQualification = GovUKRadioInput({
  code: Question.academic_qualification,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.academic_qualification], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.entry_level,
      text: locale.option[Option.entry_level],
      hint: locale.hint[`${Question.academic_qualification}_${Option.entry_level}`],
    },
    {
      value: Option.level_1,
      text: locale.option[Option.level_1],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_1}`],
    },
    {
      value: Option.level_2,
      text: locale.option[Option.level_2],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_2}`],
    },
    {
      value: Option.level_3,
      text: locale.option[Option.level_3],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_3}`],
    },
    {
      value: Option.level_4,
      text: locale.option[Option.level_4],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_4}`],
    },
    {
      value: Option.level_5,
      text: locale.option[Option.level_5],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_5}`],
    },
    {
      value: Option.level_6,
      text: locale.option[Option.level_6],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_6}`],
    },
    {
      value: Option.level_7,
      text: locale.option[Option.level_7],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_7}`],
    },
    {
      value: Option.level_8,
      text: locale.option[Option.level_8],
      hint: locale.hint[`${Question.academic_qualification}_${Option.level_8}`],
    },
    { divider: commonLocale.or },
    { value: Option.non_of_these, text: locale.option[Option.non_of_these] },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.academic_qualification],
    }),
  ],
})

// --- Professional Vocational Qualifications Group ---

const professionalQualificationDetails = GovUKCharacterCount({
  code: Question.professional_qualification_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.professional_qualification).match(Condition.IsRequired()),
    Answer(Question.professional_qualification).match(Condition.Equals(Option.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.professional_qualification_details],
    }),
  ],
})

export const professionalQualifications = GovUKRadioInput({
  code: Question.professional_qualification,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.professional_qualification], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.option[Option.yes], block: professionalQualificationDetails },
    { value: Option.no, text: locale.option[Option.no] },
    { divider: commonLocale.or },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.professional_qualification],
    }),
  ],
})

// --- Job Skills Group ---

const hasJobSkillsDetails = GovUKCharacterCount({
  code: Question.has_job_skills_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.job_skills).match(Condition.Equals(Option.yes)),
})

const someJobSkillsDetails = GovUKCharacterCount({
  code: Question.some_job_skills_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.job_skills).match(Condition.Equals(Option.some_skills)),
})

export const jobSkills = GovUKRadioInput({
  code: Question.job_skills,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.job_skills], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.yes,
      text: locale.option[Option.yes],
      hint: locale.hint[`${Question.job_skills}_${Option.yes}`],
      block: hasJobSkillsDetails,
    },
    {
      value: Option.some_skills,
      text: locale.option[Option.some_skills],
      hint: locale.hint[`${Question.job_skills}_${Option.some_skills}`],
      block: someJobSkillsDetails,
    },
    {
      value: Option.no,
      text: locale.option[Option.no],
      hint: locale.hint[`${Question.job_skills}_${Option.no}`],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.job_skills],
    }),
  ],
})

// --- Difficulties with Reading, Writing or Numeracy Group ---

export const readingDifficultyLevel = GovUKRadioInput({
  code: Question.reading_difficulty_level,
  fieldset: {
    legend: {
      text: locale.question[Question.reading_difficulty_level],
    },
  },
  items: [
    { value: Option.significant, text: locale.option[Option.significant] },
    { value: Option.some, text: locale.option[Option.some] },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_reading)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.reading_difficulty_level],
    }),
  ],
})

export const writingDifficultyLevel = GovUKRadioInput({
  code: Question.writing_difficulty_level,
  fieldset: {
    legend: {
      text: locale.question[Question.writing_difficulty_level],
    },
  },
  items: [
    { value: Option.significant, text: locale.option[Option.significant] },
    { value: Option.some, text: locale.option[Option.some] },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_writing)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.writing_difficulty_level],
    }),
  ],
})

export const numeracyDifficultyLevel = GovUKRadioInput({
  code: Question.numeracy_difficulty_level,
  fieldset: {
    legend: {
      text: locale.question[Question.numeracy_difficulty_level],
    },
  },
  items: [
    { value: Option.significant, text: locale.option[Option.significant] },
    { value: Option.some, text: locale.option[Option.some] },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_numeracy)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.numeracy_difficulty_level],
    }),
  ],
})

export const difficultiesReadingWritingNumeracy = GovUKCheckboxInput({
  code: Question.difficulties_reading_writing_numeracy,
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.difficulties_reading_writing_numeracy], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.difficulties_reading_writing_numeracy],
  items: [
    { value: Option.yes_reading, text: locale.option[Option.yes_reading], block: readingDifficultyLevel },
    { value: Option.yes_writing, text: locale.option[Option.yes_writing], block: writingDifficultyLevel },
    { value: Option.yes_numeracy, text: locale.option[Option.yes_numeracy], block: numeracyDifficultyLevel },
    { divider: commonLocale.or },
    { value: Option.no_difficulties, text: locale.option[Option.no_difficulties], behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.difficulties_reading_writing_numeracy],
    }),
  ],
})

// --- Employment Experience Group ---

const positiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.positive_employment_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.positive)),
})

const mostlyPositiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_positive_employment_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.mostly_positive)),
})

const positiveAndNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.positive_and_negative_employment_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.positive_and_negative)),
})

const mostlyNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_negative_employment_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.mostly_negative)),
})

const negativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.negative_employment_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.negative)),
})

export const employmentExperience = GovUKRadioInput({
  code: Question.employment_experience,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_experience], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.positive, text: locale.option[Option.positive], block: positiveEmploymentExperienceDetails },
    {
      value: Option.mostly_positive,
      text: locale.option[Option.mostly_positive],
      block: mostlyPositiveEmploymentExperienceDetails,
    },
    {
      value: Option.positive_and_negative,
      text: locale.option[Option.positive_and_negative],
      block: positiveAndNegativeEmploymentExperienceDetails,
    },
    {
      value: Option.mostly_negative,
      text: locale.option[Option.mostly_negative],
      block: mostlyNegativeEmploymentExperienceDetails,
    },
    { value: Option.negative, text: locale.option[Option.negative], block: negativeEmploymentExperienceDetails },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  visibleWhen: not(
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
  ),
  dependentWhen: not(
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
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.employment_experience],
    }),
  ],
})

// --- Education Experience Group ---

const positiveEducationExperienceDetails = GovUKCharacterCount({
  code: Question.positive_education_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.positive)),
})

const mostlyPositiveEducationExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_positive_education_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.mostly_positive)),
})

const positiveAndNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.positive_and_negative_education_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.positive_and_negative)),
})

const mostlyNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_negative_education_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.mostly_negative)),
})

const negativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.negative_education_experience_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.negative)),
})

export const educationExperience = GovUKRadioInput({
  code: Question.education_experience,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.education_experience], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.positive, text: locale.option[Option.positive], block: positiveEducationExperienceDetails },
    {
      value: Option.mostly_positive,
      text: locale.option[Option.mostly_positive],
      block: mostlyPositiveEducationExperienceDetails,
    },
    {
      value: Option.positive_and_negative,
      text: locale.option[Option.positive_and_negative],
      block: positiveAndNegativeEducationExperienceDetails,
    },
    {
      value: Option.mostly_negative,
      text: locale.option[Option.mostly_negative],
      block: mostlyNegativeEducationExperienceDetails,
    },
    { value: Option.negative, text: locale.option[Option.negative], block: negativeEducationExperienceDetails },
    { value: Option.unknown, text: locale.option[Option.unknown] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.education_experience],
    }),
  ],
})

// --- Change Employment And Education Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(Condition.Equals(Option.has_made_changes)),
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(Condition.Equals(Option.is_making_changes)),
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(Option.wants_to_make_changes_knows_how_to),
  ),
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(Option.wants_to_make_changes_needs_help),
  ),
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(Option.thinking_about_making_changes),
  ),
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(Option.does_not_want_to_make_changes),
  ),
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(Option.does_not_want_to_answer),
  ),
})

export const employmentAndEducationChanges = GovUKRadioInput({
  code: Question.employment_and_education_changes,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_and_education_changes], CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.has_made_changes,
      text: locale.option[Option.has_made_changes],
      block: hasMadePositiveChangesDetails,
    },
    {
      value: Option.is_making_changes,
      text: locale.option[Option.is_making_changes],
      block: isActivelyMakingChangesDetails,
    },
    {
      value: Option.wants_to_make_changes_knows_how_to,
      text: locale.option[Option.wants_to_make_changes_knows_how_to],
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: Option.wants_to_make_changes_needs_help,
      text: locale.option[Option.wants_to_make_changes_needs_help],
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: Option.thinking_about_making_changes,
      text: locale.option[Option.thinking_about_making_changes],
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: Option.does_not_want_to_make_changes,
      text: locale.option[Option.does_not_want_to_make_changes],
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: Option.does_not_want_to_answer,
      text: locale.option[Option.does_not_want_to_answer],
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: commonLocale.or },
    { value: Option.not_present, text: Format(locale.option[Option.not_present], CaseData.Forename) },
    { value: Option.not_applicable, text: locale.option[Option.not_applicable] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: locale.validation[Question.employment_and_education_changes],
    }),
  ],
})
