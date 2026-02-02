import { InternalServerError } from 'http-errors'
import { AccessContext } from '../types'

/**
 * Set access details from handover context.
 *
 * Sets generic access information (type, mode, return URL).
 * Does not set form-specific identifiers - target forms handle those.
 *
 * Must be called after loadHandoverContext has populated the session
 * with handover context data.
 */
export const setAccessDetailsFromHandoverContext = () => (context: AccessContext) => {
  const session = context.getSession()
  const handoverContext = session?.handoverContext

  if (!handoverContext) {
    throw new InternalServerError('Handover context is required - ensure loadHandoverContext runs first')
  }

  const { principal } = handoverContext

  session.accessDetails = {
    accessType: 'OASYS',
    accessMode: principal.accessMode,
    oasysRedirectUrl: principal.returnUrl,
  }
}
