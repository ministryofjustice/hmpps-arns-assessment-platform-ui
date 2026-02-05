import { AccessContext } from '../types'

/**
 * Set access details for CRN-based access.
 *
 * CRN users (e.g., MPOP) always have READ_WRITE access mode
 * and use hmpps-auth authentication.
 */
export const setAccessDetailsForCrn = () => (context: AccessContext) => {
  const session = context.getSession()

  session.accessDetails = {
    accessType: 'HMPPS_AUTH',
    accessMode: 'READ_WRITE',
  }
}
