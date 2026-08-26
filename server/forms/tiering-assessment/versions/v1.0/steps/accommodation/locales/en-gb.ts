import { Question } from '../constants/question'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.suitability_of_accommodation]: {
      text: 'Is %1 accommodation suitable?',
      option: {
        [CommonOption.no_problems]: 'Yes',
        [CommonOption.some_problems]: 'Yes, with concerns',
        [CommonOption.significant_problems]: 'No',
      },
      validation: 'This is a required field',
    },
    [Question.who_are_they_living_with]: {
      text: 'Who is %1 living with?',
      option: {
        [Option.family]: 'Family',
        [Option.friends]: 'Friends',
        [Option.partner]: 'Partner',
        [Option.person_under_18]: 'Person under 18 years old',
        [Option.alone]: 'Alone',
      },
      validation: `Select who %1 is living with, or select 'Alone' or 'Unknown'`,
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
