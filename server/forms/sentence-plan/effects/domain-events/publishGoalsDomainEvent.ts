import logger from '../../../../../logger'
import { DomainEvent } from '../../../../services/domainEventsService'
import { POST_AGREEMENT_PROCESS_STATUSES, SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { hasNoOtherOpenGoals } from './openGoals'
import { goalsAddedEvent, goalsCompletedEvent } from './goalsDomainEvents'

type GoalsEventFactory = (params: { planUuid: string; crn: string }) => DomainEvent

/**
 * Publishes a goals domain event when a goal status change crosses the open/closed boundary.
 *
 * Gated to plans that are AGREED and only fires when the changed goal is the
 * only open goal (if any) — i.e. this action either closed the last open goal or opened the first.
 */
const publishOnOpenGoalBoundary = async (
  deps: SentencePlanEffectsDeps,
  context: SentencePlanContext,
  changedGoalUuid: string,
  buildEvent: GoalsEventFactory,
): Promise<void> => {
  const latestAgreementStatus = context.getData('latestAgreementStatus')
  if (!POST_AGREEMENT_PROCESS_STATUSES.includes(latestAgreementStatus)) {
    return
  }

  const goals = context.getData('goals')
  if (!hasNoOtherOpenGoals(goals, changedGoalUuid)) {
    return
  }

  const crn = context.getSession().caseDetails?.crn
  if (!crn) {
    logger.error('Cannot publish goals domain event: missing crn')
    return
  }

  const planIdentifier = context.getSession().sessionDetails?.planIdentifier
  const planUuid = planIdentifier?.type === 'UUID' ? planIdentifier.uuid : undefined

  await deps.domainEventsService.publish(buildEvent({ planUuid, crn }))
}

export const publishGoalsCompletedEvent = (
  deps: SentencePlanEffectsDeps,
  context: SentencePlanContext,
  changedGoalUuid: string,
): Promise<void> => publishOnOpenGoalBoundary(deps, context, changedGoalUuid, goalsCompletedEvent)

export const publishGoalsAddedEvent = (
  deps: SentencePlanEffectsDeps,
  context: SentencePlanContext,
  changedGoalUuid: string,
): Promise<void> => publishOnOpenGoalBoundary(deps, context, changedGoalUuid, goalsAddedEvent)
