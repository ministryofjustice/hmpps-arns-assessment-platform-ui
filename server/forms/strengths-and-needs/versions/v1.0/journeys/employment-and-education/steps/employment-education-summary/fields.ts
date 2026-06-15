import {
  and,
  Answer,
  Condition,
  Format,
  not,
  or,
  Self,
  validation
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {SANGenerators} from "../../../../../../generators/customGenerator";
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
  currentEmploymentStatus,
  typeOfEmployment
} from "../current-employment/fields";
import { Option } from '../../constants/option';
import { Question } from '../../constants/question';
import { CaseData } from '../../../../constants/formVersion';
import { commonLocale } from '../../../../constants/locale';
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons';
import { Step } from '../../constants/step';

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
          Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed))
        ),
        Answer(Question.employment_sector).match(Condition.String.HasMinLength(1)),
      ),
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

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.employment_education_strengths_protective_factors_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.employment_education_strengths_protective_factors).match(Condition.IsRequired()),
    Answer(Question.employment_education_strengths_protective_factors).match(Condition.Equals(Option.yes))),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_strengths_protective_factors_details],
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.employment_education_no_strengths_protective_factors_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_strengths_protective_factors).match(Condition.Equals(Option.no)),
})

export const strengthsProtectiveFactors = GovUKRadioInput({
  code: Question.employment_education_strengths_protective_factors,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_education_strengths_protective_factors], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: locale.hint[Question.employment_education_strengths_protective_factors],
  items: [
    { value: Option.yes, text: locale.option[Option.yes], block: strengthsProtectiveFactorsDetails },
    { value: Option.no, text: locale.option[Option.no], block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_strengths_protective_factors],
    }),
  ],
})

// --- Employment and Education Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.employment_education_serious_harm_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.employment_education_linked_to_serious_harm).match(Condition.IsRequired()),
    Answer(Question.employment_education_linked_to_serious_harm).match(Condition.Equals(Option.yes))),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_serious_harm_details],
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.employment_education_no_serious_harm_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_linked_to_serious_harm).match(Condition.Equals(Option.no)),
})

export const employmentOrEducationLinkedToSeriousHarm = GovUKRadioInput({
  code: Question.employment_education_linked_to_serious_harm,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_education_linked_to_serious_harm], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.option[Option.yes], block: seriousHarmDetails },
    { value: Option.no, text: locale.option[Option.no], block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_linked_to_serious_harm],
    }),
  ],
})

// --- Employment and Education Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.employment_education_risk_of_reoffending_details,
  label: commonLocale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.employment_education_linked_to_reoffending).match(Condition.IsRequired()),
    Answer(Question.employment_education_linked_to_reoffending).match(Condition.Equals(Option.yes))),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_risk_of_reoffending_details],
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.employment_education_no_risk_of_reoffending_details,
  label: commonLocale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_linked_to_reoffending).match(Condition.Equals(Option.no)),
})

export const employmentOrEducationLinkedReoffending = GovUKRadioInput({
  code: Question.employment_education_linked_to_reoffending,
  fieldset: {
    legend: {
      text: Format(locale.question[Question.employment_education_linked_to_reoffending], CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: Option.yes, text: locale.option[Option.yes], block: riskOfReoffendingDetails },
    { value: Option.no, text: locale.option[Option.no], block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: locale.validation[Question.employment_education_linked_to_reoffending],
    }),
  ],
})

export const employmentStatusSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonLocale.summary,
      panel: { blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)] },
    },
    {
      id: 'practitioner-analysis',
      label: commonLocale.practitioner_analysis,
      panel: {
        blocks: [strengthsProtectiveFactors, employmentOrEducationLinkedToSeriousHarm, employmentOrEducationLinkedReoffending, markAsCompleteButton]
      },
    },
  ],
})
