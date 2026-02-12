import { AccessMode } from './handover-api/shared'
import { AssessmentIdentifiers } from './aap-api/identifier'
import { AuthSource } from './hmppsUser'

export interface SessionDetails {
  accessType: AuthSource
  planAccessMode: AccessMode
  oasysRedirectUrl?: string
  planIdentifier?: AssessmentIdentifiers
}
