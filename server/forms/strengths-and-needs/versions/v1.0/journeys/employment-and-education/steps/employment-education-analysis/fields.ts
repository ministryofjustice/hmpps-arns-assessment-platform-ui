import {Answer, Condition, Format, not, or} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKBody, GovUKLinkButton, GovUKSummaryList, GovUKTabs,} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants'
import {SANGenerators} from "../../../../../../generators/customGenerator";
import {currentEmploymentStatus, typeOfEmployment} from "../current-employment/fields";
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
  employmentOrEducationLinkedReoffending,
  employmentOrEducationLinkedToSeriousHarm,
  strenthsProtectiveFactors, summaryCurrentEmploymentStatus
} from "../employment-education-summary/fields";

// --- Employment and Education Summary Group ---

const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.current_employment.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(summaryCurrentEmploymentStatus, Answer('current_employment_status'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(typeOfEmployment.items, Answer('type_of_employment')), size: "s"}),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentHistory.items, Answer('employment_history'))}),
          GovUKBody({text: Answer('employment_history_details'), size: "s"})
        ]
      },
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
      },
      visibleWhen:  not(or(Answer('had_previous_employment_unavailable_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
        Answer('had_previous_employment_actively_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')),
        Answer('had_previous_employment_not_looking_for_work').match(Condition.Equals('NO_HAS_NEVER_BEEN_EMPLOYED')))),
    },
    {
      key: {text: Format(locale.employed_employment.day_to_day_commitments.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'CARING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('CARING'))}),
          GovUKBody({text: Answer('day_to_day_caring_responsibilities_details'), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'CHILDREN'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('CHILDREN'))}),
          GovUKBody({text: Answer('day_to_day_child_responsibilities_details'), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'STUDYING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('STUDYING'))}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'VOLUNTEERING'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('VOLUNTEERING'))}),
          GovUKBody({text: Answer('day_to_day_volunteering_responsibilities_details'), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'OTHER'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('OTHER'))}),
          GovUKBody({text: Answer('day_to_day_other_commitments_details'), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'UNKNOWN'),
            visibleWhen: Answer('day_to_day_commitments').match(Condition.Array.Contains('UNKNOWN'))}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, 'NONE'),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(academicQualification.items, Answer('academic_qualification')) }),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(professionalQualifications.items, Answer('professional_qualification')) }),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(jobSkills.items, Answer('job_skills')) }),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, 'YES_READING'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_READING'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(readingDifficultyLevel.items, Answer('reading_difficulty_level')), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, 'YES_WRITING'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_WRITING'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(writingDifficultyLevel.items, Answer('writing_difficulty_level')), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, 'YES_NUMERACY'),
            visibleWhen: Answer('difficulties_reading_writing_numeracy').match(Condition.Array.Contains('YES_NUMERACY'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(numeracyDifficultyLevel.items, Answer('numeracy_difficulty_level')), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, 'NO_DIFFICULTIES'),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentExperience.items, ) }),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentExperience.items, Answer('employment_experience')) }),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(educationExperience.items, Answer('education_experience')) }),
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
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentAndEducationChanges.items, Answer('employment_and_education_changes')) }),
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

const goToPractitionerAnalysisButton = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href:'employment-education-analysis#practitioner-analysis-summary',
  classes: 'govuk-button--secondary'
})

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.practitioner_analysis.strengths_protective_factors.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(strenthsProtectiveFactors.items, Answer('strengths_protective_factors'))}),
            GovUKBody({ text: Answer('strengths_protective_factors_details'), size: "s" }),
            GovUKBody({ text: Answer('no_strengths_protective_factors_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'employment-education-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.practitioner_analysis.employment_education_linked_to_serious_harm.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentOrEducationLinkedToSeriousHarm.items, Answer('employment_education_linked_to_serious_harm'))}),
            GovUKBody({ text: Answer('serious_harm_details'), size: "s" }),
            GovUKBody({ text: Answer('no_serious_harm_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'employment-education-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.practitioner_analysis.employment_education_linked_to_reoffending.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentOrEducationLinkedReoffending.items, Answer('employment_education_linked_to_reoffending'))}),
            GovUKBody({ text: Answer('risk_of_reoffending_details'), size: "s" }),
            GovUKBody({ text: Answer('no_risk_of_reoffending_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'employment-education-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
  ]
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'final-employment-education-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: 'Summary',
      panel: {blocks: [employmentStatusSummary, goToPractitionerAnalysisButton]},
    },
    {
      id: 'practitioner-analysis-summary',
      label: 'Practitioner analysis',
      panel: {blocks: [practitionerAnalysisSummary]},
    },
  ],
})
