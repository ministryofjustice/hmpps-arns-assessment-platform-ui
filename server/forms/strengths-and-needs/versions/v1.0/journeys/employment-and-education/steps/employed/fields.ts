import { validation, Self, Answer, and, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'

// --- Employment Sector Group ---

export const employmentSector = GovUKCharacterCount({
  code: Question.employment_sector,
  label: {
    text: contentFor('question.employment_sector.text', CaseData.Forename),
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
  label: commonContentFor('optional_details'),
  hint: contentFor('question.continuous_employment_history_employment_details.hint'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.stable)),
})

const changesOftenEmploymentHistoryEmploymentOftenDetails = GovUKCharacterCount({
  code: Question.changes_often_employment_history_employment_details,
  label: commonContentFor('optional_details'),
  hint: contentFor('question.changes_often_employment_history_employment_details.hint'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.periods_of_instability)),
})

const unstableEmploymentHistoryEmploymentDetails = GovUKCharacterCount({
  code: Question.unstable_employment_history_employment_details,
  label: commonContentFor('optional_details'),
  hint: contentFor('question.unstable_employment_history_employment_details.hint'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(Option.unstable)),
})

const unknownEmploymentHistoryDetails = GovUKCharacterCount({
  code: Question.unknown_employment_history_employment_details,
  label: commonContentFor('optional_details'),
  hint: contentFor('question.unknown_employment_history_employment_details.hint'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_history).match(Condition.Equals(CommonOption.unknown)),
})

export const employmentHistory = GovUKRadioInput({
  code: Question.employment_history,
  fieldset: {
    legend: {
      text: contentFor('question.employment_history.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.employment_history.hint'),
  items: [
    {
      value: Option.stable,
      text: contentFor('question.employment_history.option.STABLE.text'),
      hint: contentFor('question.employment_history.option.STABLE.hint'),
      block: continuousEmploymentHistoryEmploymentDetails,
    },
    {
      value: Option.periods_of_instability,
      text: contentFor('question.employment_history.option.PERIODS_OF_INSTABILITY'),
      block: changesOftenEmploymentHistoryEmploymentOftenDetails,
    },
    {
      value: Option.unstable,
      text: contentFor('question.employment_history.option.UNSTABLE'),
      block: unstableEmploymentHistoryEmploymentDetails,
    },
    {
      value: CommonOption.unknown,
      text: commonContentFor('option.UNKNOWN'),
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
      message: contentFor('question.employment_history.validation'),
    }),
  ],
})

// --- Day To Day Responsibilities Group ---

const dayToDayCaringResponsibilitiesDetails = GovUKCharacterCount({
  code: Question.day_to_day_caring_responsibilities_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.caring)),
})

const dayToDayVolunteeringDetails = GovUKCharacterCount({
  code: Question.day_to_day_volunteering_responsibilities_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.volunteering)),
})

const dayToDayChildResponsibilitiesDetails = GovUKCharacterCount({
  code: Question.day_to_day_child_responsibilities_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.children)),
})

const dayToDayOtherCommitmentsDetails = GovUKCharacterCount({
  code: Question.day_to_day_other_commitments_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(CommonOption.other)),
})

export const dayToDayCommitments = GovUKCheckboxInput({
  code: Question.day_to_day_commitments,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.day_to_day_commitments.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.day_to_day_commitments.hint'),
  items: [
    {
      value: Option.caring,
      text: contentFor('question.day_to_day_commitments.option.CARING'),
      block: dayToDayCaringResponsibilitiesDetails,
    },
    {
      value: Option.children,
      text: contentFor('question.day_to_day_commitments.option.CHILDREN'),
      block: dayToDayChildResponsibilitiesDetails,
    },
    { value: Option.studying, text: contentFor('question.day_to_day_commitments.option.STUDYING') },
    {
      value: Option.volunteering,
      text: contentFor('question.day_to_day_commitments.option.VOLUNTEERING'),
      block: dayToDayVolunteeringDetails,
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: dayToDayOtherCommitmentsDetails },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    { divider: commonContentFor('or') },
    { value: CommonOption.none, text: commonContentFor('option.NONE'), behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.day_to_day_commitments.validation'),
    }),
  ],
})

// --- Academic Qualification Group ---

export const academicQualification = GovUKRadioInput({
  code: Question.academic_qualification,
  fieldset: {
    legend: {
      text: contentFor('question.academic_qualification.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
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
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.academic_qualification.validation'),
    }),
  ],
})

// --- Professional Vocational Qualifications Group ---

const professionalQualificationDetails = GovUKCharacterCount({
  code: Question.professional_qualification_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.professional_qualification).match(Condition.IsRequired()),
    Answer(Question.professional_qualification).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.professional_qualification_details.validation'),
    }),
  ],
})

export const professionalQualifications = GovUKRadioInput({
  code: Question.professional_qualification,
  fieldset: {
    legend: {
      text: contentFor('question.professional_qualification.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: professionalQualificationDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
    { divider: commonContentFor('or') },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.professional_qualification.validation'),
    }),
  ],
})

// --- Job Skills Group ---

const hasJobSkillsDetails = GovUKCharacterCount({
  code: Question.has_job_skills_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.job_skills).match(Condition.Equals(CommonOption.yes)),
})

const someJobSkillsDetails = GovUKCharacterCount({
  code: Question.some_job_skills_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.job_skills).match(Condition.Equals(Option.some_skills)),
})

export const jobSkills = GovUKRadioInput({
  code: Question.job_skills,
  fieldset: {
    legend: {
      text: contentFor('question.job_skills.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      hint: contentFor('question.job_skills.option.YES.hint'),
      block: hasJobSkillsDetails,
    },
    {
      value: Option.some_skills,
      text: contentFor('question.job_skills.option.SOME_SKILLS.text'),
      hint: contentFor('question.job_skills.option.SOME_SKILLS.hint'),
      block: someJobSkillsDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      hint: contentFor('question.job_skills.option.NO.hint'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.job_skills.validation'),
    }),
  ],
})

// --- Difficulties with Reading, Writing or Numeracy Group ---

export const readingDifficultyLevel = GovUKRadioInput({
  code: Question.reading_difficulty_level,
  fieldset: {
    legend: {
      text: contentFor('question.reading_difficulty_level.text'),
    },
  },
  items: [
    { value: Option.significant_difficulties, text: contentFor('option.SIGNIFICANT_DIFFICULTIES') },
    { value: Option.some_difficulties, text: contentFor('option.SOME_DIFFICULTIES') },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_reading)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.reading_difficulty_level.validation'),
    }),
  ],
})

export const writingDifficultyLevel = GovUKRadioInput({
  code: Question.writing_difficulty_level,
  fieldset: {
    legend: {
      text: contentFor('question.writing_difficulty_level.text'),
    },
  },
  items: [
    { value: Option.significant_difficulties, text: contentFor('option.SIGNIFICANT_DIFFICULTIES') },
    { value: Option.some_difficulties, text: contentFor('option.SOME_DIFFICULTIES') },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_writing)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.writing_difficulty_level.validation'),
    }),
  ],
})

export const numeracyDifficultyLevel = GovUKRadioInput({
  code: Question.numeracy_difficulty_level,
  fieldset: {
    legend: {
      text: contentFor('question.numeracy_difficulty_level.text'),
    },
  },
  items: [
    { value: Option.significant_difficulties, text: contentFor('option.SIGNIFICANT_DIFFICULTIES') },
    { value: Option.some_difficulties, text: contentFor('option.SOME_DIFFICULTIES') },
  ],
  dependentWhen: and(
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.IsRequired()),
    Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_numeracy)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.numeracy_difficulty_level.validation'),
    }),
  ],
})

export const difficultiesReadingWritingNumeracy = GovUKCheckboxInput({
  code: Question.difficulties_reading_writing_numeracy,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.difficulties_reading_writing_numeracy.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.difficulties_reading_writing_numeracy.hint'),
  items: [
    {
      value: Option.yes_reading,
      text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_READING'),
      block: readingDifficultyLevel,
    },
    {
      value: Option.yes_writing,
      text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_WRITING'),
      block: writingDifficultyLevel,
    },
    {
      value: Option.yes_numeracy,
      text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_NUMERACY'),
      block: numeracyDifficultyLevel,
    },
    { divider: commonContentFor('or') },
    {
      value: Option.no_difficulties,
      text: contentFor('question.difficulties_reading_writing_numeracy.option.NO_DIFFICULTIES'),
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.difficulties_reading_writing_numeracy.validation'),
    }),
  ],
})

// --- Employment Experience Group ---

const positiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.positive_employment_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.positive)),
})

const mostlyPositiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_positive_employment_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.mostly_positive)),
})

const positiveAndNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.positive_and_negative_employment_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.positive_and_negative)),
})

const mostlyNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_negative_employment_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.mostly_negative)),
})

const negativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: Question.negative_employment_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_experience).match(Condition.Equals(Option.negative)),
})

export const employmentExperience = GovUKRadioInput({
  code: Question.employment_experience,
  fieldset: {
    legend: {
      text: contentFor('question.employment_experience.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.positive, text: contentFor('option.POSITIVE'), block: positiveEmploymentExperienceDetails },
    {
      value: Option.mostly_positive,
      text: contentFor('option.MOSTLY_POSITIVE'),
      block: mostlyPositiveEmploymentExperienceDetails,
    },
    {
      value: Option.positive_and_negative,
      text: contentFor('option.POSITIVE_AND_NEGATIVE'),
      block: positiveAndNegativeEmploymentExperienceDetails,
    },
    {
      value: Option.mostly_negative,
      text: contentFor('option.MOSTLY_NEGATIVE'),
      block: mostlyNegativeEmploymentExperienceDetails,
    },
    { value: Option.negative, text: contentFor('option.NEGATIVE'), block: negativeEmploymentExperienceDetails },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
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
      message: contentFor('question.employment_experience.validation'),
    }),
  ],
})

// --- Education Experience Group ---

const positiveEducationExperienceDetails = GovUKCharacterCount({
  code: Question.positive_education_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.positive)),
})

const mostlyPositiveEducationExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_positive_education_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.mostly_positive)),
})

const positiveAndNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.positive_and_negative_education_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.positive_and_negative)),
})

const mostlyNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.mostly_negative_education_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.mostly_negative)),
})

const negativeEducationExperienceDetails = GovUKCharacterCount({
  code: Question.negative_education_experience_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.education_experience).match(Condition.Equals(Option.negative)),
})

export const educationExperience = GovUKRadioInput({
  code: Question.education_experience,
  fieldset: {
    legend: {
      text: contentFor('question.education_experience.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.positive, text: contentFor('option.POSITIVE'), block: positiveEducationExperienceDetails },
    {
      value: Option.mostly_positive,
      text: contentFor('option.MOSTLY_POSITIVE'),
      block: mostlyPositiveEducationExperienceDetails,
    },
    {
      value: Option.positive_and_negative,
      text: contentFor('option.POSITIVE_AND_NEGATIVE'),
      block: positiveAndNegativeEducationExperienceDetails,
    },
    {
      value: Option.mostly_negative,
      text: contentFor('option.MOSTLY_NEGATIVE'),
      block: mostlyNegativeEducationExperienceDetails,
    },
    { value: Option.negative, text: contentFor('option.NEGATIVE'), block: negativeEducationExperienceDetails },
    { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.education_experience.validation'),
    }),
  ],
})

// --- Change Employment And Education Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.has_made_changes),
  ),
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.is_making_changes),
  ),
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.wants_to_make_changes_knows_how_to),
  ),
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.wants_to_make_changes_needs_help),
  ),
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.thinking_about_making_changes),
  ),
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.does_not_want_to_make_changes),
  ),
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_and_education_changes).match(
    Condition.Equals(CommonOption.does_not_want_to_answer),
  ),
})

export const employmentAndEducationChanges = GovUKRadioInput({
  code: Question.employment_and_education_changes,
  fieldset: {
    legend: {
      text: contentFor('question.employment_and_education_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadePositiveChangesDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: isActivelyMakingChangesDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: commonContentFor('or') },
    { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.employment_and_education_changes.validation'),
    }),
  ],
})
