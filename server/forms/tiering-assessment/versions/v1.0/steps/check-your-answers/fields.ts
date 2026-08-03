import { GovUKHeading, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Data, Format, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

const startTieringAssessmentPath = 'startTieringAssessment'
const currentOffenceAndOffendingHistoryPath = 'current-offence-and-offending-history'
const sexualOffendingPath = 'sexual-offending'
const dateOfCurrentSupervisionPath = 'date-of-current-supervision'
const offencesSinceSupervisionPath = 'offences-since-supervision'
export const currentOffenceHeadingField = GovUKHeading({
  text: 'Current offence details',
  size: 'm',
})

export const currentOffenceSummaryListField = GovUKSummaryList({
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

export const currentOffenceAndOffendingHistoryHeadingField = GovUKHeading({
  text: 'Offending history',
  size: 'm',
})

export const currentOffenceAndOffendingHistorySummaryListField = GovUKSummaryList({
  rows: [
    {
      key: { text: Format('What was the date of %1 first sanction ?', CaseData.ForenamePossessive) },
      value: { text: Answer('date-at-first-sanction').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })) },
      actions: {
        items: [
          {
            href: currentOffenceAndOffendingHistoryPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: { text: Format('How many sanctions does %1 have in total for all offences?', CaseData.Forename) },
      value: { text: Answer('number-of-sanctions-for-all-offences') },
      actions: {
        items: [
          {
            href: currentOffenceAndOffendingHistoryPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: { text: Format('How many of %1 total sanctions involved violent offences?', CaseData.ForenamePossessive) },
      value: { text: Answer('number-of-violent-sanctions') },
      actions: {
        items: [
          {
            href: currentOffenceAndOffendingHistoryPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: { text: Format('Has %1 ever commited a sexual or sexually motivated offence?', CaseData.Forename) },
      value: { text: Answer('has-ever-commited-sexual-offence') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: currentOffenceAndOffendingHistoryPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})

export const sexualHistoryHeadingField = GovUKHeading({
  text: 'Current and recent sexual offending',
  size: 'm',
})

export const sexualHistorySummaryListField = GovUKSummaryList({
  rows: [
    {
      key: { text: Format('Does %1 current offence have a sexual motivation?', CaseData.ForenamePossessive) },
      value: { text: Answer('date-at-first-sanction') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: {
        text: Format(
          'Does %1 current offence involve actual or attempted direct contact against a victim who was a stranger?',
          CaseData.ForenamePossessive,
        ),
      },
      value: { text: Answer('number-of-sanctions-for-all-offences') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: {
        text: Format(
          'What is the date of %1 most recent sanction involving a sexual or sexually motivated offence?',
          CaseData.ForenamePossessive,
        ),
      },
      value: { text: Answer('date-at-first-sanction').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })) },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})

export const directSexualHistoryHeadingField = GovUKHeading({
  text: 'Direct contact sexual or sexually motivated offending',
  size: 'm',
})

export const directSexualHistorySummaryListField = GovUKSummaryList({
  rows: [
    {
      key: {
        text: Format(
          'How many sanctions does %1 have for contact adult sexual or sexually motivated offences?',
          CaseData.Forename,
        ),
      },
      value: { text: Answer('date-at-first-sanction') },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: {
        text: Format(
          'How many sanctions does %1 have for direct contact child sexual or sexually motivated offences?',
          CaseData.Forename,
        ),
      },
      value: { text: Answer('number-of-sanctions-for-all-offences') },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})

export const imagesAndIndirectContactSexualHistoryHeadingField = GovUKHeading({
  text: 'Images and indirect contact sexual or sexually motivated offending',
  size: 'm',
})

export const imagesAndIndirectContactSexualHistorySummaryListField = GovUKSummaryList({
  rows: [
    {
      key: {
        text: Format(
          'How many sanctions does %1 have for indecent child image, or indirect contact child, sexual or sexually motivated offences?',
          CaseData.Forename,
        ),
      },
      value: { text: Answer('date-at-first-sanction') },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: {
        text: Format(
          'How many sanctions does %1 have for other non-contact sexual or sexually motivated offences?',
          CaseData.Forename,
        ),
      },
      value: { text: Answer('number-of-sanctions-for-all-offences') },
      actions: {
        items: [
          {
            href: sexualOffendingPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})

export const communitySupervisionHeadingField = GovUKHeading({
  text: 'Community supervision',
  size: 'm',
})

export const communitySupervisionSummaryListField = GovUKSummaryList({
  rows: [
    {
      key: {
        text: Format('What date did %1 current supervision in the community begin?', CaseData.ForenamePossessive),
      },
      value: { text: Answer('date-of-current-supervision') },
      actions: {
        items: [
          {
            href: dateOfCurrentSupervisionPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})

export const offenceSinceSupervisionHeadingField = GovUKHeading({
  text: 'Offences since community date',
  size: 'm',
})

export const offenceSinceSupervisionSummaryListField = GovUKSummaryList({
  rows: [
    {
      key: {
        text: Format(
          'Has %1 commited any offences since %2 ?',
          CaseData.Forename,
          Answer('date-of-current-supervision').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
        ),
      },
      value: { text: Answer('has-commited-offence-since-assessment-date') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: offencesSinceSupervisionPath,
            text: 'Change',
          },
        ],
      },
    },
    {
      key: { text: Format('What is the date of %1 most recent offence?', CaseData.ForenamePossessive) },
      value: { text: Answer('most-recent-offence-date').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })) },
      actions: {
        items: [
          {
            href: offencesSinceSupervisionPath,
            text: 'Change',
          },
        ],
      },
    },
  ],
})
