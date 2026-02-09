import { Answers, Properties } from '../../server/interfaces/aap-api/dataModel'
import { GoalStatus, StepStatus, AreaOfNeedSlug } from '../../server/forms/sentence-plan/effects/types'

export { GoalStatus, StepStatus, AreaOfNeedSlug }

/**
 * Plan agreement status
 */
export type PlanAgreementStatus =
  | 'AGREED'
  | 'DO_NOT_AGREE'
  | 'COULD_NOT_ANSWER'
  | 'UPDATED_AGREED'
  | 'UPDATED_DO_NOT_AGREE'

/**
 * Plan agreement configuration for test setup
 */
export interface PlanAgreementConfig {
  status: PlanAgreementStatus
  createdBy?: string
  notes?: string
  detailsNo?: string
  detailsCouldNotAnswer?: string
  /** Date offset in milliseconds from now (negative for past) */
  dateOffset?: number
}

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
 * - ACHIEVED: Created when a goal is marked as achieved (optional notes about how it helped)
 * - REMOVED: Created when a goal is removed from the plan
 * - READDED: Created when a previously removed goal is added back
 * - UPDATED: Created when a goal's steps or details are updated
 * - PROGRESS: General progress updates on active goals
 */
export interface NoteConfig {
  type: 'ACHIEVED' | 'REMOVED' | 'READDED' | 'UPDATED' | 'PROGRESS'
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
  /** Name of the user who marked this goal as achieved. Only used when status is 'ACHIEVED'. */
  achievedBy?: string
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

export interface CollectionItemTimeline {
  type: string
  data: Record<string, unknown>
}

export interface CollectionItemDefinition {
  answers: Answers
  properties: Properties
  collections: CollectionDefinition[]
  timeline?: CollectionItemTimeline
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
