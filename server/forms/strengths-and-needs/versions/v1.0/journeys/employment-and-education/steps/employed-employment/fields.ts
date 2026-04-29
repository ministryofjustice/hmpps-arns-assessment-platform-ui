import {validation, Self, Answer, Format, when} from '@form-engine/form/builders'
import { GovUKRadioInput, GovUKCheckboxInput, GovUKCharacterCount } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'
import {GovUKCharacterCountProps} from "@form-engine-govuk-components/components/character-count/govukCharacterCount";
import {targetDateOption} from "../../../../../../../sentence-plan/versions/v1.0/journeys/goal-management/sharedFields";

// --- Employment Sector Group ---

export const employmentSector = GovUKCharacterCount({
  code: 'employment_sector',
  label: {
    text: Format('What job sector does %1 work in? \n(optional)', CaseData.Forename),
    classes: 'govuk-fieldset__legend--m',},
  maxLength: 2000,
})

// --- Employment History Group ---

const employmentHistoryContinuousEmploymentDetails = GovUKCharacterCount({
  code: 'employment_history_continuous_employment_details',
  label: 'Give details (optional)',
  hint: 'Include what type of work they\'ve done before.',
  maxLength: 2000,
  dependent: Answer('employment_history').match(Condition.Array.Contains('CONTINUOUS_EMPLOYMENT')),
})

const employmentHistoryChangesEmploymentOftenDetails = GovUKCharacterCount({
  code: 'employment_history_changes_often_employment_details',
  label: 'Give details (optional)',
  hint: 'Include what type of work they\'ve done before.',
  maxLength: 2000,
})

const employmentHistoryUnstableEmploymentDetails = GovUKCharacterCount({
  code: 'employment_history_unstable_employment_details',
  label: 'Give details (optional)',
  hint: 'Include what type of work they\'ve done before.',
  maxLength: 2000,
})

const employmentHistoryUnknownEmploymentDetails = GovUKCharacterCount({
  code: 'employment_history_unknown_employment_details',
  label: 'Give details (optional)',
  hint: 'Include what type of work they\'ve done before.',
  maxLength: 2000,
})

const employmentHistoryOptions = [
  { value: 'CONTINUOUS_EMPLOYMENT', text: 'Continuous employment history',
    hint: 'They may have had a break in employment due to things like redundancy, illness or caring for a family member.',
    block: employmentHistoryContinuousEmploymentDetails },
  { value: 'CHANGES_JOBS_OFTEN', text: 'Generally in employment but changes jobs often',
    block: employmentHistoryChangesEmploymentOftenDetails },
  { value: 'UNSTABLE_EMPLOYMENT', text: 'Unstable employment history with regular periods of unemployment',
    block: employmentHistoryUnstableEmploymentDetails },
  { value: 'UNKNOWN', text: 'Unknown',
    block: employmentHistoryUnknownEmploymentDetails }
]

export const employmentHistory = GovUKRadioInput({
  code: 'employment_history',
  fieldset: {
    legend: {
      text: Format('What is  %1 employment history?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Include their current employment.',
  items: employmentHistoryOptions,
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select their employment history',
    }),
  ],
})

// --- Day To Day Responsibilities Group ---

const dayToDayCaringResponsibilitiesDetails = GovUKCharacterCount({
  code: 'day_to_day_caring_responsibilities_details',
  label: 'Give details (optional)',
  maxLength: 2000,
  dependent: Answer('day_to_day_commitments').match(Condition.Array.Contains('CARING')),
})

const dayToDayVolunteeringDetails = GovUKCharacterCount({
  code: 'day_to_day_volunteering_responsibilities_details',
  label: 'Give details (optional)',
  maxLength: 2000,
  dependent: Answer('day_to_day_commitments').match(Condition.Array.Contains('VOLUNTEERING')),
})

const dayToDayChildResponsibilitiesDetails = GovUKCharacterCount({
  code: 'day_to_day_child_responsibilities_details',
  label: 'Give details (optional)',
  maxLength: 2000,
  dependent: Answer('day_to_day_commitments').match(Condition.Array.Contains('CHILDREN')),
})

const dayToDayEmploymentOtherDetails = GovUKCharacterCount({
  code: 'day_to_day_commitments_other_details',
  label: 'Give details (optional)',
  maxLength: 2000,
  dependent: Answer('day_to_day_commitments').match(Condition.Array.Contains('OTHER')),
})

export const dayToDayCommitments = GovUKCheckboxInput({
  code: 'day_to_day_commitments',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Does %1 have any day-to-day commitments?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    { value: 'CARING', text: 'Caring responsibilities', block: dayToDayCaringResponsibilitiesDetails },
    { value: 'CHILDREN', text: 'Child Responsibilities', block: dayToDayChildResponsibilitiesDetails },
    { value: 'STUDYING', text: 'Studying' },
    { value: 'VOLUNTEERING', text: 'Volunteering', block: dayToDayVolunteeringDetails },
    { value: 'OTHER', text: 'Other', block: dayToDayEmploymentOtherDetails },
    { value: 'UNKNOWN', text: 'Unknown' },
    { divider: 'or' },
    { value: 'NONE', text: 'None', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select if they have any additional day-to-day commitments, or select 'None'",
    }),
  ],
})

// --- Academic Qualification Group ---

export const academicQualification = GovUKRadioInput({
  code: 'academic_qualification',
  fieldset: {
    legend: {
      text: Format("Select the highest level of academic qualification %1 has completed", CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'ENTRY_LEVEL', text: 'Entry level', hint: 'For example, entry level diploma' },
    { value: 'LEVEL_1', text: 'Level 1', hint: 'For example, GCSE grades 3, 2, 1 or grades D, E, F, G' },
    { value: 'LEVEL_2', text: 'Level 2', hint: 'For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C' },
    { value: 'LEVEL_3', text: 'Level 3', hint: 'For example, A level' },
    { value: 'LEVEL_4', text: 'Level 4', hint: 'For example, higher apprenticeship' },
    { value: 'LEVEL_5', text: 'Level 5', hint: 'For example, foundation degree' },
    { value: 'LEVEL_6', text: 'Level 6', hint: 'For example, degree with honours' },
    { value: 'LEVEL_7', text: 'Level 7', hint: 'For example, master\'s degree' },
    { value: 'LEVEL_8', text: 'Level 8', hint: 'For example, doctorate' },
    { divider: 'or' },
    { value: 'NON_OF_THESE', text: 'None of these' },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select the highest level of academic qualification completed',
    }),
  ],
})

// --- Professional Vocational Qualifications Group ---

export const professionalQualifications = GovUKRadioInput({
  code: 'professional_qualification',
  fieldset: {
    legend: {
      text: Format("Does %1 have any professional or vocational qualifications?", CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes' },
    { value: 'NO', text: 'No' },
    { divider: 'or' },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they have any professional or vocational qualifications',
    }),
  ],
})

// --- Job Skills Group ---

const hasJobSkillsDetails = GovUKCharacterCount({
  code: 'has_job_skills_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const hasSomeJobSkillsDetails = GovUKCharacterCount({
  code: 'has_some_job_skills_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const hasNoJobSkillsDetails = GovUKCharacterCount({
  code: 'has_no_job_skills_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

export const jobSkills = GovUKRadioInput({
  code: 'job_skills',
  fieldset: {
    legend: {
      text: Format("Does %1 have any skills that could help them in a job or to get a job?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes',
      hint: 'This includes any completed training, qualifications, work experience or transferable skills.',
      block: hasJobSkillsDetails},
    { value: 'NO', text: 'No' ,
      hint: 'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
      block: hasSomeJobSkillsDetails},
    { divider: 'or' },
    { value: 'UNKNOWN', text: 'Unknown',
      hint: 'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.',
      block: hasNoJobSkillsDetails},
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they have any skills that could help them in a job or to get a job',
    }),
  ],
})

// --- Difficulties with Reading, Writing or Numeracy Group ---

const readingDifficultyLevel = GovUKRadioInput({
  code: 'reading_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: 'Significant difficulties' },
    { value: 'SOME', text: 'Some difficulties' },
  ],
})

const writingDifficultyLevel = GovUKRadioInput({
  code: 'writing_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: 'Significant difficulties' },
    { value: 'SOME', text: 'Some difficulties' },
  ],
})

const numeracyDifficultyLevel = GovUKRadioInput({
  code: 'numeracy_difficulty_level',
  fieldset: {
    legend: {
      text: 'Select level of difficulty',
    },
  },
  items: [
    { value: 'SIGNIFICANT', text: 'Significant difficulties' },
    { value: 'SOME', text: 'Some difficulties' },
  ],
})

export const difficultiesReadingWritingNumeracy = GovUKCheckboxInput({
  code: 'difficulties_reading_writin_numeracy',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Does %1 have difficulties with reading, writing or numeracy?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    { value: 'YES_READING', text: 'Yes, with reading', block: readingDifficultyLevel },
    { value: 'YES_WRITING', text: 'Yes, with writing', block: writingDifficultyLevel },
    { value: 'YES_NUMERACY', text: 'Yes, with numeracy', block: numeracyDifficultyLevel },
    { divider: 'or' },
    { value: 'NO', text: 'No difficulties', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'",
    }),
  ],
})

// --- Employment Experience Group ---

const positiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'positive_employment_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const mostlyPositiveEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'mostly_positive_employment_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const positiveAndNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'positive_and_negative_employment_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const mostlyNegativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'mostly_negative_employment_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const negativeEmploymentExperienceDetails = GovUKCharacterCount({
  code: 'negative_employment_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

export const employmentExperience = GovUKRadioInput({
  code: 'employment_experience',
  fieldset: {
    legend: {
      text: Format("What is %1 overall experience of employment?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'POSITIVE', text: 'Positive', block: positiveEmploymentExperienceDetails},
    { value: 'MOSTLY_POSITIVE', text: 'Mostly positive', block: mostlyPositiveEmploymentExperienceDetails},
    { value: 'POSITIVE_AND_NEGATIVE', text: 'Positive and negative', block: positiveAndNegativeEmploymentExperienceDetails},
    { value: 'MOSTLY_NEGATIVE', text: 'Mostly negative', block: mostlyNegativeEmploymentExperienceDetails},
    { value: 'POSITIVE_AND_NEGATIVE', text: 'Negative', block: negativeEmploymentExperienceDetails},
    { value: 'UNKNOWN', text: 'Unknown'},
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select their overall experience of employment',
    }),
  ],
})

// --- Education Experience Group ---

const positiveEducationExperienceDetails = GovUKCharacterCount({
  code: 'positive_education_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const mostlyPositiveEducationExperienceDetails = GovUKCharacterCount({
  code: 'mostly_positive_education_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const positiveAndNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'positive_and_negative_education_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const mostlyNegativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'mostly_negative_education_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const negativeEducationExperienceDetails = GovUKCharacterCount({
  code: 'negative_education_experience_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

export const educationExperience = GovUKRadioInput({
  code: 'education_experience',
  fieldset: {
    legend: {
      text: Format("What is %1 overall experience of employment?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'POSITIVE', text: 'Positive', block: positiveEducationExperienceDetails},
    { value: 'MOSTLY_POSITIVE', text: 'Mostly Positive', block: mostlyPositiveEducationExperienceDetails},
    { value: 'POSITIVE_AND_NEGATIVE', text: 'Positive and Negative', block: positiveAndNegativeEducationExperienceDetails},
    { value: 'MOSTLY_NEGATIVE', text: 'Mostly Negative', block: mostlyNegativeEducationExperienceDetails},
    { value: 'POSITIVE_AND_NEGATIVE', text: 'Negative', block: negativeEducationExperienceDetails},
    { value: 'UNKNOWN', text: 'Unknown'},
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select their experience of education',
    }),
  ],
})

// --- Change Employment And Education Group ---

const hasMadePositiveChangesDetails = GovUKCharacterCount({
  code: 'has_made_positive_changes_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const isActivelyMakingChangesDetails = GovUKCharacterCount({
  code: 'actively_making_changes_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const wantsToMakeChangesKnowsHowDetails = GovUKCharacterCount({
  code: 'wants_to_make_changes_knows_how_to_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const wantsToMakeChangesNeedsHelpDetails = GovUKCharacterCount({
  code: 'wants_to_make_changes_needs_help_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const thinkingAboutMakingChangesDetails = GovUKCharacterCount({
  code: 'thinkging_about_making_changes_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const doesNotWantToMakeChangesDetails = GovUKCharacterCount({
  code: 'does_not_want_to_make_changes_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

const doesNotWantToAnswerDetails = GovUKCharacterCount({
  code: 'does_not_want_answer_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

export const employmentAndEducationChanges = GovUKRadioInput({
  code: 'employment_and_education_changes',
  fieldset: {
    legend: {
      text: Format("Does %1 want to make changes to their employment and education?", CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'HAS_MADE_CHANGES', text: 'I have already made positive changes and want to maintain them',
      block: hasMadePositiveChangesDetails},
    { value: 'IS_MAKING_CHANGES', text: 'I am actively making changes',
      block: isActivelyMakingChangesDetails},
    { value: 'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO', text: 'I want to make changes and know how to',
      block: wantsToMakeChangesKnowsHowDetails},
    { value: 'WANTS_TO_MAKE_CHANGES_NEEDS_HELP', text: 'I want to make changes but need help',
      block: wantsToMakeChangesNeedsHelpDetails},
    { value: 'THINKING_ABOUT_MAKING_CHANGES', text: 'I am thinking about making changes',
      block: thinkingAboutMakingChangesDetails},
    { value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', text: 'I do not want to make changes',
      block: doesNotWantToMakeChangesDetails},
    { value: 'DOES_NOT_WANT_TO_ANSWER', text: 'I do not want to answer',
      block: doesNotWantToAnswerDetails},
    { divider: 'or' },
    { value: 'NOT_PRESENT', text: Format("%1 is not present", CaseData.Forename),
      block: hasNoJobSkillsDetails},
    { value: 'UNKNOWN', text: 'Not applicable'},
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their employment and education',
    }),
  ],
})
