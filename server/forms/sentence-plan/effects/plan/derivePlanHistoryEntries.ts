import {
  DerivedGoal,
  DerivedPlanAgreement,
  GoalAchievedHistoryEntry,
  GoalRemovedHistoryEntry,
  PlanAgreementHistoryEntry,
  PlanHistoryEntry,
  SentencePlanContext,
} from '../types'

/**
 * Derive unified plan history entries from plan agreements and goal events.
 *
 * This effect combines:
 * - Plan agreement events (agreed, not agreed, could not answer)
 * - Goal achieved events (with optional notes)
 * - Goal removed events (with removal reason)
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

  // Add achieved goal entries
  const achievedGoals = goals.filter(goal => goal.status === 'ACHIEVED')
  for (const goal of achievedGoals) {
    // Find the ACHIEVED note if one exists (contains the "how it helped" text)
    const achievedNote = goal.notes.find(note => note.type === 'ACHIEVED')

    const entry: GoalAchievedHistoryEntry = {
      type: 'goal_achieved',
      uuid: `achieved-${goal.uuid}`,
      date: goal.statusDate,
      goalUuid: goal.uuid,
      goalTitle: goal.title,
      achievedBy: goal.achievedBy,
      notes: achievedNote?.note,
    }
    entries.push(entry)
  }

  // Add removed goal entries
  const removedGoals = goals.filter(goal => goal.status === 'REMOVED')
  for (const goal of removedGoals) {
    // Find the REMOVED note if one exists (contains the removal reason)
    const removedNote = goal.notes.find(note => note.type === 'REMOVED')

    const entry: GoalRemovedHistoryEntry = {
      type: 'goal_removed',
      uuid: `removed-${goal.uuid}`,
      date: goal.statusDate,
      goalUuid: goal.uuid,
      goalTitle: goal.title,
      removedBy: removedNote?.createdBy,
      reason: removedNote?.note,
    }
    entries.push(entry)
  }

  // Sort by date, newest first
  entries.sort((a, b) => b.date.getTime() - a.date.getTime())

  context.setData('planHistoryEntries', entries)
}
