import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { Question } from './constants/question'
import { contentFor } from './locales'

export const bingeDrinkingQuestion = question({
  content: {
    code: Question.binge_drinking,
    format: QuestionFormat.RADIO,
    text: contentFor('question.binge_drinking.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.binge_drinking.option.NO_PROBLEMS.text'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.binge_drinking.option.SOME_PROBLEMS.text'),
        hint: contentFor('question.binge_drinking.option.SOME_PROBLEMS.hint'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.binge_drinking.option.SIGNIFICANT_PROBLEMS.text'),
        hint: contentFor('question.binge_drinking.option.SIGNIFICANT_PROBLEMS.hint'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.binge_drinking.path }),
  },
})

export const bingeDrinkingFields = {
  code: Step.binge_drinking.code,
  questions: {
    bingeDrinkingQuestion,
  },
}
