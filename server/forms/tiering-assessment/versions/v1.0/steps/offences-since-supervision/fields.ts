import {
  Answer,
  Condition,
  Conditional,
  Self,
  Transformer,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { contentFor } from './locales'
import { commonContentFor } from '../../locales'
import {
  question,
  QuestionFormat,
  radioField,
  revealedDateField,
  revealedQuestion,
} from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { CommonOption } from '../../constants/commonOption'
import { Step } from '../../constants/page'

const mostRecentOffenceDateRevealedQuestion = revealedQuestion({
  content: {
    code: Question.most_recent_offence_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.most_recent_offence_date.text', CaseData.ForenamePossessive),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: revealedDateField({
      customValidations: [
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: commonContentFor('validation.valid_date'),
        }),
      ],
    }),
  },
})

export const offenceHistoryQuestion = question({
  content: {
    code: Question.has_committed_offence_since_supervision_date,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.has_committed_offence_since_supervision_date.text',
      CaseData.Forename,
      Conditional({
        when: Answer('date_of_current_supervision').match(Condition.Date.IsValid()),
        then: Answer('date_of_current_supervision').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
        else: 'the date of current supervision',
      }),
    ),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: mostRecentOffenceDateRevealedQuestion,
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
  },
  displayModes: {
    field: radioField(),
  },
})

export const offencesSinceSupervisionFields = {
  code: Step.date_of_current_supervision.code,
  questions: {
    offenceHistoryQuestion,
    mostRecentOffenceDateRevealedQuestion,
  },
}
