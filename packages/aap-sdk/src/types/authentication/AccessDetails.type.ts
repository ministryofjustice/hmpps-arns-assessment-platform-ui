import type { AccessMode } from '../../dependencies/handover/HandoverShared.type'
import type { AuthSource } from './HmppsUser.type'

/** Common access information prepared by the platform before entering a journey. */
export interface AccessDetails {
  accessType: AuthSource
  planAccessMode: AccessMode
  oasysRedirectUrl?: string
}
