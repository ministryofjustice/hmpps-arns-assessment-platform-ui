import { Question } from '../constants/question'
import { Option } from '../constants/option'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.has_ever_drunk_alcohol]: {
      text: 'Has %1 ever drunk alcohol?',
      option: {
        [Option.YES_IN_LAST_THREE_MONTHS]: 'Yes, including in the last 3 months',
        [Option.YES_NOT_IN_LAST_THREE_MONTHS]: 'Yes, but not in the last 3 months',
      },
    },
  },
} as const

export type AlcoholEverUsedLocale = Locale<typeof english>
