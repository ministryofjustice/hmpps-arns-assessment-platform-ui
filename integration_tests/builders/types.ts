import { Answers, Properties } from '../../server/interfaces/aap-api/dataModel'

/**
 * Goal status enum matching the form-engine types
 */
export type GoalStatus = 'ACTIVE' | 'FUTURE' | 'REMOVED' | 'ACHIEVED'

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
 * Note configuration for test setup.
 *
 * Note types track goal lifecycle events:
 * - REMOVED: Created when a goal is removed from the plan
 * - READDED: Created when a previously removed goal is added back
 * - PROGRESS: General progress updates on active goals
 */
export interface NoteConfig {
  type: 'REMOVED' | 'READDED' | 'PROGRESS'
  note: string
  createdBy?: string
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
  notes?: NoteConfig[]
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
