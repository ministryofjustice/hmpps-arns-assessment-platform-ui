import { SentencePlanBuilder, type GoalConfig } from './SentencePlanBuilder'

function getDatePlusMonths(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toISOString()
}

/** Create an empty sentence plan builder (no goals) */
export function createEmptySentencePlan(): SentencePlanBuilder {
  return new SentencePlanBuilder()
}

/** Create a builder with N ACTIVE goals */
export function withCurrentGoals(count: number): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  const targetDate = getDatePlusMonths(3)

  for (let i = 1; i <= count; i++) {
    builder.withGoal({
      title: `Current Goal ${i}`,
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate,
    })
  }

  return builder
}

/** Create a builder with N FUTURE goals */
export function withFutureGoals(count: number): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()

  for (let i = 1; i <= count; i++) {
    builder.withGoal({
      title: `Future Goal ${i}`,
      areaOfNeed: 'finances',
      status: 'FUTURE',
    })
  }

  return builder
}

/** Create a builder with 2 current + 1 future goal */
export function withMixedGoals(): SentencePlanBuilder {
  const targetDate = getDatePlusMonths(6)

  return new SentencePlanBuilder()
    .withGoal({
      title: 'Find stable housing',
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate,
    })
    .withGoal({
      title: 'Get employment support',
      areaOfNeed: 'employment-and-education',
      status: 'ACTIVE',
      targetDate,
    })
    .withGoal({
      title: 'Improve finances',
      areaOfNeed: 'finances',
      status: 'FUTURE',
    })
}

/** Create a builder with custom goal configurations */
export function withGoals(goals: GoalConfig[]): SentencePlanBuilder {
  return new SentencePlanBuilder().withGoals(goals)
}
