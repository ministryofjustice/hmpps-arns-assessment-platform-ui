import { Answer, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxField,
  question,
  QuestionFormat,
  radioField,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import { itemisedSummaryRow, optionalDetails, requiredDetails, yesNo } from '../../constants/questionContent'

export const isEmployedOrSelfEmployed = Answer(Question.community_employment_status).match(
  Condition.Equals(Option.employed_or_self_employed),
)

export const isRetired = Answer(Question.community_employment_status).match(Condition.Equals(Option.retired))

export const notWorkingOrAvailableForWork = not(or(isEmployedOrSelfEmployed, isRetired))

// The history and experience questions only apply once we know the person has
// been employed before (or their employment status implies it).
const hasBeenEmployed = or(
  isEmployedOrSelfEmployed,
  Answer(Question.community_ever_had_a_job).match(Condition.Equals(CommonOption.yes)),
)

const hasBeenEmployedOrRetired = or(hasBeenEmployed, isRetired)

const hasReadingDifficulties = Answer(Question.education_difficulties).match(Condition.Array.Contains(Option.reading))
const hasWritingDifficulties = Answer(Question.education_difficulties).match(Condition.Array.Contains(Option.writing))
const hasNumeracyDifficulties = Answer(Question.education_difficulties).match(Condition.Array.Contains(Option.numeracy))

export const hasEducationalDifficulties = or(hasReadingDifficulties, hasWritingDifficulties, hasNumeracyDifficulties)

const isNotRetired = not(isRetired)
const currentEmploymentStatus = question({
  content: {
    code: Question.community_employment_status,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_employment_status.text', CaseData.ForenamePossessive),
    options: [
      {
        value: Option.employed_or_self_employed,
        text: contentFor('question.community_employment_status.option.EMPLOYED_OR_SELF_EMPLOYED'),
      },
      { value: Option.retired, text: contentFor('question.community_employment_status.option.RETIRED') },
      {
        value: Option.currently_unavailable_for_work,
        text: contentFor('question.community_employment_status.option.CURRENTLY_UNAVAILABLE_FOR_WORK'),
      },
      {
        value: Option.unemployed,
        text: contentFor('question.community_employment_status.option.UNEMPLOYED'),
      },
    ],
    validationMessage: contentFor('question.community_employment_status.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_status.path,
    }),
  },
})

const everHadAJob = question({
  content: {
    code: Question.community_ever_had_a_job,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_ever_had_a_job.text', CaseData.Forename),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.community_ever_had_a_job.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_education_details.path,
      visibleWhen: notWorkingOrAvailableForWork,
    }),
  },
})

const employmentHistory = question({
  content: {
    code: Question.community_employment_history,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_employment_history.text', CaseData.ForenamePossessive),
    hint: contentFor('question.community_employment_history.hint'),
    options: [
      {
        value: Option.stable,
        text: contentFor('question.community_employment_history.option.STABLE.text'),
        hint: contentFor('question.community_employment_history.option.STABLE.hint'),
        reveals: optionalDetails({
          code: Question.community_employment_history_stable_details,
          hint: contentFor('question.community_employment_history_stable_details.hint'),
        }),
      },
      {
        value: Option.periods_of_instability,
        text: contentFor('question.community_employment_history.option.PERIODS_OF_INSTABILITY'),
        reveals: optionalDetails({
          code: Question.community_employment_history_periods_of_instability_details,
          hint: contentFor('question.community_employment_history_periods_of_instability_details.hint'),
        }),
      },
      {
        value: Option.unstable,
        text: contentFor('question.community_employment_history.option.UNSTABLE'),
        reveals: optionalDetails({
          code: Question.community_employment_history_unstable_details,
          hint: contentFor('question.community_employment_history_unstable_details.hint'),
        }),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
      },
    ],
    validationMessage: contentFor('question.community_employment_history.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasBeenEmployedOrRetired, visibleWhen: hasBeenEmployedOrRetired }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_education_details.path,
      visibleWhen: hasBeenEmployedOrRetired,
    }),
  },
})

const dayToDayCommitments = question({
  content: {
    code: Question.community_employment_other_responsibilities,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.community_employment_other_responsibilities.text', CaseData.Forename),
    hint: contentFor('question.community_employment_other_responsibilities.hint'),
    options: [
      {
        value: Option.carer,
        text: contentFor('question.community_employment_other_responsibilities.option.CARER'),
        reveals: optionalDetails({ code: Question.community_employment_other_responsibilities_carer_details }),
      },
      {
        value: Option.child,
        text: contentFor('question.community_employment_other_responsibilities.option.CHILD'),
        reveals: optionalDetails({ code: Question.community_employment_other_responsibilities_child_details }),
      },
      {
        value: Option.studying,
        text: contentFor('question.community_employment_other_responsibilities.option.STUDYING'),
        reveals: optionalDetails({ code: Question.community_employment_other_responsibilities_studying_details }),
      },
      {
        value: Option.volunteer,
        text: contentFor('question.community_employment_other_responsibilities.option.VOLUNTEER'),
        reveals: optionalDetails({ code: Question.community_employment_other_responsibilities_volunteer_details }),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.community_employment_other_responsibilities_other_details }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
      { divider: commonContentFor('or') },
      {
        value: CommonOption.none,
        text: contentFor('question.community_employment_other_responsibilities.option.NONE'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.community_employment_other_responsibilities.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.employment_education_details.path }),
  },
})

const academicProfessionalOrVocationalQualifications = question({
  content: {
    code: Question.education_academic_professional_vocational_qualifications,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_academic_professional_vocational_qualifications.text', CaseData.Forename),
    hint: contentFor('question.education_academic_professional_vocational_qualifications.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.education_academic_professional_vocational_qualifications_details,
          hint: contentFor('question.education_academic_professional_vocational_qualifications.option.YES.hint'),
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.education_academic_professional_vocational_qualifications.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.employment_education_details.path }),
  },
})

const jobSkills = question({
  content: {
    code: Question.education_transferable_skills,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_transferable_skills.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.education_transferable_skills.option.YES.text'),
        hint: contentFor('question.education_transferable_skills.option.YES.hint'),
        reveals: optionalDetails({ code: Question.education_transferable_skills_yes_details }),
      },
      {
        value: Option.yes_some_skills,
        text: contentFor('question.education_transferable_skills.option.YES_SOME_SKILLS.text'),
        hint: contentFor('question.education_transferable_skills.option.YES_SOME_SKILLS.hint'),
        reveals: optionalDetails({ code: Question.education_transferable_skills_yes_some_skills_details }),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.education_transferable_skills.option.NO.text'),
        hint: contentFor('question.education_transferable_skills.option.NO.hint'),
      },
    ],
    validationMessage: contentFor('question.education_transferable_skills.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: isNotRetired, visibleWhen: isNotRetired }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.employment_education_details.path, visibleWhen: isNotRetired }),
  },
})

const difficultiesReadingWritingNumeracy = question({
  content: {
    code: Question.education_difficulties,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.education_difficulties.text', CaseData.Forename),
    hint: contentFor('question.education_difficulties.hint'),
    options: [
      {
        value: Option.reading,
        text: contentFor('question.education_difficulties.option.READING'),
      },
      {
        value: Option.writing,
        text: contentFor('question.education_difficulties.option.WRITING'),
      },
      {
        value: Option.numeracy,
        text: contentFor('question.education_difficulties.option.NUMERACY'),
      },
      { divider: commonContentFor('or') },
      {
        value: CommonOption.none,
        text: contentFor('question.education_difficulties.option.NONE'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.education_difficulties.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.employment_education_details.path }),
  },
})

const readingDifficulties = question({
  content: {
    code: Question.education_difficulties_reading_severity,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_difficulties_reading_severity.text', CaseData.Forename),
    options: [
      {
        value: Option.significant_difficulties,
        text: contentFor('question.education_difficulties_reading_severity.options.SIGNIFICANT_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_reading_severity.options.SIGNIFICANT_DIFFICULTIES.hint'),
      },
      {
        value: Option.some_difficulties,
        text: contentFor('question.education_difficulties_reading_severity.options.SOME_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_reading_severity.options.SOME_DIFFICULTIES.hint'),
      },
    ],
    validationMessage: contentFor('question.education_difficulties_reading_severity.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasReadingDifficulties, visibleWhen: hasReadingDifficulties }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.education_difficulties.path,
      visibleWhen: hasReadingDifficulties,
    }),
  },
})

const writingDifficulties = question({
  content: {
    code: Question.education_difficulties_writing_severity,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_difficulties_writing_severity.text', CaseData.Forename),
    options: [
      {
        value: Option.significant_difficulties,
        text: contentFor('question.education_difficulties_writing_severity.options.SIGNIFICANT_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_writing_severity.options.SIGNIFICANT_DIFFICULTIES.hint'),
      },
      {
        value: Option.some_difficulties,
        text: contentFor('question.education_difficulties_writing_severity.options.SOME_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_writing_severity.options.SOME_DIFFICULTIES.hint'),
      },
    ],
    validationMessage: contentFor('question.education_difficulties_writing_severity.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasWritingDifficulties, visibleWhen: hasWritingDifficulties }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.education_difficulties.path,
      visibleWhen: hasReadingDifficulties,
    }),
  },
})

const numeracyDifficulties = question({
  content: {
    code: Question.education_difficulties_numeracy_severity,
    format: QuestionFormat.RADIO,
    text: contentFor('question.education_difficulties_numeracy_severity.text', CaseData.Forename),
    options: [
      {
        value: Option.significant_difficulties,
        text: contentFor('question.education_difficulties_numeracy_severity.options.SIGNIFICANT_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_numeracy_severity.options.SIGNIFICANT_DIFFICULTIES.hint'),
      },
      {
        value: Option.some_difficulties,
        text: contentFor('question.education_difficulties_numeracy_severity.options.SOME_DIFFICULTIES.text'),
        hint: contentFor('question.education_difficulties_numeracy_severity.options.SOME_DIFFICULTIES.hint'),
      },
    ],
    validationMessage: contentFor('question.education_difficulties_numeracy_severity.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasNumeracyDifficulties, visibleWhen: hasNumeracyDifficulties }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.education_difficulties.path,
      visibleWhen: hasReadingDifficulties,
    }),
  },
})

const changes = question({
  content: {
    code: Question.employment_education_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.employment_education_changes.text', CaseData.Forename),
    hint: contentFor('question.employment_education_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.employment_education_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.employment_education_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.employment_education_changes.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.employment_changes.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.employment_education_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.employment_education_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_education_summary.path,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.employment_education_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_serious_harm.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_education_summary.path,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.employment_education_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.employment_education_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.employment_education_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.employment_education_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.employment_education_summary.path,
    }),
  },
})

export const employmentEducationSection = {
  code: Section.employment_and_education.code,
  questions: {
    currentEmploymentStatus,
    everHadAJob,
    employmentHistory,
    dayToDayCommitments,
    academicProfessionalOrVocationalQualifications,
    jobSkills,
    difficultiesReadingWritingNumeracy,
    readingDifficulties,
    writingDifficulties,
    numeracyDifficulties,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
