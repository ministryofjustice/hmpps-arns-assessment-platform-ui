import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  dynamic_questions_hint: 'Answer questions needed for the dynamic scores.',
  check_your_answers_hint: 'Check your answers and view static scores.',
  question: {
    [Question.have_you_done_an_interview]: {
      text: 'Have you done an interview with %1?',
    },
  },
  option: {
    [CommonOption.yes]: 'Yes, continue assessment',
    [CommonOption.no]: 'No',
  },
} as const

export type AccommodationLocale = Locale<typeof english>
