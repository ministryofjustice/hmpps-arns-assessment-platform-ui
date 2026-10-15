import { and, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
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
import { itemisedSummaryRow, optionalDetails, requiredDetails, yesNo } from '../../constants/questionContent'
import { CharacterLimit } from '../../../../constants/characterLimit'

const drankAlcohol = Answer(Question.alcohol_current_issues).not.match(Condition.Equals(Option.has_never_drank))
const noCurrentProblems = Answer(Question.alcohol_current_issues).not.match(
  Condition.Equals(Option.no_current_problems),
)

const currentIssues = question({
  content: {
    code: Question.alcohol_current_issues,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_current_issues.text', CaseData.Forename),
    options: [
      {
        value: Option.significant,
        text: contentFor('question.alcohol_current_issues.option.SIGNIFICANT'),
      },
      {
        value: Option.some_problems,
        text: contentFor('question.alcohol_current_issues.option.SOME_PROBLEMS'),
      },
      {
        value: Option.no_current_problems,
        text: contentFor('question.alcohol_current_issues.option.NO_CURRENT_PROBLEMS'),
      },
      {
        value: Option.has_never_drank,
        text: contentFor('question.alcohol_current_issues.option.HAS_NEVER_DRANK'),
      },
    ],
    validationMessage: contentFor('question.alcohol_current_issues.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_current_issues.path,
    }),
  },
})

const evidenceOfExcessDrinking = question({
  content: {
    code: Question.alcohol_evidence_of_excess_drinking,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_evidence_of_excess_drinking.text', CaseData.Forename),
    options: [
      {
        value: Option.no_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.NO_EVIDENCE'),
      },
      {
        value: Option.yes_with_some_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.text'),
        hint: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.hint'),
      },
      {
        value: Option.yes_with_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.text'),
        hint: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.hint'),
      },
    ],
    validationMessage: contentFor('question.alcohol_evidence_of_excess_drinking.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: and(drankAlcohol, noCurrentProblems),
      visibleWhen: and(drankAlcohol, noCurrentProblems),
    }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_excessive_drinking_past_issues.path,
      visibleWhen: and(drankAlcohol, noCurrentProblems),
    }),
  },
})

const pastIssues = question({
  content: {
    code: Question.alcohol_past_issues,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_past_issues.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.alcohol_past_issues_yes_details,
          validationMessage: contentFor('question.alcohol_past_issues_yes_details.validation'),
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.alcohol_past_issues.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_excessive_drinking_past_issues.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const stoppedOrReduced = question({
  content: {
    code: Question.alcohol_stopped_or_reduced,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_stopped_or_reduced.text', CaseData.Forename),
    hint: contentFor('question.alcohol_stopped_or_reduced.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.alcohol_stopped_or_reduced_yes_details,
          validationMessage: contentFor('question.alcohol_stopped_or_reduced_yes_details.validation'),
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.alcohol_stopped_or_reduced.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_stopped_or_reduced.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const changes = question({
  content: {
    code: Question.alcohol_use_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_use_changes.text', CaseData.Forename),
    hint: contentFor('question.alcohol_use_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.alcohol_use_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_changes.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_summary.path,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.alcohol_use_practitioner_analysis_risk_of_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_summary.path,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.alcohol_use_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.alcohol_use_summary.path,
    }),
  },
})

export const alcoholUseSection = {
  code: Section.alcohol_use.code,
  questions: {
    currentIssues,
    evidenceOfExcessDrinking,
    pastIssues,
    stoppedOrReduced,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
