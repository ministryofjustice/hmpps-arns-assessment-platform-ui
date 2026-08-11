import { Question } from '../constants/question'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.health_wellbeing_physical_health_condition]: {
      text: 'Does %1 have any physical health conditions?',
      validation: 'Select if they have any physical health conditions',
    },
    [Question.health_wellbeing_mental_health_condition]: {
      text: 'Does %1 have any diagnosed or documented mental health problems?',
      option: {
        [Option.yes_ongoing_severe]: 'Yes, ongoing - severe and documented over a prolonged period of time',
        [Option.yes_ongoing]: 'Yes, ongoing - duration is not known or there is no link to offending',
        [Option.yes_in_the_past]: 'Yes, in the past',
      },
      validation: 'Select if they have any diagnosed or documented mental health problems',
    },
    [Question.health_wellbeing_prescribed_medication_physical_conditions]: {
      text: 'Give details if %1 is on prescribed medication or treatment for physical health conditions (optional)',
    },
    [Question.health_wellbeing_prescribed_medication_mental_conditions]: {
      text: 'Give details if %1 is on prescribed medication or treatment for mental health problems (optional)',
    },
    [Question.health_wellbeing_psychiatric_treatment]: {
      text: 'Is %1 currently having psychiatric treatment?',
      option: {
        [Option.pending_treatment]: 'Pending treatment',
      },
      validation: 'Select if they are currently having psychiatric treatment',
    },
    [Question.health_wellbeing_head_injury_or_illness]: {
      text: 'Has %1 had a head injury or any illness affecting the brain?',
      hint:
        '<div class="govuk-grid-width-full">' +
        '<p class="govuk-hint">This includes:</p>' +
        '<ul class="govuk-hint govuk-list govuk-list--bullet">' +
        '<li>traumatic brain injury</li>' +
        '<li>acquired brain injury</li>' +
        '<li>having fits</li>' +
        '<li>significant episodes of unconsciousness as a result of a head injury</li>' +
        '</ul>' +
        '</div>',
      validation: 'Select if they have had a head injury or any illness affecting the brain',
    },
    [Question.health_wellbeing_neurodiverse_conditions]: {
      text: 'Does %1 have any neurodiverse conditions?',
      hint: 'Include diagnosis and neurodiverse characteristics.',
      validation: 'Select if they have any neurodiverse conditions',
    },
    [Question.health_wellbeing_learning_difficulties]: {
      text: 'Does %1 have any conditions or disabilities that impact their ability to learn? (optional)',
      hint: 'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
      option: {
        [Option.yes_significant_difficulties]: 'Yes, their ability to learn is significantly impacted',
        [Option.yes_some_difficulties]: 'Yes, their ability to learn is slightly impacted',
        [Option.no]: 'No, they do not have any conditions or disabilities that impact their ability to learn',
      },
    },
    [Question.health_wellbeing_coping_day_to_day_life]: {
      text: 'Is %1 able to cope with day-to-day life?',
      option: {
        [Option.yes]: 'Yes, able to cope well',
        [Option.yes_some_difficulties]: 'Has some difficulties coping',
        [Option.no]: 'Not able to cope',
      },
      validation: 'Select if they are able to cope with day-to-day life',
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
    [Question.health_wellbeing_outlook]: {
      text: 'How does %1 feel about their future?',
      hint: '%1 must answer this question.',
      option: {
        [Option.optimistic]: 'Optimistic and has a positive outlook about their future',
        [Option.not_sure]: 'Not sure and thinks their future could get better or worse',
        [Option.not_optimistic]: 'Not optimistic and thinks their future will not get better or may get worse',
        [Option.does_not_want_to_answer]: '%1 does not want to answer',
        [Option.not_present]: '%1 is not present',
      },
      validation: 'Select how optimistic they are about their future',
    },
    [Question.health_wellbeing_positive_factors]: {
      text: 'What’s helped %1 during periods of good health and wellbeing? (optional)',
      hint: 'Consider what’s helped them feel more hopeful.<br><br> Select all that apply.',
      option: {
        [Option.accommodation]: 'Accommodation',
        [Option.employment]: 'Employment',
        [Option.faith_or_religion]: 'Faith or religion',
        [Option.community]: 'Feeling part of a community or giving back',
        [Option.medication_or_treatment]: 'Medication and treatment',
        [Option.money]: 'Money',
        [Option.relationships]: 'Relationships',
        [Option.other]: 'Other',
      },
    },
    [Question.health_wellbeing_changes]: {
      text: 'Does %1 want to make changes to their health and wellbeing?',
      hint: '%1 must answer this question.',
      option: {
        [Option.made_changes]: 'I have already made positive changes and want to maintain them',
        [Option.making_changes]: 'I am actively making changes',
        [Option.want_to_make_changes]: 'I want to make changes and know how to',
        [Option.needs_help_to_make_changes]: 'I want to make changes but need help',
        [Option.thinking_about_making_changes]: 'I am thinking about making changes',
        [Option.does_not_want_to_make_changes]: 'I do not want to make changes',
        [Option.does_not_want_to_answer]: 'I do not want to answer',
      },
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
  validation: {
    risk_of_serious_harm_details: 'Give details on the risk of serious harm',
  },
} as const

export type HealthAndWellbeingLocale = typeof english
