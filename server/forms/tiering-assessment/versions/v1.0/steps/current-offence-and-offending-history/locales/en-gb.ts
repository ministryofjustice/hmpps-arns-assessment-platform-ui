import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'

export const english = {
  current_offence: 'Current offence',
  current_offence_inset_question: 'This information comes from NDelius',
  offence_name: 'Offence name',
  offence_code: 'Offence code',
  date_of_current_conviction: 'Date of current conviction',
  question: {
    [Question.date_at_first_sanction]: {
      text: 'What was the date of %1 first sanction?',
      hint: 'We will fill in this date from NDelius if it is available. Change the date if it is wrong.',
    },
    [Question.number_of_sanctions_for_all_offences]: {
      text: 'How many sanctions does %1 have in total for all offences?',
      hint: 'Include their current offence',
    },
    [Question.number_of_violent_sanctions]: {
      text: 'How many of %1 total sanctions involved violent offences?',
      hint: 'Include their current offence',
    },
    [Question.has_ever_committed_sexual_offence]: {
      text: 'Has %1 ever committed a sexual or sexually motivated offence?',
      hint: 'This includes their current offence',
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
