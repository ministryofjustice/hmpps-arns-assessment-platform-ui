import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.has_committed_offence_since_supervision_date]: {
      text: 'Has %1 committed any offences since %2?',
    },
    [Question.most_recent_offence_date]: {
      text: 'What is the date of %1 most recent offence?',
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
