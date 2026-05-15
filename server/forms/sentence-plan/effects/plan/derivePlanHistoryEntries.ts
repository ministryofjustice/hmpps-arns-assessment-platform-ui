import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'
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
  const goalUuid = item.customData?.goalUuid ?? item.data?.goalUuid

  return typeof goalUuid === 'string' && goalUuid.length > 0 ? goalUuid : undefined
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
      targetDate: snapshot.targetDate ? new Date(snapshot.targetDate) : undefined,
      statusDate: snapshot.statusDate ? new Date(snapshot.statusDate) : undefined,
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
    targetDate: currentGoal.targetDate,
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
    if (
      item.customType === 'GOAL_UPDATED' &&
      item.customData?.isInitialStepAdd &&
      item.customData?.goalUuid &&
      item.customData?.goalSnapshot
    ) {
      const stepAddSnapshot = item.customData.goalSnapshot as GoalSnapshotData
      initialStepAddSteps.set(item.customData.goalUuid, stepAddSnapshot.steps)
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
    const date = new Date(item.timestamp)
    const goalUuid = getTimelineGoalUuid(item)
    const currentGoal = goals.find(g => g.uuid === goalUuid)
    let snapshot = customData.goalSnapshot as GoalSnapshotData | undefined

    if (item.customType === 'GOAL_CREATED' && snapshot) {
      const initialSteps = initialStepAddSteps.get(customData.goalUuid)
      if (initialSteps) {
        snapshot = { ...snapshot, steps: initialSteps }
      }
    }

    const goalContext: GoalEventContext = {
      ...buildGoalContext(snapshot, currentGoal, areasOfNeed, actorLabels, personName),
      // Always live, not snapshotted — drives routing decisions like "View goal".
      currentGoalStatus: currentGoal ? (currentGoal.status as GoalStatus) : undefined,
    }

    switch (item.customType) {
      case 'GOAL_CREATED':
        entries.push({
          type: 'goal_created',
          uuid: `created-${item.uuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          createdBy: customData.createdBy,
          ...goalContext,
        })
        break

      case 'GOAL_ACHIEVED':
        entries.push({
          type: 'goal_achieved',
          uuid: `achieved-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          achievedBy: customData.achievedBy,
          notes: customData.notes,
          ...goalContext,
        })
        break

      case 'GOAL_REMOVED': {
        const isCurrentlyActive = currentGoal?.status === 'ACTIVE' || currentGoal?.status === 'FUTURE'
        entries.push({
          type: 'goal_removed',
          uuid: `removed-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          removedBy: customData.removedBy,
          reason: customData.reason,
          isCurrentlyActive,
          ...goalContext,
        })
        break
      }

      case 'GOAL_READDED':
        entries.push({
          type: 'goal_readded',
          uuid: `readded-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          readdedBy: customData.readdedBy,
          reason: customData.reason,
          ...goalContext,
        })
        break

      case 'GOAL_UPDATED':
        entries.push({
          type: 'goal_updated',
          uuid: `updated-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          updatedBy: customData.updatedBy,
          notes: customData.notes,
          ...goalContext,
        })
        break

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
  entries.sort((a, b) => b.date.getTime() - a.date.getTime())

  context.setData('planHistoryEntries', entries)
}
