import { AuditEvent } from '../../../../services/auditService'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Send an audit event via the existing AuditService.
 *
 * Extracts common context (user, CRN, assessmentUuid, correlationId) from the
 * form engine context and delegates to AuditService.send().
 */
export const sendAuditEvent =
  (deps: SentencePlanEffectsDeps) =>
  async (context: SentencePlanContext, eventName: AuditEvent, additionalDetails?: Record<string, unknown>) => {
    const user = context.getState('user')
    const requestId = context.getState('requestId')
    const assessmentUuid = context.getData('assessmentUuid')
    const session = context.getSession()
    const crn = session?.caseDetails?.crn

    await deps.auditService.send({
      action: eventName,
      who: user?.id ?? 'unknown',
      subjectId: crn,
      subjectType: crn ? 'CRN' : undefined,
      correlationId: requestId ?? 'unknown',
      details: {
        assessmentUuid,
        formVersion: context.getData('formVersion'),
        goalUuid: context.getData('activeGoalUuid') || undefined,
        ...additionalDetails,
      },
    })
  }
