import { AuditEvent } from '../../../services/auditService'
import { PlatformContext, PlatformEffectsDeps } from './types'

export const sendPrivacyScreenAuditEvent = (deps: PlatformEffectsDeps) => async (context: PlatformContext) => {
  const user = context.getState('user')
  const requestId = context.getState('requestId')
  const session = context.getSession()
  const crn = session.caseDetails?.crn

  await deps.auditService.send({
    action: AuditEvent.CONFIRM_PRIVACY_SCREEN,
    who: user?.id ?? 'unknown',
    subjectId: crn,
    subjectType: crn ? 'CRN' : undefined,
    correlationId: requestId ?? 'unknown',
  })
}
