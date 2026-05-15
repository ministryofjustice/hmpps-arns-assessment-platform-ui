import {validation, Self, Answer, Format, and, Condition, not, or} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount, GovUKBackLink,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'
import locale from '../../locale.json'

export const backButton = GovUKBackLink({ href: '/strengths-and-needs/v1.0/employment-and-education/current-employment' })

// --- Employment Sector Group ---

export const employmentSector = GovUKCharacterCount({
  code: 'employment_sector',
  label: {
    text: Format(locale.employed_employment.employment_sector.text, CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',
  },
  maxLength: 2000,
  visibleWhen: or(Answer('current_employment').match(Condition.Equals('EMPLOYED')),
    Answer('current_employment').match(Condition.Equals('SELF_EMPLOYED'))),
})

// --- Employment History Group ---

const continuousEmploymentHistoryEmploymentDetails = GovUKCharacterCount({
  code: 'continuous_employment_history_employment_details',
  label: locale.optional_details,
  hint: locale.employed_employment.previous_employment_history_hint,
  maxLength: 2000,
  dependentWhen: Answer('employment_history').match(Condition.Equals('CONTINUOUS_EMPLOYMENT')),
})

const changesOftenEmploymentHistoryEmploymentOftenDetails = GovUKCharacterCount({
  code: 'changes_often_employment_history_employment_details',
  label: locale.optional_details,
  hint: locale.employed_employment.previous_employment_history_hint,
  maxLength: 2000,
  dependentWhen: Answer('employment_history').match(Condition.Equals('CHANGES_JOBS_OFTEN')),
})

const unstableEmploymentHistoryEmploymentDetails = GovUKCharacterCount({
  code: 'unstable_employment_history_employment_details',
  label: locale.optional_details,
  hint: locale.employed_employment.previous_employment_history_hint,
  maxLength: 2000,
  dependentWhen: Answer('employment_history').match(Condition.Equals('UNSTABLE_EMPLOYMENT')),
})

const unknownEmploymentHistoryDetails = GovUKCharacterCount({
  code: 'unknown_employment_history_employment_details',
  label: locale.optional_details,
  hint: locale.employed_employment.previous_employment_history_hint,
  maxLength: 2000,
  dependentWhen: Answer('employment_history').match(Condition.Equals('UNKNOWN')),
})

const employmentHistoryOptions = [
  {
    value: 'CONTINUOUS_EMPLOYMENT',
    text: locale.options['CONTINUOUS_EMPLOYMENT'],
    hint: 'They may have had a break in employment due to things like redundancy, illness or caring for a family member.',
    block: continuousEmploymentHistoryEmploymentDetails,
  },
  {
    value: 'CHANGES_JOBS_OFTEN',
    text: locale.options['CHANGES_JOBS_OFTEN'],
    block: changesOftenEmploymentHistoryEmploymentOftenDetails,
  },
  {
    value: 'UNSTABLE_EMPLOYMENT',
    text: locale.options['UNSTABLE_EMPLOYMENT'],
    block: unstableEmploymentHistoryEmploymentDetails,
  },
  { value: 'UNKNOWN',
    text: locale.options['UNKNOWN'],
    block: unknownEmploymentHistoryDetails },
]

export const employmentHistory = GovUKRadioInput({
  code: 'employment_history',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.employment_history.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Include their current employment.',
  items: employmentHistoryOptions,
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select their employment history',
    }),
  ],
})

// --- Day To Day Responsibilities Group ---

const dayToDayCaringResponsibilitiesDetails = GovUKCharacterCount({
  code: 'day_to_day_caring_responsibilities_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen:
    Answer('day_to_day_commitments').match(Condition.Array.Contains('CARING'))
})

const dayToDayVolunteeringDetails = GovUKCharacterCount({
  code: 'day_to_day_volunteering_responsibilities_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('VOLUNTEERING'))
})

const dayToDayChildResponsibilitiesDetails = GovUKCharacterCount({
  code: 'day_to_day_child_responsibilities_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen:
    Answer('day_to_day_commitments').match(Condition.Array.Contains('CHILDREN'))
})

const dayToDayOtherCommitmentsDetails = GovUKCharacterCount({
  code: 'day_to_day_other_commitments_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen:
    Answer('day_to_day_commitments').match(Condition.Array.Contains('OTHER'))
})

export const dayToDayCommitments = GovUKCheckboxInput({
  code: 'day_to_day_commitments',
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.day_to_day_commitments.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    { value: 'CARING', text: locale.options['CARING'], block: dayToDayCaringResponsibilitiesDetails },
    { value: 'CHILDREN', text: locale.options['CHILDREN'], block: dayToDayChildResponsibilitiesDetails },
    { value: 'STUDYING', text: locale.options['STUDYING'] },
    { value: 'VOLUNTEERING', text: locale.options['VOLUNTEERING'], block: dayToDayVolunteeringDetails },
    { value: 'OTHER', text: locale.options['OTHER'], block: dayToDayOtherCommitmentsDetails },
    { value: 'UNKNOWN', text: locale.options['UNKNOWN'] },
    { divider: 'or' },
    { value: 'NONE', text: locale.options['NONE'], behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: "Select if they have any additional day-to-day commitments, or select 'None'",
    }),
  ],
})

// --- Academic Qualification Group ---

export const academicQualification = GovUKRadioInput({
  code: 'academic_qualification',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.academic_qualification.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'ENTRY_LEVEL', text: locale.options['ENTRY_LEVEL'], hint: 'For example, entry level diploma' },
    { value: 'LEVEL_1', text: locale.options['LEVEL_1'], hint: 'For example, GCSE grades 3, 2, 1 or grades D, E, F, G' },
    { value: 'LEVEL_2', text: locale.options['LEVEL_2'], hint: 'For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C' },
    { value: 'LEVEL_3', text: locale.options['LEVEL_3'], hint: 'For example, A level' },
    { value: 'LEVEL_4', text: locale.options['LEVEL_4'], hint: 'For example, higher apprenticeship' },
    { value: 'LEVEL_5', text: locale.options['LEVEL_5'], hint: 'For example, foundation degree' },
    { value: 'LEVEL_6', text: locale.options['LEVEL_6'], hint: 'For example, degree with honours' },
    { value: 'LEVEL_7', text: locale.options['LEVEL_7'], hint: "For example, master's degree" },
    { value: 'LEVEL_8', text: locale.options['LEVEL_8'], hint: 'For example, doctorate' },
    { divider: 'or' },
    { value: 'NON_OF_THESE', text: locale.options['NON_OF_THESE'] },
    { value: 'UNKNOWN', text: locale.options['UNKNOWN'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the highest level of academic qualification completed',
    }),
  ],
})

// --- Professional Vocational Qualifications Group ---

const professionalQualificationsDetails = GovUKCharacterCount({
  code: 'professional_qualification_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('professional_qualification').match(Condition.Equals('YES')),
})

export const professionalQualifications = GovUKRadioInput({
  code: 'professional_qualification',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.professional_qualifications.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: locale.options['YES'], block: professionalQualificationsDetails },
    { value: 'NO', text: locale.options['NO']},
    { divider: 'or' },
    { value: 'UNKNOWN', text: locale.options['UNKNOWN'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if they have any professional or vocational qualifications',
    }),
  ],
})

// --- Job Skills Group ---

const hasJobSkillsDetails = GovUKCharacterCount({
  code: 'has_job_skills_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('job_skills').match(Condition.Equals('YES')),
})

const someJobSkillsDetails = GovUKCharacterCount({
  code: 'some_job_skills_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('job_skills').match(Condition.Equals('SOME_SKILLS')),
})

export const jobSkills = GovUKRadioInput({
  code: 'job_skills',
  fieldset: {
    legend: {
      text: Format(
        locale.employed_employment.job_skills.text,
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'YES',
      text: locale.options['YES'],
      hint: 'This includes any completed training, qualifications, work experience or transferable skills.',
      block: hasJobSkillsDetails,
    },
    {
      value: 'SOME_SKILLS',
      text: locale.options['SOME_SKILLS'],
      hint: 'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
      block: someJobSkillsDetails,
    },
    {
      value: 'NO',
      text: locale.options['NO'],
      hint: 'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.'
    },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if they have any skills that could help them in a job or to get a job',
    }),
  ],
})

// --- Difficulties with Reading, Writing or Numeracy Group ---

export const readingDifficultyLevel = GovUKRadioInput({
  code: 'reading_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: locale.options['SIGNIFICANT'] },
    { value: 'SOME', text: locale.options['SOME'] },
  ],
  dependentWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_READING'))
})

export const writingDifficultyLevel = GovUKRadioInput({
  code: 'writing_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: locale.options['SIGNIFICANT'] },
    { value: 'SOME', text: locale.options['SOME'] },
  ],
  dependentWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_WRITING'))
})

export const numeracyDifficultyLevel = GovUKRadioInput({
  code: 'numeracy_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: locale.options['SIGNIFICANT'] },
    { value: 'SOME', text: locale.options['SOME'] },
  ],
  dependentWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_NUMERACY'))
})

export const difficultiesReadingWritingNumeracy = GovUKCheckboxInput({
  code: 'difficulties_reading_writing_numeracy',
  multiple: true,
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.difficulties_reading_writing_numeracy.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    { value: 'YES_READING', text: locale.options['YES_READING'], block: readingDifficultyLevel },
    { value: 'YES_WRITING', text: locale.options['YES_WRITING'], block: writingDifficultyLevel },
    { value: 'YES_NUMERACY', text: locale.options['YES_NUMERACY'], block: numeracyDifficultyLevel },
    { divider: 'or' },
    { value: 'NO_DIFFICULTIES', text: locale.options['NO_DIFFICULTIES'], behaviour: 'exclusive' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'",
    }),
  ],
})

// --- Employment Experience Group ---

const positiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'positive_employment_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_experience').match(Condition.Equals('POSITIVE')),
})

const mostlyPositiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'mostly_positive_employment_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_experience').match(Condition.Equals('MOSTLY_POSITIVE')),
})

const positiveAndNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'positive_and_negative_employment_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_experience').match(Condition.Equals('POSITIVE_AND_NEGATIVE')),
})

const mostlyNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'mostly_negative_employment_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_experience').match(Condition.Equals('MOSTLY_NEGATIVE')),
})

const negativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'negative_employment_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_experience').match(Condition.Equals('NEGATIVE')),
})

export const employmentExperience = GovUKRadioInput({
  code: 'employment_experience',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.employment_experience.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'POSITIVE', text: locale.options['POSITIVE'], block: positiveEmploymentExperienceDetails },
    { value: 'MOSTLY_POSITIVE', text: locale.options['MOSTLY_POSITIVE'], block: mostlyPositiveEmploymentExperienceDetails },
    { value: 'POSITIVE_AND_NEGATIVE', text: locale.options['POSITIVE_AND_NEGATIVE'], block: positiveAndNegativeEmploymentExperienceDetails },
    { value: 'MOSTLY_NEGATIVE', text: locale.options['MOSTLY_NEGATIVE'], block: mostlyNegativeEmploymentExperienceDetails },
    { value: 'NEGATIVE', text: locale.options['NEGATIVE'], block: negativeEmploymentExperienceDetails },
    { value: 'UNKNOWN', text: locale.options['UNKNOWN']},
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select their ' +
        'overall experience of employment',
    }),
  ],
})

// --- Education Experience Group ---

const positiveEducationExperienceDetails = GovUKCharacterCount({
  code: 'positive_education_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('education_experience').match(Condition.Equals('POSITIVE')),
})

const mostlyPositiveEducationExperienceDetails = GovUKCharacterCount({
  code: 'mostly_positive_education_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('education_experience').match(Condition.Equals('MOSTLY_POSITIVE')),
})

const positiveAndNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'positive_and_negative_education_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('education_experience').match(Condition.Equals('POSITIVE_AND_NEGATIVE')),
})

const mostlyNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'mostly_negative_education_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('education_experience').match(Condition.Equals('MOSTLY_NEGATIVE')),
})

const negativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'negative_education_experience_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('education_experience').match(Condition.Equals('NEGATIVE')),
})

export const educationExperience = GovUKRadioInput({
  code: 'education_experience',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.education_experience.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'POSITIVE', text: locale.options['POSITIVE'], block: positiveEducationExperienceDetails },
    { value: 'MOSTLY_POSITIVE', text: locale.options['MOSTLY_POSITIVE'], block: mostlyPositiveEducationExperienceDetails },
    { value: 'POSITIVE_AND_NEGATIVE', text: locale.options['POSITIVE_AND_NEGATIVE'], block: positiveAndNegativeEducationExperienceDetails },
    { value: 'MOSTLY_NEGATIVE', text: locale.options['MOSTLY_NEGATIVE'], block: mostlyNegativeEducationExperienceDetails },
    { value: 'NEGATIVE', text: locale.options['NEGATIVE'], block: negativeEducationExperienceDetails },
    { value: 'UNKNOWN', text: locale.options['UNKNOWN'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select their experience of education',
    }),
  ],
})

// --- Change Employment And Education Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: 'has_made_positive_changes_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('HAS_MADE_CHANGES')),
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: 'actively_making_changes_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('IS_MAKING_CHANGES')),
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: 'wants_to_make_changes_knows_how_to_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO')),
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: 'wants_to_make_changes_needs_help_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('WANTS_TO_MAKE_CHANGES_NEEDS_HELP')),
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: 'thinkging_about_making_changes_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('THINKING_ABOUT_MAKING_CHANGES')),
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: 'does_not_want_to_make_changes_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('DOES_NOT_WANT_TO_MAKE_CHANGES')),
})

const doesNotWantToAnswerChangesDetails = GovUKCharacterCount({
  code: 'does_not_want_to_answer_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_and_education_changes').match(Condition.Equals('DOES_NOT_WANT_TO_ANSWER')),
})

export const employmentAndEducationChanges = GovUKRadioInput({
  code: 'employment_and_education_changes',
  fieldset: {
    legend: {
      text: Format(locale.employed_employment.employment_and_education_changes.text, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'HAS_MADE_CHANGES', text: locale.options['HAS_MADE_CHANGES'], block: hasMadePositiveChangesDetails },
    { value: 'IS_MAKING_CHANGES', text: locale.options['IS_MAKING_CHANGES'], block: isActivelyMakingChangesDetails },
    { value: 'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO', text: locale.options['WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'], block: wantsToMakeChangesKnowsHowDetails },
    { value: 'WANTS_TO_MAKE_CHANGES_NEEDS_HELP', text: locale.options['WANTS_TO_MAKE_CHANGES_NEEDS_HELP'], block: wantsToMakeChangesNeedsHelpDetails },
    { value: 'THINKING_ABOUT_MAKING_CHANGES', text: locale.options['THINKING_ABOUT_MAKING_CHANGES'], block: thinkingAboutMakingChangesDetails },
    { value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', text: locale.options['DOES_NOT_WANT_TO_MAKE_CHANGES'], block: doesNotWantToMakeChangesDetails },
    { value: 'DOES_NOT_WANT_TO_ANSWER', text: locale.options['DOES_NOT_WANT_TO_ANSWER'], block: doesNotWantToAnswerChangesDetails },
    { divider: 'or' },
    { value: 'NOT_PRESENT', text: Format(locale.options['NOT_PRESENT'], CaseData.Forename) },
    { value: 'NOT_APPLICABLE', text: locale.options['NOT_APPLICABLE'] },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if they want to make changes to their employment and education',
    }),
  ],
})
