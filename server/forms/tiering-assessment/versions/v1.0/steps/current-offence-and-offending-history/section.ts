import {
  GovUKHeading,
  GovUKInsetText,
  GovUKSummaryList,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  and,
  Answer,
  Condition,
  Data,
  Self,
  Transformer,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from './constants/step'
import {
  dateField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
  textField,
  textSummaryRow,
} from '../../../../constants/questionContent'
import { Section } from '../../constants/section'

export const currentOffenceHeadingQuestion = GovUKHeading({
  text: contentFor('current_offence'),
  size: 'm',
})

export const currentOffenceInsetQuestion = GovUKInsetText({
  text: contentFor('current_offence_inset_question'),
})

export const currentOffenceSummaryListQuestion = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('offence_name') },
      value: { text: Data('offence-description') },
    },
    {
      key: { text: contentFor('offence_code') },
      value: { text: Answer('offence-code') },
    },
    {
      key: { text: contentFor('date_of_current_conviction') },
      value: {
        text: Answer('date-of-current-conviction').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
      },
    },
  ],
})

export const currentOffenceWarningQuestion = GovUKWarningText({
  text: 'Incorrect details will impact reoffending predictor scores. If any details are wrong, contact the case administrator at your probation delivery unit (PDU)',
})

export const sectionBreakQuestion = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
})

export const offenceHistoryHeadingQuestion = GovUKHeading({
  text: 'Offence history',
  size: 'm',
})

export const historyInsetQuestion = GovUKInsetText({
  html:
    '<p class="govuk-body">Someone gets a sanction if they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>are convicted by a court and given a sentence (such as a fine, community order, discharge or prison)</li>\n' +
    '  <li>accept a formal caution from the police</li>\n' +
    '</ul>',
})

const dateAtFirstSanctionQuestion = question({
  content: {
    code: Question.date_at_first_sanction,
    format: QuestionFormat.DATE,
    text: contentFor('question.date_at_first_sanction.text', CaseData.ForenamePossessive),
    hint: contentFor('question.date_at_first_sanction.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: dateField({
      customValidations: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Date at first sanction is a required field',
        }),
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: 'Please enter a valid date',
        }),
      ],
    }),
  },
})

const totalSanctionsQuestion = question({
  content: {
    code: Question.number_of_sanctions_for_all_offences,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_sanctions_for_all_offences.text', CaseData.Forename),
    hint: contentFor('question.number_of_sanctions_for_all_offences.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: 'Must be a whole number',
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThan(0)),
          ),
          message: 'Must be greater than 0',
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.number_of_sanctions_for_all_offences.path,
    }),
  },
})

const totalViolentSanctionsQuestion = question({
  content: {
    code: Question.number_of_violent_sanctions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_violent_sanctions.text', CaseData.ForenamePossessive),
    hint: contentFor('question.number_of_violent_sanctions.hint', CaseData.Forename),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: 'Must be a whole number',
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThan(0)),
          ),
          message: 'Must be greater than or equal to 0',
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.number_of_violent_sanctions.path,
    }),
  },
})

export const sexualOffenceHistoryQuestion = question({
  content: {
    code: Question.has_ever_committed_sexual_offence,
    format: QuestionFormat.RADIO,
    text: contentFor('question.has_ever_committed_sexual_offence.text', CaseData.Forename),
    hint: contentFor('question.has_ever_committed_sexual_offence.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.current_offence_and_offending_history.path }),
  },
})

export const currentOffenceAndOffendingHistorySection = {
  code: Section.current_offence_and_offending_history.code,
  questions: {
    dateAtFirstSanctionQuestion,
    totalSanctionsQuestion,
    totalViolentSanctionsQuestion,
    sexualOffenceHistoryQuestion,
  },
}
