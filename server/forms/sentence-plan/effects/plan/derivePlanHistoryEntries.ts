import {
  DerivedGoal,
  DerivedPlanAgreement,
  GoalAchievedHistoryEntry,
  GoalReaddedHistoryEntry,
  GoalRemovedHistoryEntry,
  GoalUpdatedHistoryEntry,
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
 * - Goal updated events (when a goal or its steps are changed)
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
    if (item.type !== 'GOAL_ACHIEVED') continue

    const entry: GoalAchievedHistoryEntry = {
      type: 'goal_achieved',
      uuid: `achieved-${item.data.goalUuid}`,
      date: new Date(item.createdAt),
      goalUuid: item.data.goalUuid,
      goalTitle: item.data.goalTitle,
      achievedBy: item.user?.name,
      notes: item.data.notes,
    }
    entries.push(entry)
  }

  // Add removed goal entries
  // Look for goals with REMOVED notes so that the removal event is still shown
  // even if the goal has been re-added.
  for (const goal of goals) {
    const removedNotes = goal.notes.filter(note => note.type === 'REMOVED')
    const isCurrentlyActive = goal.status === 'ACTIVE' || goal.status === 'FUTURE'
    for (const note of removedNotes) {
      const entry: GoalRemovedHistoryEntry = {
        type: 'goal_removed',
        uuid: `removed-${goal.uuid}-${note.uuid}`,
        date: note.createdAt,
        goalUuid: goal.uuid,
        goalTitle: goal.title,
        removedBy: note.createdBy,
        reason: note.note,
        isCurrentlyActive,
      }
      entries.push(entry)
    }
  }

  // Add re-added goal entries
  // A goal can be re-added (has READDED note) but is now ACTIVE or FUTURE
  for (const goal of goals) {
    const readdedNotes = goal.notes.filter(note => note.type === 'READDED')
    for (const note of readdedNotes) {
      const entry: GoalReaddedHistoryEntry = {
        type: 'goal_readded',
        uuid: `readded-${goal.uuid}-${note.uuid}`,
        date: note.createdAt,
        goalUuid: goal.uuid,
        goalTitle: goal.title,
        readdedBy: note.createdBy,
        reason: note.note,
      }
      entries.push(entry)
    }
  }

  // Add updated goal entries
  for (const goal of goals) {
    const updatedNotes = goal.notes.filter(note => note.type === 'UPDATED')
    for (const note of updatedNotes) {
      const entry: GoalUpdatedHistoryEntry = {
        type: 'goal_updated',
        uuid: `updated-${goal.uuid}-${note.uuid}`,
        date: note.createdAt,
        goalUuid: goal.uuid,
        goalTitle: goal.title,
        updatedBy: note.createdBy,
        reason: note.note,
      }
      entries.push(entry)
    }
  }

  // Sort by date, newest first
  entries.sort((a, b) => b.date.getTime() - a.date.getTime())

  context.setData('planHistoryEntries', entries)
}
