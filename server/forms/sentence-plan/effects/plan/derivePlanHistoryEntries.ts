import { TimelineItem } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentDataModel.type'
import {
  AreaOfNeed,
  DerivedGoal,
  DerivedPlanAgreement,
  GoalEventContext,
  GoalStatus,
  PlanAgreementHistoryEntry,
  PlanHistoryEntry,
  SentencePlanContext,
} from '../types'
import { GoalSnapshotData } from '../goals/goalSnapshot'
import { sanitizeDateValue } from '../goals/goalUtils'

const getStringProperty = (data: Record<string, unknown> | undefined, property: string): string | undefined => {
  const value = data?.[property]

  return typeof value === 'string' ? value : undefined
}

const isGoalStatus = (value: unknown): value is GoalStatus => {
  return value === 'ACTIVE' || value === 'FUTURE' || value === 'REMOVED' || value === 'ACHIEVED'
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object'
}

const isGoalSnapshotStep = (value: unknown): value is GoalSnapshotData['steps'][number] => {
  if (!isRecord(value)) {
    return false
  }

  return typeof value.actor === 'string' && typeof value.description === 'string' && typeof value.status === 'string'
}

const isGoalSnapshotData = (value: unknown): value is GoalSnapshotData => {
  if (!isRecord(value)) {
    return false
  }

  return isGoalStatus(value.status) &&
    (value.targetDate === undefined || typeof value.targetDate === 'string') &&
    typeof value.statusDate === 'string' &&
    typeof value.areaOfNeed === 'string' &&
    Array.isArray(value.relatedAreasOfNeed) &&
    value.relatedAreasOfNeed.every(area => typeof area === 'string') &&
    Array.isArray(value.steps) &&
    value.steps.every(isGoalSnapshotStep)
}

const resolveAreaLabel = (slug: string | undefined, areasOfNeed: AreaOfNeed[]): string | undefined => {
  if (!slug) {
    return undefined
  }

  return areasOfNeed.find(a => a.slug === slug)?.text ?? slug
}

const resolveActorLabel = (
  actor: string | undefined,
  actorLabels: Record<string, string>,
  personName: string,
): string => {
  if (!actor) {
    return ''
  }

  if (actor === 'person_on_probation') {
    return personName
  }

  return actorLabels[actor] ?? actor
}

const getTimelineGoalUuid = (item: TimelineItem): string | undefined => {
  const goalUuid = getStringProperty(item.customData, 'goalUuid') ?? getStringProperty(item.data, 'goalUuid')

  return goalUuid?.length ? goalUuid : undefined
}

/**
 * Prefer the snapshot stored in customData; fall back to the current goal
 * for legacy events emitted before snapshotting was introduced.
 */
const buildGoalContext = (
  snapshot: GoalSnapshotData | undefined,
  currentGoal: DerivedGoal | undefined,
  areasOfNeed: AreaOfNeed[],
  actorLabels: Record<string, string>,
  personName: string,
): GoalEventContext => {
  if (snapshot) {
    return {
      goalStatus: snapshot.status,
      targetDate: sanitizeDateValue(snapshot.targetDate),
      statusDate: snapshot.statusDate,
      areaOfNeedLabel: resolveAreaLabel(snapshot.areaOfNeed, areasOfNeed),
      relatedAreasOfNeedLabels: snapshot.relatedAreasOfNeed
        .map(slug => resolveAreaLabel(slug, areasOfNeed))
        .filter((label): label is string => Boolean(label)),
      steps: snapshot.steps.map(step => ({
        actor: resolveActorLabel(step.actor, actorLabels, personName),
        description: step.description,
        status: step.status,
      })),
    }
  }

  if (!currentGoal) {
    return {}
  }

  return {
    goalStatus: currentGoal.status as GoalStatus,
    targetDate: sanitizeDateValue(currentGoal.targetDate),
    statusDate: currentGoal.statusDate,
    areaOfNeedLabel: currentGoal.areaOfNeedLabel,
    relatedAreasOfNeedLabels: currentGoal.relatedAreasOfNeedLabels,
    steps: currentGoal.steps.map(step => ({
      actor: step.actorLabel,
      description: step.description,
      status: step.status,
    })),
  }
}

/**
 * Derive unified plan history entries from timeline events and plan agreements.
 *
 * Goal events carry a `goalSnapshot` in customData (see effects/goals/goalSnapshot.ts)
 * which powers the expandable goal summary card. Data('goals') is used only for
 * legacy-event fallback and for "now" fields like `isCurrentlyActive` and
 * `currentGoalStatus` — those are intentionally about now, not the event time.
 *
 * Requires:
 * - Data('planTimeline'): Populated by loadPlanTimeline
 * - Data('planAgreements'): Populated by derivePlanAgreementsFromAssessment
 * - Data('goals'), Data('areasOfNeed'), Data('actorLabels'), Data('caseData')
 *
 * Sets:
 * - Data('planHistoryEntries'): Array of unified history entries
 */
export const derivePlanHistoryEntries = () => (context: SentencePlanContext) => {
  const planTimeline = (context.getData('planTimeline') as TimelineItem[] | undefined) ?? []
  const planAgreements = (context.getData('planAgreements') as DerivedPlanAgreement[] | undefined) ?? []
  const goals = (context.getData('goals') as DerivedGoal[] | undefined) ?? []
  const areasOfNeed = (context.getData('areasOfNeed') as AreaOfNeed[] | undefined) ?? []
  const actorLabels = (context.getData('actorLabels') as Record<string, string> | undefined) ?? {}
  const caseData = context.getData('caseData') as { name?: { forename?: string } } | undefined
  const personName = caseData?.name?.forename ?? 'Person on probation'

  // Steps from "initial step-add" events get folded into the matching
  // GOAL_CREATED entry so creating-a-goal-with-steps shows up as a single
  // history item rather than back-to-back created + updated.
  const initialStepAddSteps = new Map<string, GoalSnapshotData['steps']>()
  for (const item of planTimeline) {
    const goalUuid = getStringProperty(item.customData, 'goalUuid')
    const goalSnapshot = item.customData?.goalSnapshot

    if (
      item.customType === 'GOAL_UPDATED' &&
      item.customData?.isInitialStepAdd &&
      goalUuid &&
      isGoalSnapshotData(goalSnapshot)
    ) {
      initialStepAddSteps.set(goalUuid, goalSnapshot.steps)
    }
  }

  const deletedGoalUuids = new Set(
    planTimeline
      .filter(item => item.customType === 'GOAL_DELETED')
      .map(getTimelineGoalUuid)
      .filter((goalUuid): goalUuid is string => Boolean(goalUuid)),
  )

  const displayableTimeline = planTimeline.filter(item => {
    const goalUuid = getTimelineGoalUuid(item)
    const isDeletedGoal = goalUuid ? deletedGoalUuids.has(goalUuid) : false

    return !(item.customType === 'GOAL_UPDATED' && item.customData?.isInitialStepAdd) &&
      item.customType !== 'GOAL_DELETED' &&
      !((item.customType === 'GOAL_CREATED' || item.customType === 'GOAL_UPDATED') && isDeletedGoal)
  })

  const entries: PlanHistoryEntry[] = []

  for (const item of displayableTimeline) {
    const customData = item.customData ?? {}
    const date = item.timestamp
    const goalUuid = getTimelineGoalUuid(item)
    const goalTitle = getStringProperty(customData, 'goalTitle')
    const currentGoal = goals.find(g => g.uuid === goalUuid)
    let snapshot = isGoalSnapshotData(customData.goalSnapshot) ? customData.goalSnapshot : undefined

    if (item.customType === 'GOAL_CREATED' && snapshot && goalUuid) {
      const initialSteps = initialStepAddSteps.get(goalUuid)
      if (initialSteps) {
        snapshot = { ...snapshot, steps: initialSteps }
      }
    }

    const goalContext: GoalEventContext = {
      ...buildGoalContext(snapshot, currentGoal, areasOfNeed, actorLabels, personName),
      currentGoalStatus: currentGoal ? (currentGoal.status as GoalStatus) : undefined,
    }

    switch (item.customType) {
      case 'GOAL_CREATED': {
        entries.push({
          type: 'goal_created',
          uuid: `created-${item.uuid}-${item.timestamp}`,
          date,
          goalUuid,
          goalTitle,
          createdBy: getStringProperty(customData, 'createdBy'),
          ...goalContext,
        })
        break
      }

      case 'GOAL_ACHIEVED': {
        entries.push({
          type: 'goal_achieved',
          uuid: `achieved-${goalUuid}-${item.timestamp}`,
          date,
          goalUuid,
          goalTitle,
          achievedBy: getStringProperty(customData, 'achievedBy'),
          notes: getStringProperty(customData, 'notes'),
          ...goalContext,
        })
        break
      }

      case 'GOAL_REMOVED': {
        const isCurrentlyActive = currentGoal?.status === 'ACTIVE' || currentGoal?.status === 'FUTURE'
        entries.push({
          type: 'goal_removed',
          uuid: `removed-${goalUuid}-${item.timestamp}`,
          date,
          goalUuid,
          goalTitle,
          removedBy: getStringProperty(customData, 'removedBy'),
          reason: getStringProperty(customData, 'reason'),
          isCurrentlyActive,
          ...goalContext,
        })
        break
      }

      case 'GOAL_READDED': {
        entries.push({
          type: 'goal_readded',
          uuid: `readded-${goalUuid}-${item.timestamp}`,
          date,
          goalUuid,
          goalTitle,
          readdedBy: getStringProperty(customData, 'readdedBy'),
          reason: getStringProperty(customData, 'reason'),
          ...goalContext,
        })
        break
      }

      case 'GOAL_UPDATED': {
        entries.push({
          type: 'goal_updated',
          uuid: `updated-${goalUuid}-${item.timestamp}`,
          date,
          goalUuid,
          goalTitle,
          updatedBy: getStringProperty(customData, 'updatedBy'),
          notes: getStringProperty(customData, 'notes'),
          ...goalContext,
        })
        break
      }

      default:
        break
    }
  }

  // Add plan agreement entries
  for (const agreement of planAgreements) {
    const entry: PlanAgreementHistoryEntry = {
      type: 'agreement',
      uuid: agreement.uuid,
      date: agreement.statusDate,
      status: agreement.status,
      createdBy: agreement.createdBy,
      detailsNo: agreement.detailsNo,
      detailsCouldNotAnswer: agreement.detailsCouldNotAnswer,
      notes: agreement.notes,
    }
    entries.push(entry)
  }

  // Sort by date, newest first
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  context.setData('planHistoryEntries', entries)
}
