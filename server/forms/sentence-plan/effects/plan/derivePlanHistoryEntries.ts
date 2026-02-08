import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'
import {
  DerivedGoal,
  DerivedPlanAgreement,
  PlanAgreementHistoryEntry,
  PlanHistoryEntry,
  SentencePlanContext,
} from '../types'

/**
 * Derive unified plan history entries from timeline events and plan agreements.
 *
 * Transforms raw timeline items from Data('planTimeline') into typed history
 * entries, merges with plan agreement entries, and sorts by date (newest first).
 *
 * Requires:
 * - Data('planTimeline'): Populated by loadPlanTimeline
 * - Data('planAgreements'): Populated by derivePlanAgreementsFromAssessment
 * - Data('goals'): Populated by deriveGoalsWithStepsFromAssessment (for isCurrentlyActive on removed goals)
 *
 * Sets:
 * - Data('planHistoryEntries'): Array of unified history entries
 */
export const derivePlanHistoryEntries = () => (context: SentencePlanContext) => {
  const planTimeline = (context.getData('planTimeline') as TimelineItem[] | undefined) ?? []
  const planAgreements = (context.getData('planAgreements') as DerivedPlanAgreement[] | undefined) ?? []
  const goals = (context.getData('goals') as DerivedGoal[] | undefined) ?? []

  const entries: PlanHistoryEntry[] = []

  // Map timeline items to goal lifecycle entries
  for (const item of planTimeline) {
    const customData = item.customData ?? {}
    const date = new Date(item.timestamp)

    switch (item.customType) {
      case 'GOAL_ACHIEVED':
        entries.push({
          type: 'goal_achieved',
          uuid: `achieved-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          achievedBy: customData.achievedBy,
          notes: customData.notes,
        })
        break

      case 'GOAL_REMOVED': {
        const isCurrentlyActive = goals.some(
          g => g.uuid === customData.goalUuid && (g.status === 'ACTIVE' || g.status === 'FUTURE'),
        )
        entries.push({
          type: 'goal_removed',
          uuid: `removed-${customData.goalUuid}-${item.timestamp}`,
          date,
          goalUuid: customData.goalUuid,
          goalTitle: customData.goalTitle,
          removedBy: customData.removedBy,
          reason: customData.reason,
          isCurrentlyActive,
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
