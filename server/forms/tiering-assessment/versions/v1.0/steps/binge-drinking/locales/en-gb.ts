import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.binge_drinking]: {
      text: 'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      option: {
        [CommonOption.no_problems]: {
          text: 'No evidence of binge drinking or excessive alcohol use',
          hint: '',
        },
        [CommonOption.some_problems]: {
          text: 'Some evidence of binge drinking or excessive alcohol use',
          hint: 'There is a pattern of alcohol use but has not caused any serious problems.',
        },
        [CommonOption.significant_problems]: {
          text: 'Evidence of binge drinking or excessive alcohol use',
          hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending.',
        },
      },
    },
  },
} as const

export type BingeDrinkingLocale = Locale<typeof english>
