import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { Question } from './constants/question'
import { contentFor } from './locales'

const regularOffendingActivitiesQuestion = question({
  content: {
    code: Question.regular_offending_activities,
    format: QuestionFormat.RADIO,
    text: contentFor('question.regular_offending_activities.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.regular_offending_activities.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.regular_offending_activities.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.regular_offending_activities.option.SIGNIFICANT_PROBLEMS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.regular_offending_activities).match(Condition.IsRequired()),
      changePath: Step.thinking_attitudes_and_behaviours.path,
    }),
  },
})

const temperControlQuestion = question({
  content: {
    code: Question.temper_control,
    format: QuestionFormat.RADIO,
    text: contentFor('question.temper_control.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.temper_control.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.temper_control.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.temper_control.option.SIGNIFICANT_PROBLEMS'),
        hint: contentFor('question.temper_control.option.hint'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.temper_control).match(Condition.IsRequired()),
      changePath: Step.thinking_attitudes_and_behaviours.path,
    }),
  },
})

const impulsivityProblemsQuestion = question({
  content: {
    code: Question.impulsivity_problems,
    format: QuestionFormat.RADIO,
    text: contentFor('question.impulsivity_problems.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.impulsivity_problems.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.impulsivity_problems.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.impulsivity_problems.option.SIGNIFICANT_PROBLEMS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.impulsivity_problems).match(Condition.IsRequired()),
      changePath: Step.thinking_attitudes_and_behaviours.path,
    }),
  },
})

const proCriminalAttitudesQuestion = question({
  content: {
    code: Question.pro_criminal_attitudes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.pro_criminal_attitudes.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.pro_criminal_attitudes.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.pro_criminal_attitudes.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.pro_criminal_attitudes.option.SIGNIFICANT_PROBLEMS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.pro_criminal_attitudes).match(Condition.IsRequired()),
      changePath: Step.thinking_attitudes_and_behaviours.path,
    }),
  },
})

export const thinkingAttitudesBehavioursFields = {
  code: Step.thinking_attitudes_and_behaviours.code,
  questions: {
    regularOffendingActivitiesQuestion,
    temperControlQuestion,
    impulsivityProblemsQuestion,
    proCriminalAttitudesQuestion,
  },
}
