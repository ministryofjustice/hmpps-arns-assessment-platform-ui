import { auditService } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'
import { ApplicationInfo } from '../applicationInfo'
import SessionService from './sessionService'

export enum AuditEvent {
  VIEW_ASSESSMENT = 'VIEW_ASSESSMENT',
  CREATE_ASSESSMENT = 'CREATE_ASSESSMENT',
}

export default class AuditService {
  constructor(
    private readonly applicationInfo: ApplicationInfo,
    private readonly sessionService: SessionService,
    private readonly correlationId: string,
  ) {}

  async send(event: AuditEvent, details: any = {}) {
    try {
      await auditService.sendAuditMessage({
        action: event,
        who: this.sessionService.getPrincipalDetails()?.identifier,
        subjectId: this.sessionService.getSubjectDetails()?.crn,
        subjectType: 'CRN',
        service: this.applicationInfo.applicationName,
        correlationId: this.correlationId,
        details: JSON.stringify({
          assessmentUuid: this.sessionService.getAssessmentUuid(),
          assessmentVersion: this.sessionService.getAssessmentVersion(),
          ...details,
        }),
      })
      logger.info(`HMPPS Audit event sent successfully (${event})`)
    } catch (error) {
      logger.error(`Error sending HMPPS Audit event (${event}):`, error)
    }
  }
}
