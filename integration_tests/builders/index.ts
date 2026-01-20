/**
 * Test data builders for e2e tests
 *
 * @example
 * import { AssessmentBuilder, SentencePlanBuilder, withCurrentGoals } from '../builders'
 */

// Generic assessment builder
export { AssessmentBuilder, CollectionBuilder, CollectionItemBuilder } from './AssessmentBuilder'

// Sentence plan builder
export { SentencePlanBuilder } from './SentencePlanBuilder'

// Sentence plan factory functions
export {
  createEmptySentencePlan,
  withCurrentGoals,
  withCurrentGoalsWithCompletedSteps,
  withFutureGoals,
  withMixedGoals,
  withGoals,
  withRemovedGoals,
} from './sentencePlanFactories'

export type { CreatedSentencePlan, CreatedGoal, CreatedStep } from './SentencePlanBuilder'

// Shared types
export type {
  GoalConfig,
  StepConfig,
  NoteConfig,
  GoalStatus,
  StepStatus,
  AreaOfNeedSlug,
  PlanAgreementStatus,
  AssessmentDefinition,
  CollectionDefinition,
  CollectionItemDefinition,
  CreatedAssessment,
  CreatedCollection,
  CreatedCollectionItem,
} from './types'
