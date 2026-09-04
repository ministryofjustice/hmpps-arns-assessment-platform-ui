import { auditService } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'

export interface AuditMessage {
  action: string
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: Record<string, unknown>
}

export default class AuditService {
  constructor(private readonly serviceName: string) {}

  async send(message: AuditMessage) {
    try {
      await auditService.sendAuditMessage({
        ...message,
        service: this.serviceName,
        details: message.details ? JSON.stringify(message.details) : undefined,
      })
      logger.info(
        {
          action: message.action,
          correlationId: message.correlationId,
          subjectId: message.subjectId,
          subjectType: message.subjectType,
        },
        'HMPPS audit event sent successfully',
      )
    } catch (error) {
      logger.error(
        {
          err: error,
          action: message.action,
          correlationId: message.correlationId,
          subjectId: message.subjectId,
          subjectType: message.subjectType,
        },
        'Error sending HMPPS audit event',
      )
    }
  }
}
