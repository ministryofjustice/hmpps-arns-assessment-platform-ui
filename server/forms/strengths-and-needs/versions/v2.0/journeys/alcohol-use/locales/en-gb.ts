import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.alcohol_current_issues]: {
      text: 'Is there evidence that %1 has had any issues with alcohol in the last 6 months?',
      hint: 'Consider the frequency and amount of alcohol consumed, and whether alcohol is having a negative impact on health, relationships, finances, daily life or offending behaviour.',
      option: {
        [Option.significant]: 'Yes, significant issues',
        [Option.some_problems]: 'Yes, some problems',
        [Option.no_current_problems]: 'No issues',
        [Option.has_never_drank]: 'They have never drank alcohol',
      },
      validation: 'Select if there is evidence that they have had any issues with alcohol in the last 6 months',
    },
    [Question.alcohol_evidence_of_excess_drinking]: {
      text: 'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      option: {
        [Option.no_evidence]: 'No evidence',
        [Option.yes_with_some_evidence]: {
          text: 'Yes, some evidence',
          hint: 'There is a pattern of alcohol use but has not caused any serious problems.',
        },
        [Option.yes_with_evidence]: {
          text: 'Yes, significant evidence',
          hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending.',
        },
      },
      validation: "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months",
    },
    [Question.alcohol_past_issues]: {
      text: 'Does %1 have any past issues with alcohol?',
      validation: 'Select if they have any past issues with alcohol',
    },
    [Question.alcohol_stopped_or_reduced_past]: {
      text: 'Has anything helped %1 to stop or reduce drinking alcohol in the past?',
      hint: 'Consider strategies, treatment, people or support networks that may have helped.',
      validation: 'Select if anything has helped them to stop or reduce drinking alcohol in the past',
    },
    [Question.alcohol_stopped_or_reduced]: {
      text: 'Does anything help %1 to stop or reduce drinking alcohol?',
      hint: 'Consider strategies, treatment, people or support networks that may have helped.',
      validation: 'Select if anything helps them to stop or reduce drinking alcohol',
    },
    [Question.alcohol_use_changes]: {
      text: 'Does %1 want to make changes to their alcohol use?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their alcohol use',
    },
    [Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 alcohol use?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their alcohol use',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 alcohol use linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 alcohol use linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
} as const

export type AlcoholLocale = Locale<typeof english>
