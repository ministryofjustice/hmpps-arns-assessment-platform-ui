import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { Question } from './constants/question'
import { contentFor } from './locales'
import { CommonOption } from '../../constants/commonOption'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const interviewQuestion = question({
  content: {
    code: Question.have_you_done_an_interview,
    format: QuestionFormat.RADIO,
    text: contentFor('question.have_you_done_an_interview.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('option.YES'),
        hint: contentFor('dynamic_questions_hint'),
      },
      {
        value: CommonOption.no,
        text: contentFor('option.NO'),
        hint: contentFor('check_your_answers_hint'),
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.interview_question.path }),
  },
})

export const interviewFields = {
  code: Step.interview_question.code,
  questions: {
    interviewQuestion,
  },
}
