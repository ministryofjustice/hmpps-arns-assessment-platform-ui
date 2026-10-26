import { sendFormAuditEvent } from '../../../shared'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Send a SP audit event via the AuditService.
 */
export const sendAuditEvent =
  (deps: SentencePlanEffectsDeps) =>
  async (context: SentencePlanContext, action: string, details?: Record<string, unknown>) =>
    sendFormAuditEvent(deps.auditService, context, 'sentence-plan', action, {
      goalUuid: context.getData('activeGoalUuid') || undefined,
      ...details,
    })
