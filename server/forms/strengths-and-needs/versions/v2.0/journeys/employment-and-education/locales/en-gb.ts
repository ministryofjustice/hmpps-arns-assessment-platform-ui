import { Question } from '../constants/question'
import { Option } from '../constants/option'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.community_employment_status]: {
      text: 'What is %1 current employment status?',
      option: {
        [Option.employed_or_self_employed]: 'Employed or Self-employed',
        [Option.retired]: 'Retired',
        [Option.currently_unavailable_for_work]: 'Currently unavailable for work',
        [Option.unemployed]: 'Unemployed',
      },
      validation: 'Select their employment status',
    },
    [Question.community_ever_had_a_job]: {
      text: 'Has %1 ever had a job?',
      validation: 'Select if they have ever had a job',
    },
    [Question.community_employment_history]: {
      text: 'What is %1 employment history?',
      hint: 'Include their current employment.',
      option: {
        [Option.stable]: {
          text: 'Continuous employment history',
          hint: 'They may have had a break in employment due to things like redundancy, illness or caring for a family member.',
        },
        [Option.periods_of_instability]: 'Generally in employment but changes jobs often',
        [Option.unstable]: 'Unstable employment history with regular periods of unemployment',
      },
      validation: 'Select their employment history',
    },
    [Question.employment_education_changes]: {
      text: 'Does %1 want to make changes to their employment and education?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their employment and education',
    },
    [Question.community_employment_other_responsibilities]: {
      text: 'Does %1 have any additional day-to-day commitments?',
      hint: 'Select all that apply.',
      option: {
        [Option.carer]: 'Caring responsibilities',
        [Option.child]: 'Child responsibilities',
        [Option.studying]: 'Studying',
        [Option.volunteer]: 'Volunteering',
        [CommonOption.none]: 'No additional day-to-day commitments',
      },
      validation: `Select if they have any additional day-to-day commitments, or select 'No additional day-to-day commitments'`,
    },
    [Question.education_transferable_skills]: {
      text: 'How would you describe %1 skills for work?',
      option: {
        [CommonOption.yes]: {
          text: 'Strong work-related skills',
          hint: 'Has completed training, work experience or transferable skills that could help them get or keep a job.',
        },
        [Option.yes_some_skills]: {
          text: 'Some work-related skills',
          hint: 'Has limited work experience, partially completed training or skills that are not directly transferable.',
        },
        [CommonOption.no]: {
          text: 'No work-related skills',
          hint: 'Has no skills or experience that could help them get a job.',
        },
      },
      validation: 'Select how you would describe their skills for work',
    },
    [Question.education_academic_professional_vocational_qualifications]: {
      text: 'Does %1 have any completed academic, professional or vocational qualifications?',
      hint: 'For  example, GCSEs, A levels, degrees, apprenticeships, trade qualifications, driving qualifications or professional certifications.',
      option: {
        [CommonOption.yes]: {
          hint: 'Include the qualifications, subjects and grades, if known.',
        },
      },
      validation: `Select if they have any completed academic, professional or vocational qualifications`,
    },
    [Question.education_difficulties]: {
      text: 'Does %1 need support with reading, writing or numeracy?',
      hint: 'Select all that apply.',
      option: {
        [Option.reading]: 'Yes, with reading',
        [Option.writing]: 'Yes, with writing',
        [Option.numeracy]: 'Yes, with numeracy',
        [CommonOption.none]: 'No support needed with reading, writing or numeracy',
      },
      validation: `Select if they need support with reading, writing or numeracy, or select 'No support needed with reading, writing or numeracy'`,
    },
    [Question.education_difficulties_reading_severity]: {
      text: 'How much support does %1 need with reading?',
      options: {
        [Option.significant_difficulties]: {
          text: 'Significant support needed',
          hint: 'Has a substantial impact on day-to-day life and they are likely to need regular support.',
        },
        [Option.some_difficulties]: {
          text: 'Some support needed',
          hint: 'Can usually manage day-to-day reading but may need support with some written information.',
        },
      },
      validation: 'Select level of support needed',
    },
    [Question.education_difficulties_writing_severity]: {
      text: 'How much support does %1 need with writing?',
      options: {
        [Option.significant_difficulties]: {
          text: 'Significant support needed',
          hint: 'Has a substantial impact on day-to-day life and they are likely to need regular support.',
        },
        [Option.some_difficulties]: {
          text: 'Some support needed',
          hint: 'Can usually manage day-to-day writing but may need support with spelling, grammar or completing longer writing tasks.',
        },
      },
      validation: 'Select level of support needed',
    },
    [Question.education_difficulties_numeracy_severity]: {
      text: 'How much support does %1 need with numeracy?',
      options: {
        [Option.significant_difficulties]: {
          text: 'Significant support needed',
          hint: 'Has a substantial impact on day-to-day life and they are likely to need regular support.',
        },
        [Option.some_difficulties]: {
          text: 'Some support needed',
          hint: 'Can usually manage day-to-day numeracy but may need support with calculations, numbers or money-related tasks.',
        },
      },
      validation: 'Select level of support needed',
    },
    [Question.community_employment_history_stable_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.community_employment_history_periods_of_instability_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.community_employment_history_unstable_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.employment_education_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 employment and education?',
      hint: 'Include any strategies, people or support networks that helped. Also consider any relevant soft skills.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their employment and education',
    },
    [Question.employment_education_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 employment and education linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.employment_education_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 employment and education linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.employment_education_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
  option: {
    [Option.positive]: 'Positive',
    [Option.mostly_positive]: 'Mostly positive',
    [Option.positive_and_negative]: 'Positive and negative',
    [Option.mostly_negative]: 'Mostly negative',
    [Option.negative]: 'Negative',
    [Option.yes_some_skills]: 'Some skills',
    [Option.significant_difficulties]: 'Significant difficulties',
    [Option.some_difficulties]: 'Some difficulties',
  },
} as const

export type EmploymentAndEducationLocale = Locale<typeof english>
