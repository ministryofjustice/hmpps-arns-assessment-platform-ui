export interface AuditMessage {
  action: string
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: Record<string, unknown>
}

export interface Audit {
  send(message: AuditMessage): Promise<void>
}
