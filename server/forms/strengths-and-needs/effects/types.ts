import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import AssessmentPlatformApiClient from '../../../data/assessmentPlatformApiClient'
import { User } from '../../../interfaces/user'
import { AssessmentVersionQueryResult } from '../../../interfaces/aap-api/queryResult'
import { AssessmentIdentifiers } from '../../../interfaces/aap-api/identifier'
import { CaseDetails } from '../../../interfaces/delius-api/caseDetails'
import { AccessSessionDetails } from '../../access/effects/types'
import { HandoverContext } from '../../../interfaces/handover-api/response'

export interface StrengthsAndNeedsSessionDetails extends AccessSessionDetails {
  assessmentIdentifier: AssessmentIdentifiers
  assessmentVersion?: number
}

/**
 * Session data available to SAN effects.
 * Populated by the access form before the SAN form loads.
 */
export interface StrengthsAndNeedsSession {
  caseDetails?: CaseDetails
  accessDetails?: AccessSessionDetails
  sessionDetails?: StrengthsAndNeedsSessionDetails
  handoverContext?: HandoverContext
}

/**
 * Data context for SAN effects.
 */
export interface StrengthsAndNeedsData {
  caseData?: CaseDetails
  sessionDetails?: StrengthsAndNeedsSessionDetails
  assessment?: AssessmentVersionQueryResult
  assessmentUuid?: string
  [key: string]: unknown
}

/**
 * Request state available to SAN effects.
 */
export interface StrengthsAndNeedsState extends Record<string, unknown> {
  user: User & {
    token: string
  }
}

/**
 * Typed effect context for SAN effects.
 */
export type StrengthsAndNeedsContext = EffectFunctionContext<
  StrengthsAndNeedsData,
  Record<string, unknown>,
  StrengthsAndNeedsSession,
  StrengthsAndNeedsState
>

export interface StrengthsAndNeedsEffectsDeps {
  api: AssessmentPlatformApiClient
}
