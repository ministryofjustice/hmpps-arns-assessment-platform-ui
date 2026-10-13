export interface DomainEvent {
  eventType: string
  version: number
  occurredAt: string
  description?: string
  additionalInformation?: Record<string, unknown>
  personReference?: {
    identifiers: Array<{ type: string; value: string }>
  }
}

export interface DomainEvents {
  publish(event: DomainEvent): Promise<void>
}
