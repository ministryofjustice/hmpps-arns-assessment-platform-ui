import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { DeliusApiClient, HandoverApiClient } from '../../../data'
import { HandoverContext } from '../../../interfaces/handover-api/response'
import { CaseDetails } from '../../../interfaces/delius-api/caseDetails'
import { PractitionerDetails } from '../../../interfaces/practitionerDetails'
import { AccessMode } from '../../../interfaces/handover-api/shared'
import { AuthSource } from '../../../interfaces/hmppsUser'

/**
 * Generic session details for access flows.
 * Does not include form-specific identifiers - target forms add those.
 */
export interface AccessSessionDetails {
  accessType: AuthSource
  planAccessMode: AccessMode
  oasysRedirectUrl?: string
}

/**
 * Session data stored by access effects.
 * Target forms can extend this with their own data.
 */
export interface AccessSession {
  handoverContext?: HandoverContext
  caseDetails?: CaseDetails
  practitionerDetails?: PractitionerDetails
  accessDetails?: AccessSessionDetails
  targetService?: string
}

/**
 * Request state available to access effects.
 */
export interface AccessState extends Record<string, unknown> {
  user: {
    id: string
    name: string
    authSource: string
    token: string
  }
}

/**
 * Typed effect context for access form effects.
 */
export type AccessContext = EffectFunctionContext<
  Record<string, unknown>,
  Record<string, unknown>,
  AccessSession,
  AccessState
>

/**
 * Dependencies for access effects.
 */
export interface AccessEffectsDeps {
  deliusApi: DeliusApiClient
  handoverApi: HandoverApiClient
}
