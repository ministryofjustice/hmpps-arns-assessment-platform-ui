import { auditService } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'
import { ApplicationInfo } from '../applicationInfo'

export enum AuditEvent {
  VIEW_ASSESSMENT = 'VIEW_ASSESSMENT',
  CREATE_ASSESSMENT = 'CREATE_ASSESSMENT',
}

export interface AuditContext {
  username: string
  correlationId: string
  crn?: string
  assessmentUuid?: string
  assessmentVersion?: number
  details?: Record<string, unknown>
}

export default class AuditService {
  constructor(private readonly applicationInfo: ApplicationInfo) {}

  async send(event: AuditEvent, context: AuditContext) {
    try {
      await auditService.sendAuditMessage({
        action: event,
        who: context.username,
        subjectId: context.crn,
        subjectType: context.crn ? 'CRN' : undefined,
        service: this.applicationInfo.applicationName,
        correlationId: context.correlationId,
        details: JSON.stringify({
          assessmentUuid: context.assessmentUuid,
          assessmentVersion: context.assessmentVersion,
          ...context.details,
        }),
      })
      logger.info(`HMPPS Audit event sent successfully (${event})`)
    } catch (error) {
      logger.error(`Error sending HMPPS Audit event (${event}):`, error)
    }
  }
}
