import { Answers, Properties } from '../../server/interfaces/aap-api/dataModel'

/**
 * Goal status enum matching the form-engine types
 */
export type GoalStatus = 'ACTIVE' | 'FUTURE'

/**
 * Step status enum matching the form-engine types
 */
export type StepStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

/**
 * Valid area of need slugs
 */
export type AreaOfNeedSlug =
  | 'accommodation'
  | 'employment-and-education'
  | 'finances'
  | 'drug-use'
  | 'alcohol-use'
  | 'health-and-wellbeing'
  | 'personal-relationships-and-community'
  | 'thinking-behaviours-and-attitudes'

/**
 * Plan agreement status
 */
export type PlanAgreementStatus = 'AGREED' | 'DO_NOT_AGREE' | 'COULD_NOT_ANSWER'

/**
 * Step configuration for test setup
 */
export interface StepConfig {
  actor: string
  description: string
  status?: StepStatus
}

/**
 * Goal configuration for test setup
 */
export interface GoalConfig {
  title: string
  areaOfNeed: AreaOfNeedSlug | string
  status?: GoalStatus
  targetDate?: string
  relatedAreasOfNeed?: string[]
  steps?: StepConfig[]
}

/**
 * Definition types - built during fluent API calls, before execution
 */

export interface AssessmentDefinition {
  assessmentType: string
  formVersion: string
  identifiers: Record<string, string>
  answers: Answers
  properties: Properties
  collections: CollectionDefinition[]
}

export interface CollectionDefinition {
  name: string
  items: CollectionItemDefinition[]
}

export interface CollectionItemDefinition {
  answers: Answers
  properties: Properties
  collections: CollectionDefinition[]
}

export interface CreatedAssessment {
  uuid: string
  collections: CreatedCollection[]
}

export interface CreatedCollection {
  name: string
  uuid: string
  items: CreatedCollectionItem[]
}

export interface CreatedCollectionItem {
  uuid: string
  collections: CreatedCollection[]
}
