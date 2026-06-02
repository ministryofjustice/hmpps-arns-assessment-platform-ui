import {
  Answer,
  block,
  Condition,
  Format,
  not,
  or,
  Self,
  validation
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKCharacterCount,
  GovUKLinkButton,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants'
import {SANGenerators} from "../../../../../../generators/customGenerator";
import locale from '../../locale.json'
import {
  academicQualification,
  dayToDayCommitments,
  difficultiesReadingWritingNumeracy,
  educationExperience,
  employmentAndEducationChanges,
  employmentExperience,
  employmentHistory,
  jobSkills,
  numeracyDifficultyLevel,
  professionalQualifications,
  readingDifficultyLevel,
  writingDifficultyLevel
} from "../employed-employment/fields";
import {
  currentEmploymentStatus,
  typeOfEmployment
} from "../current-employment/fields";

// --- Employment and Education Summary Group ---

export const myCoolFunction = (items: any[], value: string) => {

  const myFilteredItems = items.filter(x => !x.divider)
    .map(x => ({ value: x.value, text: x.text }))

  return SANGenerators.getTextFromListDefinition(myFilteredItems, value)
}

const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.current_employment.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(currentEmploymentStatus.items, Answer('current_employment_status'))}),
          GovUKBody({text: myCoolFunction(typeOfEmployment.items, Answer('type_of_employment')), size: "s"}),
        ]
      },
      actions: {
        items: [{href: 'current-employment', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.employment_sector.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: Answer('employment_sector')}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
      visibleWhen: or(Answer('current_employment_status').match(Condition.Equals('EMPLOYED')),
        Answer('current_employment_status').match(Condition.Equals('SELF_EMPLOYED'))),
    },
    {
      key: {text: Format(locale.employed_employment.employment_history.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(employmentHistory.items, Answer('employment_history'))}),
          GovUKBody({text: Answer('employment_history_details'), size: "s"})
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
      visibleWhen: not(or(Answer('had_previous_employment_unavailable_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
        Answer('had_previous_employment_actively_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
        Answer('had_previous_employment_not_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')))),
    },
    {
      key: {text: Format(locale.employed_employment.day_to_day_commitments.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'CARING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('CARING'))}),
          GovUKBody({text: Answer('day_to_day_caring_responsibilities_details'), size: "s"}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'CHILDREN'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('CHILDREN'))}),
          GovUKBody({text: Answer('day_to_day_child_responsibilities_details'), size: "s"}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'STUDYING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('STUDYING'))}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'VOLUNTEERING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('VOLUNTEERING'))}),
          GovUKBody({text: Answer('day_to_day_volunteering_responsibilities_details'), size: "s"}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'OTHER'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('OTHER'))}),
          GovUKBody({text: Answer('day_to_day_other_commitments_details'), size: "s"}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'UNKNOWN'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('UNKNOWN'))}),

          GovUKBody({text: myCoolFunction(dayToDayCommitments.items, 'NONE'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('NONE'))}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.academic_qualification.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(academicQualification.items, Answer('academic_qualification')) }),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.professional_qualifications.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(professionalQualifications.items, Answer('professional_qualification')) }),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.job_skills.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(jobSkills.items, Answer('job_skills')) }),
          GovUKBody({text: Answer('has_job_skills_details')}),
          GovUKBody({text: Answer('some_job_skills_details')}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.difficulties_reading_writing_numeracy.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(difficultiesReadingWritingNumeracy.items, 'YES_READING'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_READING'))}),
          GovUKBody({text: myCoolFunction(readingDifficultyLevel.items, Answer('reading_difficulty_level')), size: "s"}),

          GovUKBody({text: myCoolFunction(difficultiesReadingWritingNumeracy.items, 'YES_WRITING'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_WRITING'))}),
          GovUKBody({text: myCoolFunction(writingDifficultyLevel.items, Answer('writing_difficulty_level')), size: "s"}),

          GovUKBody({text: myCoolFunction(difficultiesReadingWritingNumeracy.items, 'YES_NUMERACY'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_NUMERACY'))}),
          GovUKBody({text: myCoolFunction(numeracyDifficultyLevel.items, Answer('numeracy_difficulty_level')), size: "s"}),

          GovUKBody({text: myCoolFunction(difficultiesReadingWritingNumeracy.items, 'NO_DIFFICULTIES'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('NO_DIFFICULTIES'))}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.employment_experience.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(employmentExperience.items, Answer('employment_experience')) }),
          GovUKBody({text: Answer('positive_employment_experience_details')}),
          GovUKBody({text: Answer('mostly_positive_employment_experience_details')}),
          GovUKBody({text: Answer('positive_and_negative_employment_experience_details')}),
          GovUKBody({text: Answer('mostly_negative_employment_experience_details')}),
          GovUKBody({text: Answer('negative_employment_experience_details')}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
      visibleWhen:
        not(or(Answer('had_previous_employment_unavailable_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
          Answer('had_previous_employment_actively_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
          Answer('had_previous_employment_not_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')))),
    },
    {
      key: {text: Format(locale.employed_employment.education_experience.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(educationExperience.items, Answer('education_experience')) }),
          GovUKBody({text: Answer('positive_education_experience_details')}),
          GovUKBody({text: Answer('mostly_positive_education_experience_details')}),
          GovUKBody({text: Answer('positive_and_negative_education_experience_details')}),
          GovUKBody({text: Answer('mostly_negative_education_experience_details')}),
          GovUKBody({text: Answer('negative_education_experience_details')}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
    {
      key: {text: Format(locale.employed_employment.employment_and_education_changes.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: myCoolFunction(employmentAndEducationChanges.items, Answer('employment_and_education_changes')) }),
          GovUKBody({text: Answer('has_made_positive_changes_details')}),
          GovUKBody({text: Answer('actively_making_changes_details')}),
          GovUKBody({text: Answer('wants_to_make_changes_needs_help_details')}),
          GovUKBody({text: Answer('thinkging_about_making_changes_details')}),
          GovUKBody({text: Answer('does_not_want_to_make_changes_details')}),
          GovUKBody({text: Answer('does_not_want_to_answer_details')}),
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
    },
  ],
})

// --- Practitioner Analysis Button Group ---

const goToPractitionerAnalysis = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href:'employment-education-summary#practitioner-analysis',
  classes: 'govuk-button--secondary'
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strenthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: 'strengths_protective_factors_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('strengths_protective_factors').match(Condition.Equals('YES')),
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: 'no_strengths_protective_factors_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('strengths_protective_factors').match(Condition.Equals('NO')),
})

export const strenthsProtectiveFactors = GovUKRadioInput({
  code: 'strengths_protective_factors',
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.strengths_protective_factors.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint:'Include any strategies, people or support networks that helped.',
  items: [
    { value: 'YES', text: locale.options['YES'], block: strenthsProtectiveFactorsDetails },
    { value: 'NO', text: locale.options['NO'], block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if there are any strengths or protective factors',
    }),
  ],
})

// --- Employment and Education Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: 'serious_harm_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_education_linked_to_serious_harm').match(Condition.Equals('YES')),
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: 'no_serious_harm_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_education_linked_to_serious_harm').match(Condition.Equals('NO')),
})

export const employmentOrEducationLinkedToSeriousHarm = GovUKRadioInput({
  code: 'employment_education_linked_to_serious_harm',
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.employment_education_linked_to_serious_harm.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: locale.options['YES'], block: seriousHarmDetails },
    { value: 'NO', text: locale.options['NO'], block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if linked to risk of serious harm',
    }),
  ],
})

// --- Employment and Education Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: 'risk_of_reoffending_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_education_linked_to_reoffending').match(Condition.Equals('YES')),
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: 'no_risk_of_reoffending_details',
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer('employment_education_linked_to_reoffending').match(Condition.Equals('NO')),
})

export const employmentOrEducationLinkedReoffending = GovUKRadioInput({
  code: 'employment_education_linked_to_reoffending',
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.employment_education_linked_to_reoffending.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: locale.options['YES'], block: riskOfReoffendingDetails },
    { value: 'NO', text: locale.options['NO'], block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if linked to risk of reoffending',
    }),
  ],
})

// --- Mark As Complete Button Group ---

const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as complete',
  name: 'action',
  value: 'save',
})

export const employmentStatusSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [employmentStatusSummary, goToPractitionerAnalysis] },
    },
    {
      id: 'practitioner-analysis',
      label: 'Practitioner analysis',
      panel: {
        blocks: [strenthsProtectiveFactors, employmentOrEducationLinkedToSeriousHarm, employmentOrEducationLinkedReoffending, markAsCompleteButton]
      },
    },
  ],
})
