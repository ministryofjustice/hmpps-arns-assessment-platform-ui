import AuditService from '../../../services/auditService'

export interface AuditEffectContext {
  getState(key: string): unknown
  getData(key: string): unknown
  getSession(): { caseDetails?: { crn?: string } } | undefined
}

/**
 * Send an audit event for an action in a form.
 */
export const sendFormAuditEvent = async (
  auditService: AuditService,
  context: AuditEffectContext,
  form: string,
  action: string,
  details?: Record<string, unknown>,
) => {
  const user = context.getState('user') as { id?: string } | undefined
  const requestId = context.getState('requestId') as string | undefined
  const crn = context.getSession()?.caseDetails?.crn

  await auditService.send({
    action,
    who: user?.id ?? 'unknown',
    subjectId: crn,
    subjectType: crn ? 'CRN' : undefined,
    correlationId: requestId ?? 'unknown',
    details: {
      form,
      assessmentUuid: context.getData('assessmentUuid'),
      formVersion: context.getData('formVersion'),
      ...details,
    },
  })
}
