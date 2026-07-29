import {
  GovUKDateInputFull,
  GovUKHeading,
  GovUKInsetText, GovUKPanel, GovUKRadioInput,
  GovUKSummaryList, GovUKTextInput,
  GovUKWarningText
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {Answer, Condition, Data, Self, Transformer, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {HtmlBlock} from "@ministryofjustice/hmpps-forge/core/components";

const user = Data('user')

export const currentOffenceHeadingField = GovUKHeading({
  text: 'Current offence',
  size: 's'
})

export const currentOffenceInsetField = GovUKInsetText({
  text: 'This information comes from NDelius',
})

export const currentOffenceSummaryListField = GovUKSummaryList({
  rows: [
    {
      key: {text: 'Offence name'},
      value: {text: Data('offence-description')},
    },
    {
      key: {text: 'Offence code'},
      value: {text: Answer('offence-code')},
    },
    {
      key: {text: 'Date of current conviction'},
      value: {
        text: Answer('date-of-current-conviction').pipe(Transformer.String.FormatDate({dateStyle: 'long'}))
      },
    },
  ],
})

export const currentOffenceWarningField = GovUKWarningText({
  text: 'Incorrect details will impact reoffending predictor scores. If any details are wrong, contact the case administrator at your probation delivery unit (PDU)',
})

export const sectionBreakField = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
})

export const offenceHistoryHeadingField = GovUKHeading({
  text: 'Offence history',
  size: 's'
})

export const historyInsetField = GovUKInsetText({
  html: '<p class="govuk-body">Someone gets a sanction if they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>are convicted by a court and given a sentence (such as a fine, community order, discharge or prison)</li>\n' +
    '  <li>accept a formal caution from the police</li>\n' +
    '</ul>',
})

export const dateAtFirstSanction = GovUKDateInputFull({
  code: 'date-at-first-sanction',
  fieldset: {
    legend: {
      html: '<h1 class="govuk-fieldset__heading">What was the date of NAME&apos;s first sanction?</h1>',
      classes: "govuk-fieldset__legend--s"
    }
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

export const totalSanctionsField = GovUKTextInput({
  code: 'number-of-sanctions-for-all-offences',
  label: {text: `How many sanctions does NAME have in total for all offences?`, classes: 'govuk-label--s'},
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const totalViolentSanctionsField = GovUKTextInput({
  code: 'number-of-violent-sanctions',
  label: {text: "How many of NAME's total sanctions involved violent offences?", classes: 'govuk-label--s'},
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const sexualOffenceHistoryField = GovUKRadioInput({
  code: 'has-ever-commited-sexual-offence',
  fieldset: {
    legend: {
      html: '<h1 class="govuk-fieldset__heading">Has NAME ever commited a sexual or sexually motivated offence?</h1>',
      classes: "govuk-fieldset__legend--s"
    }
  },
  hint: 'This includes their current offence',
  classes: 'govuk-radios--inline',
  items: [
    {value: 'true', text: 'Yes'},
    {value: 'false', text: 'No'},
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
