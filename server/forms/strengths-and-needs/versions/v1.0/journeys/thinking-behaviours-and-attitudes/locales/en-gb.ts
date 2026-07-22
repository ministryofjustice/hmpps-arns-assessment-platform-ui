import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'

export const english = {
  step: {
    [Step.thinkingBehaviours.code]: 'Thinking, behaviours and attitudes',
    [Step.thinkingBehavioursSexualHarm.code]: 'Risk of sexual harm',
    [Step.thinkingBehavioursSummary.code]: 'Thinking, behaviours and attitudes Summary',
    [Step.thinkingBehavioursAnalysis.code]: 'Thinking, behaviours and attitudes Analysis',
  },
  question: {
    [Question.thinking_behaviours_attitudes_consequences]: {
      text: 'Is %1 aware of the consequences of their actions?',
      hint: 'This includes towards themselves and to others.',
      option: {
        [Option.yes_consequences]: 'Yes, is aware of the consequences of their actions',
        [Option.sometimes_consequences]: 'Sometimes is aware of the consequences of their actions',
        [Option.no_consequences]: 'No, is not aware of the consequences of their actions',
      },
      validation: 'Select if they are aware of the consequences of their actions',
    },
    [Question.thinking_behaviours_attitudes_stable_behaviour]: {
      text: 'Does %1 show stable behaviour?',
      hint: 'Consider their ability to manage boredom and routine tasks, and their level of thrill-seeking or risky behaviour.',
      option: {
        [Option.yes_stable]: 'Yes, shows stable behaviour',
        [Option.sometimes_stable]: 'Sometimes shows stable behaviour but can show reckless or risk taking behaviours',
        [Option.no_stable]: 'No, shows reckless or risk taking behaviours',
      },
      validation: 'Select if they show stable behaviour',
    },
    [Question.thinking_behaviours_attitudes_offending_activities]: {
      text: 'Does %1 engage in activities that could link to offending?',
      option: {
        [Option.no_offending_activities]: 'Engages in pro-social activities and understands the link to offending',
        [Option.sometimes_offending_activities]:
          'Sometimes engages in activities linked to offending but recognises the link',
        [Option.yes_offending_activities]:
          'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
      },
      validation: 'Select if they engage in activities that could link to offending',
    },
    [Question.thinking_behaviours_attitudes_peer_pressure]: {
      text: 'Is %1 resilient towards peer pressure or influence by criminal associates?',
      option: {
        [Option.yes_peer_pressure]: 'Yes, resilient towards peer pressure or influence by criminal associates',
        [Option.some_peer_pressure]:
          'Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending',
        [Option.no_peer_pressure]:
          'No, constantly peer pressured or influenced by criminal associates which is linked to their offending',
      },
      validation: "Select if they're resilient towards peer pressure or influence by criminal associates",
    },
    [Question.thinking_behaviours_attitudes_problem_solving]: {
      text: 'Is %1 able to solve problems in a positive way?',
      option: {
        [Option.yes_problem_solving]: 'Yes, is able to solve problems and identify appropriate solutions',
        [Option.limited_problem_solving]: 'Has limited problem solving skills',
        [Option.no_problem_solving]:
          'No, has poor problem solving skills and is unable to identify what steps to take to solve a problem',
      },
      validation: 'Select if they are able to solve problems in a positive way',
    },
    [Question.thinking_behaviours_attitudes_peoples_views]: {
      text: "Does %1 understand other people's views?",
      option: {
        [Option.yes_peoples_views]:
          "Yes, understands other people's views and is able to distinguish between their own feelings and those of others",
        [Option.sometimes_peoples_views]:
          "Assumes all views are the same as theirs at first but does consider other people's views to an extent",
        [Option.no_peoples_views]:
          "No, unable to understand other people's views and distinguish between their own feelings and those of others",
      },
      validation: "Select if they understand other people's views",
    },
    [Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour]: {
      text: 'Does %1 show manipulative behaviour or a predatory lifestyle?',
      option: {
        [Option.no_manipulative]:
          'Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle',
        [Option.some_manipulative]:
          'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals',
        [Option.yes_manipulative]: 'Shows a pattern of manipulative behaviour or a predatory lifestyle',
      },
      validation: 'Select if they show manipulative behaviour or a predatory lifestyle',
    },
    [Question.thinking_behaviours_attitudes_temper_management]: {
      text: 'Is %1 able to manage their temper?',
      option: {
        [Option.yes_temper]: 'Yes, is able to manage their temper well',
        [Option.sometimes_temper]: 'Sometimes has outbreaks of uncontrolled anger',
        [Option.no_temper]: {
          text: 'No, easily loses their temper',
          hint: 'This may include frequent arguments or physical aggression',
        },
      },
      validation: 'Select if they are able to manage their temper',
    },
    [Question.thinking_behaviours_attitudes_violence_controlling_behaviour]: {
      text: 'Does %1 use violence, aggressive or controlling behaviour to get their own way?',
      option: {
        [Option.no_violence]: 'Does not use violence, aggressive or controlling behaviour to get their own way',
        [Option.sometimes_violence]:
          'Some evidence of using violence, aggressive or controlling behaviour to get their own way',
        [Option.yes_violence]: 'Patterns of using violence, aggressive or controlling behaviour to get their own way',
      },
      validation: 'Select if they use violence, aggressive or controlling behaviour to get their own way',
    },
    [Question.thinking_behaviours_attitudes_impulsive_behaviour]: {
      text: 'Does %1 act on impulse?',
      option: {
        [Option.no_impulsive]: 'Considers all aspects of a situation before acting on or making a decision',
        [Option.sometimes_impulsive]: 'Sometimes acts on impulse which causes problems',
        [Option.yes_impulsive]: 'Acts on impulse which causes significant problems',
      },
      validation: 'Select if they act on impulse',
    },
    [Question.thinking_behaviours_attitudes_positive_attitude]: {
      text: 'Does %1 have a positive attitude towards any criminal justice staff they have come into contact with?',
      option: {
        [Option.yes_positive_attitude]: 'Yes, has a positive attitude',
        [Option.negative_attitude_no_concerns]:
          'Has a negative attitude or does not fully engage but there are no safety concerns',
        [Option.negative_attitude_and_concerns]: 'No, has a negative attitude and there are safety concerns',
      },
      validation:
        'Select if they have a positive attitude towards any criminal justice staff they have come into contact with',
    },
    [Question.thinking_behaviours_attitudes_hostile_orientation]: {
      text: 'Does %1 have hostile orientation to others or to general rules?',
      option: {
        [Option.no_hostile]:
          "They're able to have constructive conversations when they disagree with others and can forgive past wrongs",
        [Option.some_hostile]: 'Some evidence of suspicious, angry or vengeful thinking and behaviour',
        [Option.yes_hostile]:
          'There is evidence of suspicious, angry <strong>and</strong> vengeful thinking and behaviour',
      },
      validation: 'Select if they have hostile orientation to others or to general rules',
    },
    [Question.thinking_behaviours_attitudes_supervision]: {
      text: 'Does %1 accept supervision and their licence conditions?',
      option: {
        [Option.yes_supervision]: 'Accepts supervision and has responded well to supervision in the past',
        [Option.unsure_supervision]: 'Unsure about supervision and has put minimum effort into supervision in the past',
        [Option.no_supervision]: 'Not prepared to accept supervision and has failed to follow supervision in the past',
      },
      validation: 'Select if they accept supervision and their licence conditions',
    },
    [Question.thinking_behaviours_attitudes_criminal_behaviour]: {
      text: 'Does %1 support or excuse criminal behaviour?',
      option: {
        [Option.no_criminal_behaviour]: 'Does not support or excuse criminal behaviour',
        [Option.sometimes_criminal_behaviour]: 'Sometimes supports or excuses criminal behaviour',
        [Option.yes_criminal_behaviour]:
          'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
      },
      validation: 'Select if they support or excuse criminal behaviour',
    },
    [Question.thinking_behaviours_attitudes_risk_sexual_harm]: {
      text: 'Are there any concerns that %1 poses a risk of sexual harm to others?',
      option: {
        [Option.yes_risk_sexual_harm]: 'Yes',
        [Option.no_risk_sexual_harm]: 'No',
      },
      validation: 'Select if there are any concerns they are a risk of sexual harm',
    },
    [Question.thinking_behaviours_attitudes_sexual_preoccupation]: {
      text: 'Is there evidence %1 shows sexual preoccupation?',
      option: {
        [Option.yes_sexual_preoccupation]:
          'Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life',
        [Option.sometimes_sexual_preoccupation]:
          'Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex',
        [Option.no_sexual_preoccupation]:
          'No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life',
        [Option.unknown_sexual_preoccupation]: 'Unknown',
      },
      validation: "Select if there's evidence of sexual preoccupation",
    },
    [Question.thinking_behaviours_attitudes_offence_related_sexual_interest]: {
      text: 'Is there evidence %1 has offence-related sexual interests?',
      option: {
        [Option.yes_offence_related_sexual_interest]:
          'Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests',
        [Option.some_offence_related_sexual_interest]:
          'Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful',
        [Option.no_offence_related_sexual_interest]:
          'No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful',
        [Option.unknown_offence_related_sexual_interest]: 'Unknown',
      },
      validation: 'Select if they show evidence of offence-related sexual interests',
    },
    [Question.thinking_behaviours_attitudes_emotional_intimacy]: {
      text: 'Is there evidence %1 finds it easier to seek emotional intimacy with children over adults?',
      option: {
        [Option.yes_emotional_intimacy]:
          'Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults',
        [Option.sometimes_emotional_intimacy]:
          'Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults',
        [Option.no_emotional_intimacy]:
          'No, they have or have had a intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships',
        [Option.unknown_emotional_intimacy]: 'Unknown',
      },
      validation:
        'Select if they show evidence that they find it easier to seek emotional intimacy with children over adults',
    },
    [Question.thinking_behaviours_attitudes_changes]: {
      text: 'Does %1 want to make changes to their thinking, behaviours and attitudes?',
      hint: 'This includes any changes they have made, are making or would like to make.',
      validation: 'Select if they want to make changes to their thinking, behaviours and attitudes',
    },
    [Question.thinking_behaviours_attitudes_strengths_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 thinking, behaviours and attitudes?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.thinking_behaviours_attitudes_strengths_protective_factors_details]: {
      validation: 'Give details on strengths or protective factors related to their thinking, behaviours and attitudes',
    },
    [Question.thinking_behaviours_attitudes_linked_to_serious_harm]: {
      text: 'Is %1 thinking, behaviours and attitudes linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.thinking_behaviours_attitudes_serious_harm_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.thinking_behaviours_attitudes_linked_to_reoffending]: {
      text: 'Is %1 thinking, behaviours and attitudes linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.thinking_behaviours_attitudes_risk_of_reoffending_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
} as const

export type ThinkingBehavioursAttitudesLocale = Locale<typeof english>
