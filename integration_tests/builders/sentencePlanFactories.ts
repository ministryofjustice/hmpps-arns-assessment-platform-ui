import type { GoalConfig } from './types'

function getDatePlusMonths(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)

  return date.toISOString()
}

/** Create N ACTIVE goal configs */
export function currentGoals(count: number): GoalConfig[] {
  const targetDate = getDatePlusMonths(3)
  const goals: GoalConfig[] = []

  for (let i = 1; i <= count; i++) {
    goals.push({
      title: `Current Goal ${i}`,
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate,
    })
  }

  return goals
}

/** Create N FUTURE goal configs */
export function futureGoals(count: number): GoalConfig[] {
  const goals: GoalConfig[] = []

  for (let i = 1; i <= count; i++) {
    goals.push({
      title: `Future Goal ${i}`,
      areaOfNeed: 'finances',
      status: 'FUTURE',
    })
  }

  return goals
}

/** Create 2 current + 1 future goal configs */
export function mixedGoals(): GoalConfig[] {
  const targetDate = getDatePlusMonths(6)

  return [
    {
      title: 'Find stable housing',
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate,
    },
    {
      title: 'Get employment support',
      areaOfNeed: 'employment-and-education',
      status: 'ACTIVE',
      targetDate,
    },
    {
      title: 'Improve finances',
      areaOfNeed: 'finances',
      status: 'FUTURE',
    },
  ]
}

/** Create N ACTIVE goal configs with completed steps (required for achieve goal flow) */
export function currentGoalsWithCompletedSteps(count: number): GoalConfig[] {
  const targetDate = getDatePlusMonths(3)
  const goals: GoalConfig[] = []

  for (let i = 1; i <= count; i++) {
    goals.push({
      title: `Current Goal ${i}`,
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate,
      steps: [
        { actor: 'probation_practitioner', description: `Step 1 for Goal ${i}`, status: 'COMPLETED' },
        { actor: 'person_on_probation', description: `Step 2 for Goal ${i}`, status: 'COMPLETED' },
      ],
    })
  }

  return goals
}

/** Create N REMOVED goal configs (for re-add goal flow) */
export function removedGoals(count: number): GoalConfig[] {
  const targetDate = getDatePlusMonths(3)
  const goals: GoalConfig[] = []

  for (let i = 1; i <= count; i++) {
    goals.push({
      title: `Removed Goal ${i}`,
      areaOfNeed: 'accommodation',
      status: 'REMOVED',
      targetDate,
      steps: [{ actor: 'probation_practitioner', description: `Step 1 for Removed Goal ${i}`, status: 'COMPLETED' }],
      notes: [{ type: 'REMOVED', note: `This goal was removed because it is no longer relevant` }],
    })
  }

  return goals
}
