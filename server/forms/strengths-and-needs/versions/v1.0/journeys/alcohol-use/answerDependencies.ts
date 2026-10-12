import { AnswerDependency } from '../../../../effects/assessment/answerDependency'
import { Question } from './constants/question'
import { Option } from './constants/option'

/**
 * Mirrors `drankInLastThreeMonths` in `section.ts`. The governing answer lives on
 * `alcohol-use-status`, the dependants on `alcohol-use-details`.
 */
export const alcoholUseAnswerDependencies: readonly AnswerDependency[] = [
  {
    appliesWhen: [{ answer: Question.alcohol_use, isOneOf: [Option.yes_within_last_three_months] }],
    codes: [
      Question.alcohol_frequency,
      Question.alcohol_units,
      Question.alcohol_binge_drinking,
      Question.alcohol_binge_drinking_frequency,
    ],
  },
]
