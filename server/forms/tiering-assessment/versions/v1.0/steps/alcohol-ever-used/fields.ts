import { Step } from '../../constants/page'
import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { CommonOption } from '../../constants/commonOption'
import { contentFor } from './locales'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { Question } from './constants/question'
import { Option } from './constants/option'

export const hasEverDrunkAlcoholQuestion = question({
  content: {
    code: Question.has_ever_drunk_alcohol,
    format: QuestionFormat.RADIO,
    text: contentFor('question.has_ever_drunk_alcohol.text', CaseData.Forename),
    options: [
      {
        value: Option.YES_IN_LAST_THREE_MONTHS,
        text: contentFor('question.has_ever_drunk_alcohol.option.YES_IN_LAST_THREE_MONTHS'),
      },
      {
        value: Option.YES_NOT_IN_LAST_THREE_MONTHS,
        text: contentFor('question.has_ever_drunk_alcohol.option.YES_NOT_IN_LAST_THREE_MONTHS'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.UNKNOWN'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.alcohol_ever_used.path }),
  },
})

export const alcoholEverUsedFields = {
  code: Step.alcohol_ever_used.code,
  questions: {
    hasEverDrunkAlcoholQuestion,
  },
}
