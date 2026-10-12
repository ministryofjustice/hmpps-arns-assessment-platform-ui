import { AnswerDependency } from '../../../../effects/assessment/answerDependency'
import { Question } from './constants/question'
import { CommonOption } from '../../constants/commonOption'

/**
 * Mirrors `hasPhysicalHealthConditions` and `mayHaveMentalHealthProblems` in
 * `section.ts`. The governing answers live on `health-wellbeing-status`, the
 * dependants on `health-wellbeing-details`.
 */
export const healthWellbeingAnswerDependencies: readonly AnswerDependency[] = [
  {
    appliesWhen: [{ answer: Question.health_wellbeing_physical_health_condition, isOneOf: [CommonOption.yes] }],
    codes: [Question.health_wellbeing_prescribed_medication_physical_conditions],
  },
  {
    appliesWhen: [
      {
        answer: Question.health_wellbeing_mental_health_condition,
        isNoneOf: [CommonOption.no, CommonOption.unknown],
      },
    ],
    codes: [
      Question.health_wellbeing_prescribed_medication_mental_conditions,
      Question.health_wellbeing_psychiatric_treatment,
    ],
  },
]
