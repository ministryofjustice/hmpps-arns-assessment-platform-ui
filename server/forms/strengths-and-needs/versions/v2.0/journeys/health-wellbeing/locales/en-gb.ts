import { Question } from '../constants/question'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.health_wellbeing_physical_health_condition]: {
      text: 'Does %1 have any physical health conditions?',
      validation: 'Select if they have any physical health conditions',
    },
    [Question.health_wellbeing_any_mental_health_conditions]: {
      text: 'Does %1 have any mental health conditions?',
      validation: 'Select if they have any mental health conditions',
    },
    [Question.health_wellbeing_mental_health_condition]: {
      text: 'How would you describe %1 mental health conditions?',
      option: {
        [Option.yes_ongoing_severe]: 'Ongoing and diagnosed, with documented evidence of significant impact',
        [Option.yes_ongoing]: 'Ongoing and diagnosed, without documented evidence of significant impact',
        [Option.yes_in_the_past]: 'In the past and diagnosed or documented',
        [Option.undiagnosed]: 'Undiagnosed, self reported or waiting for a consultation',
      },
      validation: 'Select how would you describe their mental health conditions',
    },
    [Question.health_wellbeing_psychiatric_treatment]: {
      text: 'Is %1 currently having psychiatric treatment?',
      option: {
        [Option.pending_treatment]: 'Pending treatment',
      },
      validation: 'Select if they are currently having psychiatric treatment',
    },
    [Question.health_wellbeing_learning_difficulties]: {
      text: 'Does %1 have any conditions or disabilities that impact their ability to learn? (optional)',
      hint: 'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
      option: {
        [Option.yes_significant_difficulties]: 'Yes, their ability to learn is significantly impacted',
        [Option.yes_some_difficulties]: 'Yes, their ability to learn is slightly impacted',
        [CommonOption.no]: 'No, they do not have any conditions or disabilities that impact their ability to learn',
      },
    },
    [Question.health_wellbeing_coping_day_to_day_life]: {
      text: 'Is %1 able to cope with day-to-day life?',
      option: {
        [CommonOption.yes]: 'Yes, able to cope well',
        [Option.yes_some_difficulties]: 'Has some difficulties coping',
        [CommonOption.no]: 'Not able to cope',
      },
      validation: 'Select if they are able to cope with day-to-day life',
    },
    [Question.health_wellbeing_gambling]: {
      text: 'Is %1 affected by gambling?',
      option: {
        [Option.yes_their_gambling]: 'Yes, their own gambling',
        [Option.yes_someone_elses_gambling]: 'Yes, someone else’s gambling',
      },
      validation: 'Select if they are affected by gambling',
    },
    [Question.health_wellbeing_attitude_towards_self]: {
      text: 'What is %1 attitude towards themselves?',
      option: {
        [Option.positive]: 'Positive and reasonably happy',
        [Option.some_negative_aspects]: 'There are some aspects they would like to change or do not like',
        [Option.negative]: {
          text: 'Negative self-image and unhappy',
          hint: 'This includes if they have an overly positive or unrealistic self-image which in reality is not true.',
        },
      },
      validation: 'Select their attitude towards themselves',
    },
    [Question.health_wellbeing_self_harmed]: {
      text: 'Has %1 ever self-harmed?',
      hint: 'Consider what factors or circumstances are associated and if it’s recurring.',
      validation: 'Select if they have ever self-harmed',
    },
    [Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts]: {
      text: 'Has %1 ever attempted suicide or had suicidal thoughts?',
      hint: 'Consider what factors or circumstances are associated and if it’s recurring.',
      validation: 'Select if they have ever attempted suicide or had suicidal thoughts',
    },
    [Question.health_wellbeing_changes]: {
      text: 'Does %1 want to make changes to their health and wellbeing?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their health and wellbeing',
    },
    [Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their health and wellbeing',
    },
    [Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 health and wellbeing?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 health and wellbeing linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
    [Question.health_wellbeing_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 health and wellbeing linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
  },
} as const

export type HealthAndWellbeingLocale = typeof english
