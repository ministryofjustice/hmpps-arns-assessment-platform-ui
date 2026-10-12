import { AnswerDependencyRegistry } from '../../effects/assessment/answerDependency'
import { accommodationAnswerDependencies } from './journeys/accommodation/answerDependencies'
import { alcoholUseAnswerDependencies } from './journeys/alcohol-use/answerDependencies'
import { employmentEducationAnswerDependencies } from './journeys/employment-and-education/answerDependencies'
import { healthWellbeingAnswerDependencies } from './journeys/health-wellbeing/answerDependencies'
import { personalRelationshipsCommunityAnswerDependencies } from './journeys/personal-relationships-and-community/answerDependencies'

/**
 * Every cross-step answer dependency in Strengths and Needs, by journey.
 *
 * A save only evaluates the journey whose answers it touched, so a journey is
 * covered by adding its file here — there is no per-step wiring.
 *
 * Journeys with no entry here have no cross-step dependencies: their conditional
 * answers sit on the same step as the answer that governs them, where
 * `dependentWhen` already handles them.
 */
export const strengthsAndNeedsAnswerDependencies: AnswerDependencyRegistry = {
  accommodation: accommodationAnswerDependencies,
  alcoholUse: alcoholUseAnswerDependencies,
  employmentAndEducation: employmentEducationAnswerDependencies,
  healthWellbeing: healthWellbeingAnswerDependencies,
  personalRelationshipsAndCommunity: personalRelationshipsCommunityAnswerDependencies,
}
