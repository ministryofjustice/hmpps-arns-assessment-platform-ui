import { InternalServerError } from 'http-errors'
import { AccessContext } from '../types'

/**
 * Set practitioner details from handover context.
 *
 * Must be called after loadHandoverContext has populated the session
 * with handover context data.
 */
export const setPractitionerDetailsFromHandoverContext = () => (context: AccessContext) => {
  const session = context.getSession()
  const handoverContext = session?.handoverContext

  if (!handoverContext) {
    throw new InternalServerError('Handover context is required - ensure loadHandoverContext runs first')
  }

  const { principal } = handoverContext

  session.practitionerDetails = {
    identifier: principal.identifier,
    displayName: principal.displayName,
    authSource: 'handover',
  }
}
