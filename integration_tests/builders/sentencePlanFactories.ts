import { SentencePlanBuilder, type GoalConfig, type PlanAgreementStatus } from './SentencePlanBuilder'

function getDatePlusMonths(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toISOString()
}

/** Create an empty sentence plan builder (no goals) */
export function createEmptySentencePlan(agreementStatus?: PlanAgreementStatus): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }
  return builder
}

/** Create a builder with N ACTIVE goals */
export function withCurrentGoals(count: number, agreementStatus?: PlanAgreementStatus): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }
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
export function withFutureGoals(count: number, agreementStatus?: PlanAgreementStatus): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }

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
export function withMixedGoals(agreementStatus?: PlanAgreementStatus): SentencePlanBuilder {
  const targetDate = getDatePlusMonths(6)

  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }

  return builder
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
export function withGoals(goals: GoalConfig[], agreementStatus?: PlanAgreementStatus): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }
  return builder.withGoals(goals)
}

/** Create a builder with N ACTIVE goals that have completed steps (required for achieve goal flow) */
export function withCurrentGoalsWithCompletedSteps(
  count: number,
  agreementStatus?: PlanAgreementStatus,
): SentencePlanBuilder {
  const builder = new SentencePlanBuilder()
  if (agreementStatus) {
    builder.withAgreementStatus(agreementStatus)
  }
  const targetDate = getDatePlusMonths(3)

  for (let i = 1; i <= count; i++) {
    builder.withGoal({
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

  return builder
}
