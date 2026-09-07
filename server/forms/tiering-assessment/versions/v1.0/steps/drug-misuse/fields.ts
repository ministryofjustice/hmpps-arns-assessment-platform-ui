import { Step } from '../../constants/page'
import { Question } from './constants/question'
import { contentFor } from './locales'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { CommonOption } from '../../constants/commonOption'

const drugMisuseQuestion = question({
  content: {
    code: Question.ever_misused_drugs,
    format: QuestionFormat.RADIO,
    text: contentFor('question.ever_misused_drugs.text', CaseData.ForenamePossessive),
    hint: contentFor('question.ever_misused_drugs.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.drug_misuse.path }),
  },
})

export const drugMisuseFields = {
  code: Step.drug_misuse.code,
  questions: {
    drugMisuseQuestion,
  },
}
