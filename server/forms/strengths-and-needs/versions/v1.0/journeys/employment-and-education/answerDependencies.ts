import { AnswerDependency } from '../../../../effects/assessment/answerDependency'
import { Question } from './constants/question'
import { Option } from './constants/option'
import { CommonOption } from '../../constants/commonOption'

/**
 * Mirrors the employment conditions in `section.ts`. Every governing answer lives
 * on `employment-status`, every dependant on `employment-education-details`.
 */
export const employmentEducationAnswerDependencies: readonly AnswerDependency[] = [
  {
    // Mirrors `isEmployedOrSelfEmployed`.
    appliesWhen: [{ answer: Question.employment_status, isOneOf: [Option.employed, Option.self_employed] }],
    codes: [Question.employment_area],
  },
  {
    // Mirrors `hasBeenEmployedOrRetired`.
    appliesWhen: [
      { answer: Question.employment_status, isOneOf: [Option.employed, Option.retired] },
      { answer: Question.has_been_employed, isOneOf: [CommonOption.yes] },
    ],
    codes: [
      Question.employment_history,
      Question.employment_history_stable_details,
      Question.employment_history_periods_of_instability_details,
      Question.employment_history_unstable_details,
      Question.employment_history_unknown_details,
    ],
  },
  {
    // Mirrors `hasBeenEmployed`.
    appliesWhen: [
      { answer: Question.employment_status, isOneOf: [Option.employed] },
      { answer: Question.has_been_employed, isOneOf: [CommonOption.yes] },
    ],
    codes: [
      Question.employment_experience,
      Question.employment_experience_positive_details,
      Question.employment_experience_mostly_positive_details,
      Question.employment_experience_positive_and_negative_details,
      Question.employment_experience_mostly_negative_details,
      Question.employment_experience_negative_details,
    ],
  },
  {
    // Mirrors `isNotRetired`.
    appliesWhen: [{ answer: Question.employment_status, isNoneOf: [Option.retired] }],
    codes: [
      Question.education_experience,
      Question.education_experience_positive_details,
      Question.education_experience_mostly_positive_details,
      Question.education_experience_positive_and_negative_details,
      Question.education_experience_mostly_negative_details,
      Question.education_experience_negative_details,
    ],
  },
]
