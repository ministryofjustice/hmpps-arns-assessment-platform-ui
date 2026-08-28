import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.date_of_current_supervision]: {
      text: 'What date did %1 current supervision in the community begin?',
      hint: 'We will fill in this date from NDelius if it is available. Change the date if it is wrong.',
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
