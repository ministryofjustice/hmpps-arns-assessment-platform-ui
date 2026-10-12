import { AnswerDependency } from '../../../../effects/assessment/answerDependency'
import { Question } from './constants/question'
import { Option } from './constants/option'

/**
 * Mirrors `hasParentalResponsibilities` in `section.ts`. The governing answer
 * lives on `personal-relationships`, the dependants on
 * `personal-relationships-community`.
 */
export const personalRelationshipsCommunityAnswerDependencies: readonly AnswerDependency[] = [
  {
    appliesWhen: [
      {
        answer: Question.personal_relationships_community_important_people,
        isOneOf: [Option.child_parental_responsibilities],
      },
    ],
    codes: [
      Question.personal_relationships_community_parental_responsibilities,
      Question.personal_relationships_community_parental_responsibilities_yes_details,
      Question.personal_relationships_community_parental_responsibilities_sometimes_details,
      Question.personal_relationships_community_parental_responsibilities_no_details,
    ],
  },
]
