import {
  DerivedGoal,
  DerivedPlanAgreement,
  GoalAchievedHistoryEntry,
  GoalReaddedHistoryEntry,
  GoalRemovedHistoryEntry,
  PlanAgreementHistoryEntry,
  PlanHistoryEntry,
  SentencePlanContext,
} from '../types'
import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'

/**
 * Derive unified plan history entries from plan agreements and goal events.
 *
 * This effect combines:
 * - Plan agreement events (agreed, not agreed, could not answer)
 * - Goal achieved events (with optional notes)
 * - Goal removed events (with removal reason)
 * - Goal re-added events (when a removed goal is added back into the plan)
 *
 * All entries are sorted by date (newest first) to provide a chronological timeline.
 *
 * Sets:
 * - Data('planHistoryEntries'): Array of unified history entries
 */
export const derivePlanHistoryEntries = () => (context: SentencePlanContext) => {
  const planAgreements = (context.getData('planAgreements') as DerivedPlanAgreement[] | undefined) ?? []
  const goals = (context.getData('goals') as DerivedGoal[] | undefined) ?? []

  const entries: PlanHistoryEntry[] = []

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

  // Add achieved goal entries from timeline data
  const planTimeline = (context.getData('planTimeline') as TimelineItem[] | undefined) ?? []
  for (const item of planTimeline) {
    if (item.customType === 'GOAL_ACHIEVED' && item.customData) {
      const entry: GoalAchievedHistoryEntry = {
        type: 'goal_achieved',
        uuid: `achieved-${item.customData.goalUuid}`,
        date: new Date(item.timestamp),
        goalUuid: item.customData.goalUuid,
        goalTitle: item.customData.goalTitle,
        achievedBy: item.customData.achievedBy,
        notes: item.customData.notes,
      }
      entries.push(entry)
    }
  }

  // Add removed goal entries from timeline data
  for (const item of planTimeline) {
    if (item.customType === 'GOAL_REMOVED' && item.customData) {
      const currentGoal = goals.find(g => g.uuid === item.customData.goalUuid)
      const isCurrentlyActive = currentGoal ? currentGoal.status === 'ACTIVE' || currentGoal.status === 'FUTURE' : false

      const entry: GoalRemovedHistoryEntry = {
        type: 'goal_removed',
        uuid: `removed-${item.customData.goalUuid}-${item.timestamp}`,
        date: new Date(item.timestamp),
        goalUuid: item.customData.goalUuid,
        goalTitle: item.customData.goalTitle,
        removedBy: item.customData.removedBy,
        reason: item.customData.reason,
        isCurrentlyActive,
      }
      entries.push(entry)
    }
  }

  // Add re-added goal entries from timeline data
  for (const item of planTimeline) {
    if (item.customType === 'GOAL_READDED' && item.customData) {
      const entry: GoalReaddedHistoryEntry = {
        type: 'goal_readded',
        uuid: `readded-${item.customData.goalUuid}-${item.timestamp}`,
        date: new Date(item.timestamp),
        goalUuid: item.customData.goalUuid,
        goalTitle: item.customData.goalTitle,
        readdedBy: item.customData.readdedBy,
        reason: item.customData.reason,
      }
      entries.push(entry)
    }
  }

  // Sort by date, newest first
  entries.sort((a, b) => b.date.getTime() - a.date.getTime())

  context.setData('planHistoryEntries', entries)
}
