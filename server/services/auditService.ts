import { auditService } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'

export enum AuditEvent {
  // Privacy
  CONFIRM_PRIVACY_SCREEN = 'CONFIRM_PRIVACY_SCREEN',

  // Plan Overview
  VIEW_PLAN_OVERVIEW = 'VIEW_PLAN_OVERVIEW',

  // Goal Management - Pre Agree
  VIEW_CREATE_GOAL = 'VIEW_CREATE_GOAL',
  CREATE_GOAL = 'CREATE_GOAL',
  VIEW_CHANGE_GOAL = 'VIEW_CHANGE_GOAL',
  EDIT_GOAL = 'EDIT_GOAL',
  VIEW_ADD_STEPS = 'VIEW_ADD_STEPS',
  EDIT_STEPS = 'EDIT_STEPS',
  VIEW_DELETE_GOAL = 'VIEW_DELETE_GOAL',
  DELETE_GOAL = 'DELETE_GOAL',

  // Goal Management - Post Agree
  EDIT_PLAN_AGREEMENT = 'EDIT_PLAN_AGREEMENT',
  EDIT_PLAN_AGREEMENT_UPDATE = 'EDIT_PLAN_AGREEMENT_UPDATE',
  VIEW_UPDATE_GOAL_AND_STEPS = 'VIEW_UPDATE_GOAL_AND_STEPS',
  EDIT_STEP_PROGRESS = 'EDIT_STEP_PROGRESS',
  VIEW_CONFIRM_GOAL_ACHIEVED = 'VIEW_CONFIRM_GOAL_ACHIEVED',
  EDIT_GOAL_ACHIEVED = 'EDIT_GOAL_ACHIEVED',
  VIEW_CONFIRM_GOAL_REMOVED = 'VIEW_CONFIRM_GOAL_REMOVED',
  EDIT_GOAL_REMOVED = 'EDIT_GOAL_REMOVED',
  VIEW_CONFIRM_RE_ADD_GOAL = 'VIEW_CONFIRM_RE_ADD_GOAL',
  CREATE_RE_ADD_GOAL = 'CREATE_RE_ADD_GOAL',
  VIEW_INACTIVE_GOAL = 'VIEW_INACTIVE_GOAL',

  // History & Info
  VIEW_ABOUT_PERSON = 'VIEW_ABOUT_PERSON',
  VIEW_PLAN_HISTORY = 'VIEW_PLAN_HISTORY',
  VIEW_PREVIOUS_VERSIONS = 'VIEW_PREVIOUS_VERSIONS',
  VIEW_HISTORIC_PLAN = 'VIEW_HISTORIC_PLAN',
  VIEW_HISTORIC_ASSESSMENT = 'VIEW_HISTORIC_ASSESSMENT', // TODO: wire up when /view-previous-version/:uuid route is built
}

export interface AuditMessage {
  action: AuditEvent
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
      logger.info(`HMPPS Audit event sent successfully (${message.action})`)
    } catch (error) {
      logger.error(`Error sending HMPPS Audit event (${message.action}):`, error)
    }
  }
}
