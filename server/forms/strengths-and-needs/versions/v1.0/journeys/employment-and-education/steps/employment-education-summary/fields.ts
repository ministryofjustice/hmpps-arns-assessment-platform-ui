import { and, Answer, Condition, not, or, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  academicQualification,
  educationExperience,
  employmentAndEducationChanges,
  employmentExperience,
  employmentHistory,
  jobSkills,
  numeracyDifficultyLevel,
  professionalQualifications,
  readingDifficultyLevel,
  writingDifficultyLevel,
} from '../employed/fields'
import { currentEmploymentStatus, typeOfEmployment } from '../current-employment/fields'
import { Option } from '../../constants/option'
import { Question } from '../../constants/question'
import { CaseData } from '../../../../constants/formVersion'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'
import { getDisplayTextForItems } from '../../../../../../i18n'
import { CommonOption } from '../../../../constants/commonOption';

// --- Employment and Education Summary Group ---

export const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.current_employment_status.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.current_employment_status, currentEmploymentStatus.items),
          getDisplayTextForItems(Question.type_of_employment, typeOfEmployment.items, { size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.current_employment.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.employment_sector.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [GovUKBody({ text: Answer(Question.employment_sector) })],
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
      visibleWhen: and(
        or(
          Answer(Question.current_employment_status).match(Condition.Equals(Option.employed)),
          Answer(Question.current_employment_status).match(Condition.Equals(Option.self_employed)),
        ),
        Answer(Question.employment_sector).match(Condition.String.HasMinLength(1)),
      ),
    },
    {
      key: { text: contentFor('question.employment_history.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.employment_history, employmentHistory.items),
          GovUKBody({ text: Answer(Question.continuous_employment_history_employment_details), size: 's' }),
          GovUKBody({ text: Answer(Question.changes_often_employment_history_employment_details), size: 's' }),
          GovUKBody({ text: Answer(Question.unstable_employment_history_employment_details), size: 's' }),
          GovUKBody({ text: Answer(Question.unknown_employment_history_employment_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
      visibleWhen: and(
        Answer(Question.had_previous_employment_unavailable_for_work).not.match(
          Condition.Equals(Option.no_has_never_been_employed),
        ),
        Answer(Question.had_previous_employment_actively_looking_for_work).not.match(
          Condition.Equals(Option.no_has_never_been_employed),
        ),
        Answer(Question.had_previous_employment_not_looking_for_work).not.match(
          Condition.Equals(Option.no_has_never_been_employed),
        ),
      ),
    },
    {
      key: { text: contentFor('question.day_to_day_commitments.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.day_to_day_commitments.option.CARING'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.caring)),
          }),
          GovUKBody({ text: Answer(Question.day_to_day_caring_responsibilities_details), size: 's' }),

          GovUKBody({
            text: contentFor('question.day_to_day_commitments.option.CHILDREN'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.children)),
          }),
          GovUKBody({ text: Answer(Question.day_to_day_child_responsibilities_details), size: 's' }),

          GovUKBody({
            text: contentFor('question.day_to_day_commitments.option.STUDYING'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.studying)),
          }),

          GovUKBody({
            text: contentFor('question.day_to_day_commitments.option.VOLUNTEERING'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(Option.volunteering)),
          }),
          GovUKBody({ text: Answer(Question.day_to_day_volunteering_responsibilities_details), size: 's' }),

          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(CommonOption.other)),
          }),
          GovUKBody({ text: Answer(Question.day_to_day_other_commitments_details), size: 's' }),

          GovUKBody({
            text: commonContentFor('option.UNKNOWN'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(CommonOption.unknown)),
          }),

          GovUKBody({
            text: commonContentFor('option.NONE'),
            visibleWhen: Answer(Question.day_to_day_commitments).match(Condition.Array.Contains(CommonOption.none)),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.academic_qualification.text', CaseData.ForenamePossessive) },
      value: {
        blocks: getDisplayTextForItems(Question.academic_qualification, academicQualification.items),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.professional_qualification.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.professional_qualification, professionalQualifications.items),
          GovUKBody({ text: Answer(Question.professional_qualification_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.job_skills.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.job_skills, jobSkills.items),
          GovUKBody({ text: Answer(Question.has_job_skills_details), size: 's' }),
          GovUKBody({ text: Answer(Question.some_job_skills_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor('question.difficulties_reading_writing_numeracy.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_READING'),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(
              Condition.Array.Contains(Option.yes_reading),
            ),
          }),
          getDisplayTextForItems(Question.reading_difficulty_level, readingDifficultyLevel.items, { size: 's' }),

          GovUKBody({
            text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_WRITING'),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(
              Condition.Array.Contains(Option.yes_writing),
            ),
          }),
          getDisplayTextForItems(Question.writing_difficulty_level, writingDifficultyLevel.items, { size: 's' }),

          GovUKBody({
            text: contentFor('question.difficulties_reading_writing_numeracy.option.YES_NUMERACY'),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(
              Condition.Array.Contains(Option.yes_numeracy),
            ),
          }),
          getDisplayTextForItems(Question.numeracy_difficulty_level, numeracyDifficultyLevel.items, { size: 's' }),

          GovUKBody({
            text: contentFor('question.difficulties_reading_writing_numeracy.option.NO_DIFFICULTIES'),
            visibleWhen: Answer(Question.difficulties_reading_writing_numeracy).match(
              Condition.Array.Contains(Option.no_difficulties),
            ),
          }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.employment_experience.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.employment_experience, employmentExperience.items),
          GovUKBody({ text: Answer(Question.positive_employment_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.mostly_positive_employment_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.positive_and_negative_employment_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.mostly_negative_employment_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.negative_employment_experience_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
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
    },
    {
      key: { text: contentFor('question.education_experience.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.education_experience, educationExperience.items),
          GovUKBody({ text: Answer(Question.positive_education_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.mostly_positive_education_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.positive_and_negative_education_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.mostly_negative_education_experience_details), size: 's' }),
          GovUKBody({ text: Answer(Question.negative_education_experience_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.employment_and_education_changes.text', CaseData.ForenamePossessive) },
      value: {
        blocks: [
          getDisplayTextForItems(Question.employment_and_education_changes, employmentAndEducationChanges.items),
          GovUKBody({ text: Answer(Question.has_made_positive_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.actively_making_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.wants_to_make_changes_needs_help_details), size: 's' }),
          GovUKBody({ text: Answer(Question.thinking_about_making_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.does_not_want_to_make_changes_details), size: 's' }),
          GovUKBody({ text: Answer(Question.does_not_want_to_answer_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.employed.path, text: commonContentFor('change') }],
      },
    },
  ],
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.employment_education_strengths_protective_factors_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.employment_education_strengths_protective_factors).match(Condition.IsRequired()),
    Answer(Question.employment_education_strengths_protective_factors).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_strengths_protective_factors_details.validation'),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.employment_education_no_strengths_protective_factors_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_strengths_protective_factors).match(Condition.Equals(CommonOption.no)),
})

export const strengthsProtectiveFactors = GovUKRadioInput({
  code: Question.employment_education_strengths_protective_factors,
  fieldset: {
    legend: {
      text: contentFor('question.employment_education_strengths_protective_factors.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.employment_education_strengths_protective_factors.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_strengths_protective_factors.validation'),
    }),
  ],
})

// --- Employment and Education Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.employment_education_serious_harm_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.employment_education_linked_to_serious_harm).match(Condition.IsRequired()),
    Answer(Question.employment_education_linked_to_serious_harm).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_serious_harm_details.validation'),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.employment_education_no_serious_harm_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_linked_to_serious_harm).match(Condition.Equals(CommonOption.no)),
})

export const employmentOrEducationLinkedToSeriousHarm = GovUKRadioInput({
  code: Question.employment_education_linked_to_serious_harm,
  fieldset: {
    legend: {
      text: contentFor('question.employment_education_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_linked_to_serious_harm.validation'),
    }),
  ],
})

// --- Employment and Education Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.employment_education_risk_of_reoffending_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.employment_education_linked_to_reoffending).match(Condition.IsRequired()),
    Answer(Question.employment_education_linked_to_reoffending).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_risk_of_reoffending_details.validation'),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.employment_education_no_risk_of_reoffending_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.employment_education_linked_to_reoffending).match(Condition.Equals(CommonOption.no)),
})

export const employmentOrEducationLinkedReoffending = GovUKRadioInput({
  code: Question.employment_education_linked_to_reoffending,
  fieldset: {
    legend: {
      text: contentFor('question.employment_education_linked_to_reoffending.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.employment_education_linked_to_reoffending.validation'),
    }),
  ],
})

export const employmentStatusSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          strengthsProtectiveFactors,
          employmentOrEducationLinkedToSeriousHarm,
          employmentOrEducationLinkedReoffending,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
