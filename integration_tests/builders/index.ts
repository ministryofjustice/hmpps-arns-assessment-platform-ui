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
  withAgreedPlanAndGoals,
} from './sentencePlanFactories'

export type {
  GoalConfig,
  StepConfig,
  GoalStatus,
  StepStatus,
  AgreementStatus,
  AreaOfNeedSlug,
  CreatedSentencePlan,
  CreatedGoal,
  CreatedStep,
} from './SentencePlanBuilder'

// Types
export type {
  AssessmentDefinition,
  CollectionDefinition,
  CollectionItemDefinition,
  CreatedAssessment,
  CreatedCollection,
  CreatedCollectionItem,
} from './types'
