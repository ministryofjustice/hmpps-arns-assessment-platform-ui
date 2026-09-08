import { DerivedGoal } from '../types'

const OPEN_STATUSES = ['ACTIVE', 'FUTURE']

const isOpen = (goal: DerivedGoal): boolean => OPEN_STATUSES.includes(goal.status)

/**
 * True when the only open goal (if any) is `changedGoalUuid` — every other goal is closed.
 *
 * We pass the goal the user just changed and ignore it, so the check is really
 * "is anything else open?". That answers both domain events: after achieving or
 * removing a goal, false means there are still open goals; true means that was the last one.
 */
export const hasNoOtherOpenGoals = (goals: DerivedGoal[], changedGoalUuid?: string): boolean =>
  goals.every(goal => goal.uuid === changedGoalUuid || !isOpen(goal))
