import { FormatExpr } from '@form-engine/form/types/expressions.type'
import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { User } from '../../../interfaces/user'
import { Answers, Properties } from '../../../interfaces/aap-api/dataModel'
import { areasOfNeed } from '../versions/v1.0/constants'
import { AssessmentPlatformApiClient, DeliusApiClient } from '../../../data'

export type GoalStatus = 'ACTIVE' | 'FUTURE'
export type StepStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

// Plan agreement statuses - DRAFT is the initial status before any agreement action
export type AgreementStatus =
  | 'DRAFT'
  | 'AGREED'
  | 'DO_NOT_AGREE'
  | 'COULD_NOT_ANSWER'
  | 'UPDATED_AGREED'
  | 'UPDATED_DO_NOT_AGREE'

// Statuses that indicate a plan has been through the agreement process (not draft)
export const POST_AGREEMENT_PROCESS_STATUSES: AgreementStatus[] = [
  'AGREED',
  'DO_NOT_AGREE',
  'COULD_NOT_ANSWER',
  'UPDATED_AGREED',
  'UPDATED_DO_NOT_AGREE',
]

export interface RawCollection {
  name: string
  uuid: string
  items: RawCollectionItem[]
}

export interface RawCollectionItem {
  uuid: string
  answers: Answers
  properties: Properties
  collections?: RawCollection[]
}

export interface DerivedStep {
  uuid: string
  actor: string
  actorLabel: string
  status: string
  description: string
  statusDate: string
}

export interface DerivedNote {
  uuid: string
  type: string
  note: string
  createdBy: string
  createdAt: Date
}

export interface DerivedGoal {
  uuid: string
  title: string
  status: string
  targetDate: Date
  statusDate: Date
  areaOfNeed: string
  areaOfNeedLabel: string
  relatedAreasOfNeed: string[]
  relatedAreasOfNeedLabels: string[]
  stepsCollectionUuid?: string
  steps: DerivedStep[]
  notesCollectionUuid?: string
  notes: DerivedNote[]
  /**
   * Position in the underlying GOALS collection.
   * Used by reorderGoal effect to calculate swap positions.
   */
  collectionIndex: number
  /**
   * First goal of its status group (ACTIVE, FUTURE, etc).
   * Controls visibility of "Move goal up" button on plan overview.
   */
  isFirstInStatus: boolean
  /**
   * Last goal of its status group (ACTIVE, FUTURE, etc).
   * Controls visibility of "Move goal down" button on plan overview.
   */
  isLastInStatus: boolean
}

export interface DerivedPlanAgreement {
  uuid: string
  status: AgreementStatus
  statusDate: Date
  agreementQuestion: string
  detailsNo?: string
  detailsCouldNotAnswer?: string
  notes?: string
}

export type AreaOfNeed = (typeof areasOfNeed)[number]

export type AreaOfNeedSlug = AreaOfNeed['slug']

export interface GoalAnswers {
  title: string
  area_of_need: string
  related_areas_of_need: string[]
  target_date?: string
}

export interface GoalProperties {
  status: GoalStatus
  status_date: string
}

export interface StepAnswers {
  status: StepStatus
  actor: string
  description: string
}

export interface StepProperties {
  status_date: string
}

export interface PlanAgreementAnswers {
  agreement_question: string
  details_no?: string
  details_could_not_answer?: string
  notes?: string
}

export interface PlanAgreementProperties {
  status: AgreementStatus
  status_date: string
}

/**
 * Alert variant types matching MOJ Alert component
 */
export type NotificationType = 'information' | 'success' | 'warning' | 'error'

/**
 * Notification structure stored in session
 */
export interface PlanNotification {
  type: NotificationType
  title?: string
  message: string | FormatExpr
  target: string
}

/**
 * Step data structure stored in session during step editing
 */
export interface StepSession {
  id: string
  actor: string
  description: string
}

/**
 * All step changes for a goal, organized into buckets
 */
export interface StepChanges {
  /** Steps currently visible in the form (existing + new) */
  steps: StepSession[]
  /** IDs of new steps to create on save */
  toCreate: string[]
  /** IDs of existing steps to update on save (populated at save time) */
  toUpdate: string[]
  /** UUIDs of existing steps to delete on save */
  toDelete: string[]
  /** UUID of the STEPS collection (if goal already has one) */
  collectionUuid?: string
}

/**
 * Session storage for step changes, keyed by goal UUID
 */
export type StepChangesStorage = Record<string, StepChanges>

/**
 * Data stored via context.setData() / context.getData()
 */
export interface SentencePlanData extends Record<string, unknown> {
  // Assessment
  assessment: { collections?: unknown[]; assessmentUuid?: string }
  assessmentUuid: string

  // Goals
  goals: DerivedGoal[]
  goalsCollectionUuid: string
  activeGoal: DerivedGoal
  activeGoalUuid: string
  activeGoalStepsOriginal: StepSession[]
  activeGoalStepsEdited: StepSession[]

  // Plan Agreements
  planAgreements: DerivedPlanAgreement[]
  planAgreementsCollectionUuid: string
  latestAgreementStatus: AgreementStatus | undefined
  latestAgreementDate: Date | undefined

  // Areas of need
  areasOfNeed: AreaOfNeed[]
  currentAreaOfNeed: AreaOfNeed
  otherAreasOfNeed: AreaOfNeed[]
  areaOfNeedSlugs: string[]

  // Actor labels
  actorLabels: Record<string, string>

  // Case data (from Delius)
  caseData: unknown
}

/**
 * Form answers via context.setAnswer() / context.getAnswer()
 *
 * Includes both static field codes and dynamic indexed fields (step_actor_0, etc.)
 */
export interface SentencePlanAnswers extends Record<string, unknown> {
  // Goal form fields
  goal_title: string
  related_areas_of_need: string[]
  can_start_now: string
  target_date_option: string
  custom_target_date: string

  // Dynamic step fields are accessed via index signature
  [key: `step_actor_${number}`]: string
  [key: `step_description_${number}`]: string
}

/**
 * Session data via context.getSession()
 */
export interface SentencePlanSession {
  navigationReferrer?: string
  returnTo?: string
  assessmentUuid?: string
  accessType?: 'mpop' | 'oasys'
  stepChanges?: StepChangesStorage
  notifications?: PlanNotification[]
}

/**
 * Request state via context.getState()
 */
export interface SentencePlanState extends Record<string, unknown> {
  user: User & { authSource: string }
}

/**
 * Typed effect context for Sentence Plan v1.0
 *
 * Use this type for effect function parameters to get full type safety:
 *
 * @example
 * const myEffect = (deps: Deps) => async (context: SentencePlanContext) => {
 *   context.getData('assessmentUuid')  // typed as string
 *   context.getSession().accessType    // typed as 'mpop' | 'oasys' | undefined
 *   context.getState('user')           // typed as User
 * }
 */
export type SentencePlanContext = EffectFunctionContext<
  SentencePlanData,
  SentencePlanAnswers,
  SentencePlanSession,
  SentencePlanState
>

/**
 * Dependencies for sentence plan effects
 */
export interface SentencePlanEffectsDeps {
  api: AssessmentPlatformApiClient
  deliusApi: DeliusApiClient
}
