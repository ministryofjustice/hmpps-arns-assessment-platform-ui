import { DerivedGoal, GoalStatus } from '../types'

/**
 * Goal state embedded in a timeline event's customData so plan-history can
 * render the goal as it was at the time of the event.
 *
 * Stores slugs for `areaOfNeed` and step `actor` — labels resolve at read
 * time so a person rename or area relabel doesn't leak into history.
 */
export interface GoalSnapshotData {
  status: GoalStatus
  targetDate?: string
  statusDate: string
  areaOfNeed: string
  relatedAreasOfNeed: string[]
  steps: Array<{ actor: string; description: string; status: string }>
}

/**
 * Build a snapshot from a derived goal. Pass `overrides` for the fields the
 * emitting effect is about to change (status + statusDate for status changes,
 * steps for step edits, etc.).
 */
// `DerivedGoal.targetDate` is typed `Date` but is constructed via
// `new Date(answers.target_date)`. For FUTURE goals (and removed-then-readded
// goals) `target_date` is undefined, so the Date is an Invalid Date — truthy
// but `.toISOString()` on it throws.
const toIsoOrUndefined = (date: Date | undefined): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

export function snapshotFromGoal(goal: DerivedGoal, overrides: Partial<GoalSnapshotData> = {}): GoalSnapshotData {
  return {
    status: goal.status as GoalStatus,
    targetDate: toIsoOrUndefined(goal.targetDate),
    statusDate: toIsoOrUndefined(goal.statusDate) ?? new Date().toISOString(),
    areaOfNeed: goal.areaOfNeed,
    relatedAreasOfNeed: goal.relatedAreasOfNeed ?? [],
    steps: (goal.steps ?? []).map(step => ({
      actor: step.actor,
      description: step.description,
      status: step.status,
    })),
    ...overrides,
  }
}
