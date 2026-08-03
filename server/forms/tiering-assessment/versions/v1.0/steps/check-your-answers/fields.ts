import { GovUKHeading, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Data, Format, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

// const startTieringAssessmentPath = 'startTieringAssessment'
const currentOffenceAndOffendingHistoryPath = 'current-offence-and-offending-history#%1'
const sexualOffendingPath = 'sexual-offending#%1'
const dateOfCurrentSupervisionPath = 'date-of-current-supervision#%1'
const offencesSinceSupervisionPath = 'offences-since-supervision#%1'
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
      key: { text: Format('What was the date of %1 first sanction?', CaseData.ForenamePossessive) },
      value: { text: Answer('date-at-first-sanction').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })) },
      actions: {
        items: [
          {
            href: Format(currentOffenceAndOffendingHistoryPath, 'date-at-first-sanction'),
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
            href: Format(currentOffenceAndOffendingHistoryPath, 'number-of-sanctions-for-all-offences'),
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
            href: Format(currentOffenceAndOffendingHistoryPath, 'number-of-violent-sanctions'),
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
            href: Format(currentOffenceAndOffendingHistoryPath, 'has-ever-commited-sexual-offence'),
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
      value: { text: Answer('current-offence-sexually-motivated') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'current-offence-sexually-motivated'),
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
      value: { text: Answer('victim-stranger') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'victim-stranger'),
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
      value: {
        text: Answer('date-of-most-recent-sexual-offence').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
      },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'date-of-most-recent-sexual-offence'),
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
      value: { text: Answer('number-of-contact-sexual-sanctions') },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'number-of-contact-sexual-sanctions'),
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
      value: { text: Answer('number-of-contact-child-sexual-sanctions') },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'number-of-contact-child-sexual-sanctions'),
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
      value: { text: Answer('indecent-child-images') },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'indecent-child-images'),
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
      value: { text: Answer('non-contact') },
      actions: {
        items: [
          {
            href: Format(sexualOffendingPath, 'non-contact'),
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
            href: Format(dateOfCurrentSupervisionPath, 'date-of-current-supervision'),
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
          'Has %1 commited any offences since %2?',
          CaseData.Forename,
          Answer('date-of-current-supervision').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
        ),
      },
      value: { text: Answer('has-commited-offence-since-assessment-date') ? 'Yes' : 'No' },
      actions: {
        items: [
          {
            href: Format(offencesSinceSupervisionPath, 'has-commited-offence-since-assessment-date'),
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
            href: Format(offencesSinceSupervisionPath, 'most-recent-offence-date'),
            text: 'Change',
          },
        ],
      },
    },
  ],
})
