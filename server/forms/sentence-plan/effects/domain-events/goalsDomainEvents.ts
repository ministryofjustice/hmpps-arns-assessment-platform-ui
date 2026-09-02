import { DomainEvent } from '../../../../services/domainEventsService'

interface GoalsEventParams {
  planUuid?: string
  crn: string
}

const buildGoalsEvent = (eventType: string, description: string, { planUuid, crn }: GoalsEventParams): DomainEvent => ({
  eventType,
  version: 1,
  occurredAt: new Date().toISOString(),
  description,
  ...(planUuid ? { additionalInformation: { planUuid } } : {}),
  personReference: { identifiers: [{ type: 'CRN', value: crn }] },
})

export const goalsCompletedEvent = (params: GoalsEventParams): DomainEvent =>
  buildGoalsEvent('arns.sentence.plan.goals.completed', 'No more open goals', params)

export const goalsAddedEvent = (params: GoalsEventParams): DomainEvent =>
  buildGoalsEvent('arns.sentence.plan.goals.added', 'There is an open goal', params)
