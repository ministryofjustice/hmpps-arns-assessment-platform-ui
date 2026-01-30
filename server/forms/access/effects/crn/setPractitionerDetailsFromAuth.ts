import { InternalServerError } from 'http-errors'
import { AccessContext } from '../types'

/**
 * Set practitioner details from HMPPS auth token.
 *
 * Reads user info from request state (populated during authentication)
 * and stores it in session.
 */
export const setPractitionerDetailsFromAuth = () => (context: AccessContext) => {
  const user = context.getState('user')

  if (!user) {
    throw new InternalServerError('User is required - ensure user is authenticated')
  }

  const session = context.getSession()

  session.practitionerDetails = {
    identifier: user.id,
    displayName: user.name,
    authSource: 'DELIUS',
  }
}
