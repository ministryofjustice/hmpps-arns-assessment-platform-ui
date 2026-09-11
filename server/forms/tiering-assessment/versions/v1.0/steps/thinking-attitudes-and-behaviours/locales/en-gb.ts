import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.regular_offending_activities]: {
      text: 'Does %1 engage in activities that could link to offending?',
      option: {
        [CommonOption.no_problems]: 'Engages in pro-social activities and understands the link to offending',
        [CommonOption.some_problems]: 'Sometimes engages in activities linked to offending but recognises the link',
        [CommonOption.significant_problems]:
          'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
      },
    },
    [Question.temper_control]: {
      text: 'Is %1 able to manage their temper?',
      option: {
        [CommonOption.no_problems]: 'Yes, is able to manage their temper well',
        [CommonOption.some_problems]: 'Sometimes has outbreaks of uncontrolled anger',
        [CommonOption.significant_problems]: 'No, easily loses their temper',
        hint: 'This may result in a loss of control or inability to stay calm until they have expressed their anger',
      },
    },
    [Question.impulsivity_problems]: {
      text: 'Does %1 act on impulse?',
      option: {
        [CommonOption.no_problems]: 'Considers all aspects of a situation before acting on or making a decision',
        [CommonOption.some_problems]: 'Sometimes acts on impulse which causes problems',
        [CommonOption.significant_problems]: 'Acts on impulse which causes significant problems',
      },
    },
    [Question.pro_criminal_attitudes]: {
      text: 'Does %1 support or excuse criminal behaviour?',
      option: {
        [CommonOption.no_problems]: 'Does not support or excuse criminal behaviour',
        [CommonOption.some_problems]: 'Sometimes supports or excuses criminal behaviour',
        [CommonOption.significant_problems]:
          'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
      },
    },

  },
} as const

export type ThinkAttitudesBehaviourLocale = Locale<typeof english>
