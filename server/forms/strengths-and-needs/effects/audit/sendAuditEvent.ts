import { sendFormAuditEvent } from '../../../shared'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { SAN_AUDIT_FORM } from '../../auditEvents'

/**
 * Send a SAN audit event via the AuditService.
 */
export const sendAuditEvent =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, action: string, details?: Record<string, unknown>) =>
    sendFormAuditEvent(deps.auditService, context, SAN_AUDIT_FORM, action, details)
