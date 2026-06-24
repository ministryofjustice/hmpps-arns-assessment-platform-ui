import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'

export const english = {
  step: {
    [Step.health_wellbeing.code]: 'Health Wellbeing',
    [Step.physical_mental_health.code]: 'Physical Mental Health',
    [Step.health_wellbeing_summary.code]: 'Health and Wellbeing Summary',
    [Step.health_wellbeing_analysis.code]: 'Health and Wellbeing Analysis',
  },
  question: {
    [Question.health_conditions]: {
      text: 'Does %1 have any physical health conditions?',
      validation: 'Select if they have any physical health conditions',
    },
    [Question.mental_health_problems]: {
      text: 'Does %1 have any diagnosed or documented mental health problems?',
      option: {
        [Option.yes_ongoing_severe]: 'Yes, ongoing - severe and documented over a prolonged period of times',
        [Option.yes_ongoing_duration_unknown]: 'Yes, ongoing - duration is not known or there is no link to offending',
        [Option.yes_past]: 'Yes, in the past',
      },
      validation: 'Select if they have any diagnosed or documented mental health problems',
    },
    [Question.prescribed_physical_health_medications_treatments]: {
      text: 'Give details if %1 is on prescribed medication or treatment for physical health conditions (optional)',
    },
    [Question.prescribed_mental_health_medications_treatments]: {
      text: 'Give details if %1 is on prescribed medication or treatment for mental health problems (optional)',
    },
    [Question.psychiatric_treatment]: {
      text: 'Is %1 currently having psychiatric treatment?',
      option: {
        [Option.pending_treatment]: 'Pending treatment'
      },
      validation: 'Select if they are currently having psychiatric treatment'
    },
    [Question.head_injuries]: {
      text: 'Has %1 had a head injury or any illness affecting the brain?',
      hint: '\'<div class="govuk-grid-width-full">\' +\n' +
        '      \'<p class="govuk-hint">This includes:</p>\' +\n' +
        '      \'<ul class="govuk-hint govuk-list govuk-list--bullet">\' +\n' +
        '      \'<li>traumatic brain injury</li>\' +\n' +
        '      \'<li>acquired brain injury</li>\' +\n' +
        '      \'<li>having fits</li>\'+\n' +
        '      \'<li>significant episodes of unconsciousness as a result of a head injury</li>\'+\n' +
        '      \'</ul>\'+\n' +
        '      \'</div>\'',
      validation: 'Select if they have had a head injury or any illness affecting the brain',
      },
    [Question.neurodiverse_conditions]: {
      text: 'Does %1 have any neurodiverse conditions?',
      validation: 'Select if they have any neurodiverse conditions',
      },
    [Question.impact_on_learning_abilities]: {
      text: 'Does %1 have any conditions or disabilities that impact their ability to learn? (optional)',
      hint: 'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
      option:{
        [Option.yes_learning_significantly_impacted]: 'Yes, their ability to learn is significantly impacted',
        [Option.yes_learning_slightly_impacted]: 'Yes, their ability to learn is slightly impacted',
        [Option.no_learning_abilities_impact]: 'No, they do not have any conditions or disabilities that impact their ability to learn'
      }
      },
    [Question.cope_with_day_to_day_life]: {
      text: 'Is %1 able to cope with day-to-day life?',
      option:{
        [Option.yes_able_to_cope]: 'Yes, able to cope well',
        [Option.has_difficulties_coping]: 'Has some difficulties coping',
        [Option.not_able_to_cope]: 'Not able to cope'
      },
      validation: 'Select if they are able to cope with day-to-day life',
      },
    [Question.attitude_towards_self]: {
      text: 'What is %1 attitude towards themselves?',
      option:{
        [Option.positive_reasonably_happy]: 'Positive and reasonably happy',
        [Option.would_like_to_change_aspects]: 'There are some aspects they would like to change or do not like',
        [Option.negative_unhappy]: {text: 'Negative self-image and unhappy',
          hint: 'This includes if they have an overly positive or unrealistic self-image which in reality is not true.'}
      },
      validation: 'Select their attitude towards themselves',
      },
    [Question.self_harm]: {
      text: 'Has %1 ever self-harmed?',
      validation: 'Select if they have ever self-harmed',
      },
    [Question.suicidal_tendencies]: {
      text: 'Has %1 ever attempted suicide or had suicidal thoughts?',
      hint: 'Consider what factors or circumstances are associated and if it\'s recurring.',
      validation: 'Select if they have ever attempted suicide or had suicidal thoughts',
    },
    [Question.feeling_about_future_health_wellbeing]: {
      text: 'How does %1 feel about their future?',
      hint: '%1 must answer this question',
      option: {
        [Option.optimistic_outlook]: 'Optimistic and has a positive outlook about their future',
        [Option.unsure_outlook]: 'Not sure and thinks their future could get better or worse',
        [Option.not_optimistic_outlook]: 'Not optimistic and thinks their future will not get better or may get worse',
        [Option.does_not_want_to_answer]: '%1 does not want to answer',
        [Option.not_present]: '%1 is not present',
      },
      validation: 'Select how optimistic they are about their future',
    },
    [Question.helped_during_periods_good_health_wellbeing]: {
      text: 'What\'s helped %1 during periods of good health and wellbeing? (optional)',
      hint: 'Consider what\'s helped them feel more hopeful.<br><br> Select all that apply.',
      option: {
        [Option.accommodation]: 'Accommodation',
        [Option.employment]: 'Employment',
        [Option.faith_religion]: 'Faith or religion',
        [Option.feeling_part_of_community]: 'Feeling part of a community or giving back',
        [Option.medication_or_treatment]: 'Medication and treatment',
        [Option.money]: 'Money',
        [Option.relationships]: 'Relationships',
        [Option.other]: 'Other',
      }
    },
    [Question.changes_to_health_wellbeing]: {
      text: 'Does %1 want to make changes to their health and wellbeing?',
      hint: '%1 must answer this question.',
      option: {
        [Option.has_made_changes]: 'I have already made positive changes and want to maintain them',
        [Option.is_making_changes]: 'I am actively making changes',
        [Option.wants_to_make_changes_knows_how_to]: 'I want to make changes and know how to',
        [Option.wants_to_make_changes_needs_help]: 'I want to make changes but need help',
        [Option.thinking_about_making_changes]: 'I am thinking about making changes',
        [Option.does_not_want_to_make_changes]: 'I do not want to make changes',
        [Option.do_not_want_to_answer]: 'I do not want to answer',
      },
      validation: 'Select if they want to make changes to their health and wellbeing',
    },
    [Question.strengths_protective_factors_health_wellbeing_details]: {
      validation: 'Give details on strengths or protective factors related to their employment and education',
      },
    [Question.strengths_protective_factors_health_wellbeing]: {
      text: 'Are there any strengths or protective factors related to %1 health and wellbeing?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
      },
    [Question.serious_harm_health_wellbeing_details]: {
      validation: 'Give details on the risk of serious harm',
      },
    [Question.serious_harm_health_wellbeing]: {
      text: 'Is %1 health and wellbeing linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
      },
    [Question.risk_of_reoffending_health_wellbeing_details]: {
      validation: 'Give details on the risk of reoffending',
      },
    [Question.risk_of_reoffending_health_wellbeing]: {
      text: 'Is %1 health and wellbeing linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
      },
    },
  validation: {
    risk_of_serious_harm_details: 'Give details on the risk of serious harm',
  }
} as const

export type HealthAndWellbeingLocale = typeof english
