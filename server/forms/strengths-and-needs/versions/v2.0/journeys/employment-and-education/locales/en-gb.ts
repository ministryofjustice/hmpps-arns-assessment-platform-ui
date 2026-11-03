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
    },
    [Question.community_ever_had_a_job]: {
      text: 'Has %1 ever had a job?',
    },
    [Question.employment_history]: {
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
    [Question.employment_type]: {
      text: 'What is the type of employment?',
      option: {
        [Option.full_time]: 'Full-time',
        [Option.part_time]: 'Part-time',
        [Option.temporary_or_casual]: 'Temporary or casual',
        [Option.apprenticeship]: 'Apprenticeship',
      },
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
      },
      validation: `Select if they have any additional day-to-day commitments, or select 'None'`,
    },
    [Question.education_transferable_skills]: {
      text: 'Does %1 have any skills that could help them in a job or to get a job?',
      option: {
        [CommonOption.yes]: {
          hint: 'This includes any completed training, qualifications, work experience or transferable skills.',
        },
        [Option.yes_some_skills]: {
          text: 'Some skills',
          hint: 'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
        },
        [CommonOption.no]: {
          hint: 'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.',
        },
      },
      validation: 'Select if they have any skills that could help them in a job or to get a job',
    },
    [Question.education_academic_professional_vocational_qualifications]: {
      text: 'Does %1 have any academic, professional or vocational qualifications?',
      validation: `Select if they have have any academic, professional or vocational qualifications`,
    },
    [Question.education_difficulties]: {
      text: 'Does %1 have difficulties with reading, writing or numeracy?',
      hint: 'Select all that apply.',
      option: {
        [Option.reading]: 'Yes, with reading',
        [Option.writing]: 'Yes, with writing',
        [Option.numeracy]: 'Yes, with numeracy',
        [CommonOption.none]: 'No difficulties',
      },
      validation: `Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'`,
    },
    [Question.education_difficulties_reading_severity]: {
      text: 'How much support does %1 need with reading?',
      validation: 'Select level of difficulty',
    },
    [Question.education_difficulties_writing_severity]: {
      text: 'How much support does %1 need with writing?',
      validation: 'Select level of difficulty',
    },
    [Question.education_difficulties_numeracy_severity]: {
      text: 'How much support does %1 need with numeracy?',
      validation: 'Select level of difficulty',
    },
    [Question.employment_history_stable_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.employment_history_periods_of_instability_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.employment_history_unstable_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.employment_history_unknown_details]: {
      hint: `Include what type of work they’ve done before.`,
    },
    [Question.employment_education_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 employment and education?',
      hint: 'Include any strategies, people or support networks that helped.',
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
