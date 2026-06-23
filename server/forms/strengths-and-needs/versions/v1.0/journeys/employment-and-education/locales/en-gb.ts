import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption';

export const english = {
  step: {
    [Step.current_employment.code]: 'Current Employment',
    [Step.employed.code]: 'Employed',
    [Step.employment_education_summary.code]: 'Employment and Education Summary',
    [Step.employment_education_analysis.code]: 'Employment and Education Analysis',
  },
  question: {
    [Question.type_of_employment]: {
      text: 'Select the type of employment',
      option: {
        [Option.full_time]: 'Full-time',
        [Option.part_time]: 'Part-time',
        [Option.temporary_or_casual]: 'Temporary or casual',
        [Option.apprenticeship]: 'Apprenticeship',
      },
      validation: 'Select the type of employment',
    },
    [Question.had_previous_employment_unavailable_for_work]: {
      text: 'Have they been employed before?',
    },
    [Question.had_previous_employment_actively_looking_for_work]: {
      text: 'Have they been employed before?',
    },
    [Question.had_previous_employment_not_looking_for_work]: {
      text: 'Have they been employed before?',
    },
    [Question.current_employment_status]: {
      text: 'What is %1 current employment status?',
      option: {
        [Option.employed]: 'Employed',
        [Option.self_employed]: 'Self-employed',
        [Option.retired]: 'Retired',
        [Option.currently_unavailable_for_work]: 'Currently unavailable for work',
        [Option.unemployed_actively_looking]: 'Unemployed - actively looking for work',
        [Option.unemployed_not_actively_looking]: 'Unemployed - not actively looking for work',
      },
      validation: 'Select the type of employment they currently have',
    },
    [Question.employment_history]: {
      text: 'What is  %1 employment history?',
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
    [Question.employment_sector]: {
      text: 'What job sector does %1 work in? (optional)',
    },
    [Question.employment_and_education_changes]: {
      text: 'Does %1 want to make changes to their employment and education?',
      validation: 'Select if they want to make changes to their employment and education',
    },
    [Question.day_to_day_commitments]: {
      text: 'Does %1 have any day-to-day commitments?',
      hint: 'Select all that apply.',
      option: {
        [Option.caring]: 'Caring responsibilities',
        [Option.children]: 'Child responsibilities',
        [Option.studying]: 'Studying',
        [Option.volunteering]: 'Volunteering',
      },
      validation: `Select if they have any additional day-to-day commitments, or select 'None'`,
    },
    [Question.academic_qualification]: {
      text: 'Select the highest level of academic qualification %1 has completed',
      option: {
        [Option.entry_level]: {
          text: 'Entry level',
          hint: 'For example, entry level diploma',
        },
        [Option.level_1]: {
          text: 'Level 1',
          hint: 'For example, GCSE grades 3, 2, 1 or grades D, E, F, G',
        },
        [Option.level_2]: {
          text: 'Level 2',
          hint: 'For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C',
        },
        [Option.level_3]: {
          text: 'Level 3',
          hint: 'For example, A level',
        },
        [Option.level_4]: {
          text: 'Level 4',
          hint: 'For example, higher apprenticeship',
        },
        [Option.level_5]: {
          text: 'Level 5',
          hint: 'For example, foundation degree',
        },
        [Option.level_6]: {
          text: 'Level 6',
          hint: 'For example, degree with honours',
        },
        [Option.level_7]: {
          text: 'Level 7',
          hint: `For example, master's degree`,
        },
        [Option.level_8]: {
          text: 'Level 8',
          hint: 'For example, doctorate',
        },
      },
      validation: 'Select the highest level of academic qualification completed',
    },
    [Question.professional_qualification]: {
      text: 'Does %1 have any professional or vocational qualifications?',
      validation: 'Select if they have any professional or vocational qualifications',
    },
    [Question.professional_qualification_details]: {
      validation: 'Enter details',
    },
    [Question.job_skills]: {
      text: 'Does %1 have any skills that could help them in a job or to get a job?',
      option: {
        [CommonOption.yes]: {
          hint: 'This includes any completed training, qualifications, work experience or transferable skills.',
        },
        [Option.some_skills]: {
          text: 'Some skills',
          hint: 'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
        },
        [CommonOption.no]: {
          hint: 'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.',
        },
      },
      validation: 'Select if they have any skills that could help them in a job or to get a job',
    },
    [Question.difficulties_reading_writing_numeracy]: {
      text: 'Does %1 have difficulties with reading, writing or numeracy?',
      hint: 'Select all that apply.',
      option: {
        [Option.yes_reading]: 'Yes, with reading',
        [Option.yes_writing]: 'Yes, with writing',
        [Option.yes_numeracy]: 'Yes, with numeracy',
        [Option.no_difficulties]: 'No difficulties',
      },
      validation: `Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'`,
    },
    [Question.employment_experience]: {
      text: 'What is %1 overall experience of employment?',
      validation: 'Select their overall experience of employment',
    },
    [Question.education_experience]: {
      text: 'What is %1 experience of education?',
      validation: 'Select their experience of education',
    },
    [Question.numeracy_difficulty_level]: {
      text: 'Select level of difficulty',
      validation: 'Select level of difficulty',
    },
    [Question.writing_difficulty_level]: {
      text: 'Select level of difficulty',
      validation: 'Select level of difficulty',
    },
    [Question.reading_difficulty_level]: {
      text: 'Select level of difficulty',
      validation: 'Select level of difficulty',
    },
    [Question.continuous_employment_history_employment_details]: {
      hint: `Include what type of work they've done before.`,
    },
    [Question.changes_often_employment_history_employment_details]: {
      hint: `Include what type of work they've done before.`,
    },
    [Question.unstable_employment_history_employment_details]: {
      hint: `Include what type of work they've done before.`,
    },
    [Question.unknown_employment_history_employment_details]: {
      hint: `Include what type of work they've done before.`,
    },
    [Question.employment_education_strengths_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 employment and education?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.employment_education_strengths_protective_factors_details]: {
      validation: 'Give details on strengths or protective factors related to their employment and education',
    },
    [Question.employment_education_linked_to_serious_harm]: {
      text: 'Is %1 employment and education linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.employment_education_serious_harm_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.employment_education_linked_to_reoffending]: {
      text: 'Is %1 employment and education linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.employment_education_risk_of_reoffending_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
  option: {
    [Option.yes_has_been_employed_before]: 'Yes, has been employed before',
    [Option.no_has_never_been_employed]: 'No, has never been employed',
    [Option.positive]: 'Positive',
    [Option.mostly_positive]: 'Mostly positive',
    [Option.positive_and_negative]: 'Positive and negative',
    [Option.mostly_negative]: 'Mostly negative',
    [Option.negative]: 'Negative',
    [Option.some_skills]: 'Some skills',
    [Option.significant_difficulties]: 'Significant difficulties',
    [Option.some_difficulties]: 'Some difficulties',
  },
} as const

export type EmploymentAndEducationLocale = Locale<typeof english>
