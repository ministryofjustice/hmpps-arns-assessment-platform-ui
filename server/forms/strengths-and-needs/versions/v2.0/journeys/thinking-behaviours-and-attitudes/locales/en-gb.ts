import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  step: {
    // Visible page heading on the two sexual-harm pages, distinct from their browser title.
    [Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.code]: 'Risk of sexual harm',
  },
  question: {
    [Question.thinking_behaviours_attitudes_consequences]: {
      text: 'Is %1 aware of the consequences of their actions?',
      hint: 'This includes towards themselves and to others.',
      option: {
        [CommonOption.yes]: 'Yes, is aware of the consequences of their actions',
        [Option.sometimes]: 'Sometimes is aware of the consequences of their actions',
        [CommonOption.no]: 'No, is not aware of the consequences of their actions',
      },
      validation: 'Select if they are aware of the consequences of their actions',
    },
    [Question.thinking_behaviours_attitudes_stable_behaviour]: {
      text: 'Does %1 show stable behaviour?',
      hint: 'Consider their ability to manage boredom and routine tasks, and their level of thrill-seeking or risky behaviour.',
      option: {
        [CommonOption.yes]: 'Yes, shows stable behaviour',
        [Option.sometimes]: 'Sometimes shows stable behaviour but can show reckless or risk taking behaviours',
        [CommonOption.no]: 'No, shows reckless or risk taking behaviours',
      },
      validation: 'Select if they show stable behaviour',
    },
    [Question.thinking_behaviours_attitudes_offending_activities]: {
      text: 'Does %1 engage in activities that could link to offending?',
      option: {
        [Option.no_offending_activities]: {
          text: 'No, does not engage in these activities',
          hint: 'Engages is positive activities and relationships and avoids situations that may create opportunities to offend.',
        },
        [Option.sometimes_offending_activities]: {
          text: 'Yes, sometimes',
          hint: 'Sometimes spends time in activities, situations or relationships linked to offending but recognises the risks.',
        },
        [Option.yes_offending_activities]: {
          text: 'Yes, regularly',
          hint: 'Regularly spending time in activities, situations or relationships that encourage offending and does not recognise, or choose not to act on, the risks.',
        },
      },
      validation: 'Select if they engage in activities that could link to offending',
    },
    [Question.thinking_behaviours_attitudes_peer_pressure]: {
      text: 'Is %1 influenced by others in relation to their offending?',
      option: {
        [CommonOption.yes]: {
          text: 'No, not influenced by others',
          hint: 'Has not been influenced by other in relation to offending, or taken clear steps to avoid negative influences.',
        },
        [Option.some]: {
          text: 'Yes, sometimes',
          hint: 'Has been influenced by others in relation to offending but recognises the influence and is trying to reduce it.',
        },
        [CommonOption.no]: {
          text: 'Yes, regularly',
          hint: 'Is regularly influenced by others in relation to offending and remains vulnerable to peer pressure, manipulation or criminal associates.',
        },
      },
      validation: 'Select if they’re influenced by others in relation to their offending',
    },
    [Question.thinking_behaviours_attitudes_problem_solving]: {
      text: 'Is %1 able to solve problems in a positive way?',
      option: {
        [CommonOption.yes]: 'Yes, is able to solve problems and identify appropriate solutions',
        [Option.limited_problem_solving]: 'Has limited problem solving skills',
        [CommonOption.no]:
          'No, has poor problem solving skills and is unable to identify what steps to take to solve a problem',
      },
      validation: 'Select if they are able to solve problems in a positive way',
    },
    [Question.thinking_behaviours_attitudes_peoples_views]: {
      text: 'Does %1 understand other people’s views?',
      option: {
        [CommonOption.yes]:
          'Yes, understands other people’s views and is able to distinguish between their own feelings and those of others',
        [Option.sometimes]:
          'Assumes all views are the same as theirs at first but does consider other people’s views to an extent',
        [CommonOption.no]:
          'No, unable to understand other people’s views and distinguish between their own feelings and those of others',
      },
      validation: 'Select if they understand other people’s views',
    },
    [Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour]: {
      text: 'Are there any indications that %1 manipulates or exploits other people for personal gain?',
      hint: 'Consider any current or past history of using deception, abusing trust or taking advantage of other people for personal gain.',
      option: {
        [CommonOption.no]: {
          text: 'No indications',
          hint: 'No history of manipulating, exploiting or taking advantage of others for personal gain.',
        },
        [Option.some]: {
          text: 'Some indications',
          hint: 'History of manipulative or exploitative behaviour in certain situations or relationships.',
        },
        [CommonOption.yes]: {
          text: 'Significant indications',
          hint: 'Clear and recurring pattern of manipulating, exploiting or taking advantage of others for personal gain.',
        },
      },
      validation: 'Select if there are indications they manipulate or exploit other people for personal gain?',
    },
    [Question.thinking_behaviours_attitudes_temper_management]: {
      text: 'Is %1 able to manage their temper?',
      option: {
        [CommonOption.yes]: {
          text: 'Yes, manages it well',
          hint: 'Recognises situations that make them angry or frustrated and deals with them effectively. Remains calm and does not lose control.',
        },
        [Option.sometimes]: {
          text: 'Yes, sometimes able to manage it',
          hint: 'Occasionally loses control when angry or frustrated, or has difficulty dealing with conflict in some situations.',
        },
        [CommonOption.no]: {
          text: 'No, is not able to manage it',
          hint: 'Regularly loses control when angry or frustrated and finds it difficult to remain calm or deal with conflict effectively.',
        },
      },
      validation: 'Select if they are able to manage their temper',
    },
    [Question.thinking_behaviours_attitudes_violence_controlling_behaviour]: {
      text: 'Does %1 use violence, aggressive or controlling behaviour to get their own way?',
      option: {
        [Option.no_violence]: 'Does not use violence, aggressive or controlling behaviour to get their own way',
        [Option.sometimes]: 'Some evidence of using violence, aggressive or controlling behaviour to get their own way',
        [Option.yes_violence]: 'Patterns of using violence, aggressive or controlling behaviour to get their own way',
      },
      validation: 'Select if they use violence, aggressive or controlling behaviour to get their own way',
    },
    [Question.thinking_behaviours_attitudes_impulsive_behaviour]: {
      text: 'Does %1 act on impulse?',
      option: {
        [CommonOption.no]: 'Considers all aspects of a situation before acting on or making a decision',
        [Option.sometimes]: 'Sometimes acts on impulse which causes problems',
        [CommonOption.yes]: 'Acts on impulse which causes significant problems',
      },
      validation: 'Select if they act on impulse',
    },
    [Question.thinking_behaviours_attitudes_hostile_orientation]: {
      text: 'Does %1 show hostility towards other people, rules or authority?',
      option: {
        [CommonOption.no]: {
          text: 'No, does not show hostility',
          hint: 'Can consider other people’s views, discuss disagreements constructively and move past previous conflicts.',
        },
        [Option.some]: {
          text: 'Yes, sometimes',
          hint: 'Sometimes shows suspicious, angry or vengeful thinking, or struggles to accept other people’s views.',
        },
        [CommonOption.yes]: {
          text: 'Yes, regularly',
          hint: 'Regularly shows suspicious, angry or vengeful thinking and behaviour, holds grudges, shows little regard for other people’s views or wellbeing, or views other people, rules or authority with hostility.',
        },
      },
      validation: 'Select if they show hostility towards other people, rules or authority',
    },
    [Question.thinking_behaviours_attitudes_supervision]: {
      text: 'Are there indications %1 is willing to engage positively with their sentence?',
      option: {
        [Option.yes_supervision]: {
          text: 'Significant indications',
          hint: 'Willing to engage positively and cooperate.',
        },
        [Option.unsure_supervision]: {
          text: 'Some indications',
          hint: 'Has mixed views about their sentence or engages only to meet minimum requirements.',
        },
        [Option.no_supervision]: {
          text: 'No indications',
          hint: 'Is unlikely to engage positively with their sentence.',
        },
      },
      validation: 'Select if there are indications they are willing to engage positively with their sentence',
    },
    [Question.thinking_behaviours_attitudes_criminal_behaviour]: {
      text: 'Does %1 support or excuse criminal behaviour?',
      option: {
        [CommonOption.no]: 'Does not support or excuse criminal behaviour',
        [Option.sometimes]: 'Sometimes supports or excuses criminal behaviour',
        [CommonOption.yes]:
          'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
      },
      validation: 'Select if they support or excuse criminal behaviour',
    },
    [Question.thinking_behaviours_attitudes_risk_sexual_harm]: {
      text: 'Are there any concerns that %1 poses a risk of sexual harm to others?',
      hint: `
        <div class="govuk-warning-text govuk-!-static-margin-0">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            %1 does not have any current or previous sexual or sexually motivated offences
          </strong>
        </div>
      `,
      option: {
        [CommonOption.yes]: {
          hint: 'Information suggests that there is evidence of sexual behaviour that could pose a risk of sexual harm to others.',
        },
      },
      validation: 'Select if there are any concerns they are a risk of sexual harm',
    },
    [Question.thinking_behaviours_attitudes_sexual_preoccupation]: {
      text: 'Is there evidence %1 shows sexual preoccupation?',
      hint: 'Sexual preoccupation is when sexual thoughts or behaviours take up a significant amount of time and affect day-to-day life, relationships, responsibilities or other important activities.',
      option: {
        [CommonOption.no]: {
          text: 'No evidence',
          hint: 'Sexual thoughts or behaviours do not appear to affect their daily functioning.',
        },
        [Option.sometimes]: {
          text: 'Some evidence',
          hint: 'Sexual thoughts or behaviours take up a significant amount of time, but there is evidence of other interests or attempts to reduce the behaviour.',
        },
        [CommonOption.yes]: {
          text: 'Significant evidence',
          hint: 'Sexual thoughts or behaviours take up a significant amount of time and have a substantial impact on their daily functioning.',
        },
      },
      validation: 'Select if there’s evidence of sexual preoccupation',
    },
    [Question.thinking_behaviours_attitudes_offence_related_sexual_interest]: {
      text: 'Is there evidence %1 has offence-related sexual interests?',
      option: {
        [Option.no_offence_related_sexual_interest]: {
          text: 'No evidence',
          hint: 'Healthy sexual interests. While offending may have involved illegal sexual activity, their usual way of meeting sexual needs is legal and consensual.',
        },
        [Option.some_offence_related_sexual_interest]: {
          text: 'Yes, some evidence',
          hint: 'Some evidence of healthy, consensual sexual activity, but also recurring interest in or behaviour involving illegal or harmful sexual activity.',
        },
        [Option.yes_offence_related_sexual_interest]: {
          text: 'Yes, significant evidence',
          hint: 'A persistent preference for illegal or harmful sexual activity, with little or no evidence of healthy, consensual sexual interests.',
        },
      },
      validation: 'Select if they show evidence of offence-related sexual interests',
    },
    [Question.thinking_behaviours_attitudes_emotional_intimacy]: {
      text: 'Is there evidence %1 finds it easier to seek emotional intimacy with children over adults?',
      hint: 'This means looking to children to meet emotional needs that would usually be met through relationships with other adults.',
      option: {
        [CommonOption.no]: {
          text: 'No evidence',
          hint: 'They have or have had an intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships.',
        },
        [Option.sometimes]: {
          text: 'Yes, some evidence',
          hint: 'Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults.',
        },
        [CommonOption.yes]: {
          text: 'Yes, significant evidence',
          hint: 'They find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults.',
        },
      },
      validation:
        'Select if they show evidence that they find it easier to seek emotional intimacy with children over adults',
    },
    [Question.thinking_behaviours_attitudes_changes]: {
      text: 'Does %1 want to make changes to their thinking, behaviours and attitudes?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their thinking, behaviours and attitudes',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 thinking, behaviours and attitudes?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their thinking, behaviours and attitudes',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Are %1 thinking, behaviours and attitudes linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending]: {
      text: 'Are %1 thinking, behaviours and attitudes linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
} as const

export type ThinkingBehavioursAttitudesLocale = Locale<typeof english>
