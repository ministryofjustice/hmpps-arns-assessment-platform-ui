import { Question } from '../constants/question'
import { CommonOption } from '../../../constants/commonOption'
import { Locale } from '../../../../../i18n'

export const english = {
  question: {
    [Question.ever_misused_drugs]: {
      text: 'Has %1 ever misused drugs?',
      hint: 'This includes illegal and prescription drugs.',
      option: {
        [CommonOption.yes]: 'Yes',
        [CommonOption.no]: 'No',
      },
    },
  },
} as const

export type drugMisuseLocale = Locale<typeof english>
