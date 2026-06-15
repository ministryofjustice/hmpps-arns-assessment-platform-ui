import {and, Answer, Condition, Format, not, or} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKBody, GovUKSummaryList, GovUKTabs,} from '@ministryofjustice/hmpps-forge/govuk-components'
import {SANGenerators} from "../../../../../../generators/customGenerator";
import {currentEmploymentStatus, typeOfEmployment} from "../current-employment/fields";
import { locale } from '../../constants/locale'
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
  strengthsProtectiveFactors,
} from "../employment-education-summary/fields";
import { CaseData } from '../../../../constants/formVersion';
import { Question } from '../../constants/question';
import { Step } from '../../constants/step';
import { commonLocale } from '../../../../constants/locale';
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons';
import { Option } from '../../constants/option';

// --- Employment and Education Summary Group ---

const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.question[Question.current_employment_status], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(currentEmploymentStatus.items, Answer(Question.current_employment_status))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(typeOfEmployment.items, Answer(Question.type_of_employment)), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.current_employment.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.employment_sector], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: Answer(Question.employment_sector)}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
      visibleWhen: and(
        or(
          Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
          Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed))),
        Answer(Question.employment_sector).match(Condition.String.HasMinLength(1)),),
    },
    {
      key: {text: Format(locale.question[Question.employment_history], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentHistory.items, Answer(Question.employment_history))}),
          GovUKBody({text: Answer(Question.continuous_employment_history_employment_details), size: "s"}),
          GovUKBody({text: Answer(Question.changes_often_employment_history_employment_details), size: "s"}),
          GovUKBody({text: Answer(Question.unstable_employment_history_employment_details), size: "s"}),
          GovUKBody({text: Answer(Question.unknown_employment_history_employment_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
      visibleWhen: not(or(Answer(Question.had_previous_employment_unavailable_for_work).match(Condition.Equals(Option.no_has_never_been_employed)),
        Answer(Question.had_previous_employment_actively_looking_for_work).match(Condition.Equals(Option.no_has_never_been_employed)),
        Answer(Question.had_previous_employment_not_looking_for_work).match(Condition.Equals(Option.no_has_never_been_employed)))),
    },
    {
      key: {text: Format(locale.question[Question.day_to_day_commitments], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.caring),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.caring))}),
          GovUKBody({text: Answer(Question.day_to_day_caring_responsibilities_details), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.children),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.children))}),
          GovUKBody({text: Answer(Question.day_to_day_child_responsibilities_details), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.studying),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.studying))}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.volunteering),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.volunteering))}),
          GovUKBody({text: Answer(Question.day_to_day_volunteering_responsibilities_details), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.other),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.other))}),
          GovUKBody({text: Answer(Question.day_to_day_other_commitments_details), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.unknown),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.unknown))}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(dayToDayCommitments.items, Option.none),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.none))}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.academic_qualification], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(academicQualification.items, Answer(Question.academic_qualification)) }),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.professional_qualification], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(professionalQualifications.items, Answer(Question.professional_qualification)) }),
          GovUKBody({text: Answer(Question.professional_qualification_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.job_skills], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(jobSkills.items, Answer(Question.job_skills)) }),
          GovUKBody({text: Answer(Question.has_job_skills_details), size: "s"}),
          GovUKBody({text: Answer(Question.some_job_skills_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.difficulties_reading_writing_numeracy], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, Option.yes_reading),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_reading))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(readingDifficultyLevel.items, Answer(Question.reading_difficulty_level)), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, Option.yes_writing),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_writing))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(writingDifficultyLevel.items, Answer(Question.writing_difficulty_level)), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, Option.yes_numeracy),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.yes_numeracy))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(numeracyDifficultyLevel.items, Answer(Question.numeracy_difficulty_level)), size: "s"}),

          GovUKBody({text: SANGenerators.getTextFromListDefinition(difficultiesReadingWritingNumeracy.items, Option.no_difficulties),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(Condition.Array.Contains(Option.no_difficulties))}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.employment_experience], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentExperience.items, Answer(Question.employment_experience)) }),
          GovUKBody({text: Answer(Question.positive_employment_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.mostly_positive_employment_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.positive_and_negative_employment_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.mostly_negative_employment_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.negative_employment_experience_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
      visibleWhen:
        not(or(Answer(Question.had_previous_employment_unavailable_for_work).match(Condition.Equals(Option.no_has_never_been_employed)),
          Answer(Question.had_previous_employment_actively_looking_for_work).match(Condition.Equals(Option.no_has_never_been_employed)),
          Answer(Question.had_previous_employment_not_looking_for_work).match(Condition.Equals(Option.no_has_never_been_employed)))),
    },
    {
      key: {text: Format(locale.question[Question.education_experience], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(educationExperience.items, Answer(Question.education_experience)) }),
          GovUKBody({text: Answer(Question.positive_education_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.mostly_positive_education_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.positive_and_negative_education_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.mostly_negative_education_experience_details), size: "s"}),
          GovUKBody({text: Answer(Question.negative_education_experience_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
    {
      key: {text: Format(locale.question[Question.employment_and_education_changes], CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentAndEducationChanges.items, Answer(Question.employment_and_education_changes)) }),
          GovUKBody({text: Answer(Question.has_made_positive_changes_details), size: "s"}),
          GovUKBody({text: Answer(Question.actively_making_changes_details), size: "s"}),
          GovUKBody({text: Answer(Question.wants_to_make_changes_needs_help_details), size: "s"}),
          GovUKBody({text: Answer(Question.thinking_about_making_changes_details), size: "s"}),
          GovUKBody({text: Answer(Question.does_not_want_to_make_changes_details), size: "s"}),
          GovUKBody({text: Answer(Question.does_not_want_to_answer_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: Step.employed.path, text: commonLocale.change}],
      },
    },
  ],
})

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.question[Question.employment_education_strengths_protective_factors], CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(strengthsProtectiveFactors.items, Answer(Question.employment_education_strengths_protective_factors))}),
            GovUKBody({ text: Answer(Question.employment_education_strengths_protective_factors_details), size: "s" }),
            GovUKBody({ text: Answer(Question.employment_education_no_strengths_protective_factors_details), size: "s" }),
          ]
      },
      actions: {
        items: [{href: `${Step.employment_education_summary.path}#practitioner-analysis`, text: commonLocale.change, visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.question[Question.employment_education_linked_to_serious_harm], CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentOrEducationLinkedToSeriousHarm.items, Answer(Question.employment_education_linked_to_serious_harm))}),
            GovUKBody({ text: Answer(Question.employment_education_serious_harm_details), size: "s" }),
            GovUKBody({ text: Answer(Question.employment_education_no_serious_harm_details), size: "s" }),
          ]
      },
      actions: {
        items: [{href: `${Step.employment_education_summary.path}#practitioner-analysis`, text: commonLocale.change, visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.question[Question.employment_education_linked_to_reoffending], CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(employmentOrEducationLinkedReoffending.items, Answer(Question.employment_education_linked_to_reoffending))}),
            GovUKBody({ text: Answer(Question.employment_education_risk_of_reoffending_details), size: "s" }),
            GovUKBody({ text: Answer(Question.employment_education_no_risk_of_reoffending_details), size: "s" }),
          ]
      },
      actions: {
        items: [{href: `${Step.employment_education_summary.path}#practitioner-analysis`, text: commonLocale.change, visuallyHiddenText: 'name'}],
      },
    },
  ]
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'final-employment-education-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonLocale.summary,
      panel: {blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)]},
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonLocale.practitioner_analysis,
      panel: {blocks: [practitionerAnalysisSummary]},
    },
  ],
})
