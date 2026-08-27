import {
  GovUKDateInputFull,
  GovUKHeading,
  GovUKInsetText,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTextInput,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  Answer,
  Condition,
  Data,
  Format,
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
import { CharacterLimit } from '../../constants/characterLimit'
import { question, QuestionFormat, radioField, textField, textSummaryRow } from '../../../../constants/questionContent'
import { Section } from '../../constants/section'

export const currentOffenceHeadingQuestion = GovUKHeading({
  text: 'Current offence',
  size: 'm',
})

export const currentOffenceInsetQuestion = GovUKInsetText({
  text: 'This information comes from NDelius',
})

export const currentOffenceSummaryListQuestion = GovUKSummaryList({
  rows: [
    {
      key: { text: 'Offence name' },
      value: { text: Data('offence-description') },
    },
    {
      key: { text: 'Offence code' },
      value: { text: Answer('offence-code') },
    },
    {
      key: { text: 'Date of current conviction' },
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

export const dateAtFirstSanction = GovUKDateInputFull({
  code: 'date-at-first-sanction',
  fieldset: {
    legend: {
      text: Format('What was the date of %1 first sanction?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  hint: 'We will fill in this date from NDelius if it is available. Change the date if it is wrong.',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Date at first sanction is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})


// validWhen: [
//     validation({
//       condition: Self().match(Condition.IsRequired()),
//       message: 'This is a required field',
//     }),
//     validation({
//       condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
//       message: 'Must be a whole number',
//     }),
//     validation({
//       condition: Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThan(0)),
//       message: 'Must be greater than 0',
//     }),
//   ],
const totalSanctionsQuestion = question({
  content: {
    code: Question.number_of_sanctions_for_all_offences,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_sanctions_for_all_offences.text', CaseData.Forename),
    hint: contentFor('question.number_of_sanctions_for_all_offences.hint'),
  },
  displayModes: {
    field: textField(),
    summaryRow: textSummaryRow({
      changeHref: Step.number_of_sanctions_for_all_offences.path,
    }),
  },
})

  //validWhen: [
  //   validation({
  //     condition: Self().match(Condition.IsRequired()),
  //     message: 'This is a required field',
  //   }),
  //   validation({
  //     condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
  //     message: 'Must be a whole number',
  //   }),
  //   validation({
  //     condition: Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThanOrEqual(0)),
  //     message: 'Must be greater than or equal to 0',
  //   }),
  // ],
const totalViolentSanctionsQuestion = question({
  content: {
    code: Question.number_of_violent_sanctions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_violent_sanctions.text', CaseData.ForenamePossessive),
    hint: contentFor('question.number_of_violent_sanctions.hint', CaseData.Forename),
  },
  displayModes: {
    field: textField(),
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
    field: textField(),
    summaryRow: textSummaryRow({ changeHref: Step.current_offence_and_offending_history.path }),
  },
})


export const currentOffenceAndOffendingHistorySection = {
  code: Section.current_offence_and_offending_history.code,
  questions: {
    // currentOffenceHeadingQuestion,
    // currentOffenceInsetQuestion,
    // currentOffenceSummaryListQuestion,
    // currentOffenceWarningQuestion,
    // sectionBreakQuestion,
    // offenceHistoryHeadingQuestion,
    // historyInsetQuestion,
    // dateAtFirstSanction,
    totalSanctionsQuestion,
    totalViolentSanctionsQuestion,
    sexualOffenceHistoryQuestion,
  },
}