import { Question } from '../constants/question'
import { EmploymentOption } from '../constants/employmentOption'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.is_unemployed]: {
      text: 'What is %1 current employment status?',
      option: {
        [EmploymentOption.employed]: 'Employed',
        [EmploymentOption.self_employed]: 'Self-employed',
        [EmploymentOption.retired]: 'Retired',
        [EmploymentOption.currently_unavailable_for_work]: 'Currently unavailable for work',
        [EmploymentOption.unemployed_actively_looking_for_work]: 'Unemployed - actively looking for work',
        [EmploymentOption.unemployed_not_actively_looking_for_work]: 'Unemployed - not actively looking for work',
      },
    },
  },
} as const

export type EmploymentLocale = Locale<typeof english>
