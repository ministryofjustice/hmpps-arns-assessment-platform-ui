import { AccessMode } from './handover-api/shared'
import { AssessmentIdentifiers } from './aap-api/identifier'

export type AccessType = 'hmpps-auth' | 'handover'

export interface SessionDetails {
  accessType: AccessType
  accessMode: AccessMode
  oasysRedirectUrl?: string
  planIdentifier?: AssessmentIdentifiers
}
