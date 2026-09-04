import { Question } from './constants/question'
import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { EmploymentOption } from './constants/employmentOption'
import { contentFor } from './locales'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

const currentEmploymentStatusField = question({
  content: {
    code: Question.is_unemployed,
    format: QuestionFormat.RADIO,
    text: contentFor('question.is_unemployed.text', CaseData.ForenamePossessive),
    options: [
      {
        value: EmploymentOption.employed,
        text: contentFor('question.is_unemployed.option.EMPLOYED'),
      },
      {
        value: EmploymentOption.self_employed,
        text: contentFor('question.is_unemployed.option.SELF_EMPLOYED'),
      },
      {
        value: EmploymentOption.retired,
        text: contentFor('question.is_unemployed.option.RETIRED'),
      },
      {
        value: EmploymentOption.currently_unavailable_for_work,
        text: contentFor('question.is_unemployed.option.CURRENTLY_UNAVAILABLE_FOR_WORK'),
      },
      {
        value: EmploymentOption.unemployed_actively_looking_for_work,
        text: contentFor('question.is_unemployed.option.UNEMPLOYED_ACTIVELY_LOOKING_FOR_WORK'),
      },
      {
        value: EmploymentOption.unemployed_not_actively_looking_for_work,
        text: contentFor('question.is_unemployed.option.UNEMPLOYED_NOT_ACTIVELY_LOOKING_FOR_WORK'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.employment.path }),
  },
})

export const employmentFields = {
  code: Step.employment.code,
  questions: {
    currentEmploymentStatusField,
  },
}
