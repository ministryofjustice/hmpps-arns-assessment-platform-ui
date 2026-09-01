import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Section } from '../../constants/section'
import { contentFor } from './locales'
import { commonContentFor } from '../../locales'
import { dateField, question, QuestionFormat } from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

const dateOfCurrentSupervisionQuestion = question({
  content: {
    code: Question.date_of_current_supervision,
    format: QuestionFormat.DATE,
    text: contentFor('question.date_of_current_supervision.text', CaseData.ForenamePossessive),
    hint: contentFor('question.date_of_current_supervision.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
    isPageHeading: true,
  },
  displayModes: {
    field: dateField({
      customValidations: [
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: commonContentFor('validation.valid_date'),
        }),
      ],
    }),
  },
})

export const dateOfCurrentSupervisionSection = {
  code: Section.date_of_current_supervision.code,
  questions: {
    dateOfCurrentSupervisionQuestion,
  },
}
