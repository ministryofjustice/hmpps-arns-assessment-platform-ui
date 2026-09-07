import { AccessMode } from '../../dependencies/handover/HandoverShared.type'
import { AssessmentIdentifiers } from '../../dependencies/assessment-platform/AssessmentIdentifier.type'
import { AuthSource } from './HmppsUser.type'

export interface SessionDetails {
  accessType: AuthSource
  planAccessMode: AccessMode
  oasysRedirectUrl?: string
  planIdentifier?: AssessmentIdentifiers
  planVersion?: number
}
