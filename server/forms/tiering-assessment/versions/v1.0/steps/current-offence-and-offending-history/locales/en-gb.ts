import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.number_of_sanctions_for_all_offences]: {
      text: 'How many sanctions does %1 have in total for all offences?',
      hint: 'Include their current offence',
    },
    [Question.has_ever_committed_sexual_offence]: {
      text: 'How many of %1 total sanctions involved violent offences?',
      hint: 'Include their current offence',
    },
    [Question.number_of_violent_sanctions]: {
      text: 'Has %1 ever committed a sexual or sexually motivated offence?',
      hint: 'This includes their current offence',
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
