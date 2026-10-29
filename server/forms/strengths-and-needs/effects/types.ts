import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { User } from '../../../interfaces/user'
import { AssessmentVersionQueryResult } from '../../../interfaces/aap-api/queryResult'
import { AssessmentIdentifiers } from '../../../interfaces/aap-api/identifier'
import { CaseDetails } from '../../../interfaces/delius-api/caseDetails'
import { AccessSessionDetails } from '../../access/effects/types'
import { HandoverContext } from '../../../interfaces/handover-api/response'
import { AssessmentPlatformApiClient, CoordinatorApiClient } from '../../../data'
import AuditService from '../../../services/auditService'
import { PreviousVersionDisplay } from './assessment/loadPreviousVersions'
import { VersionDetails } from '../../../interfaces/coordinator-api/previousVersions'
import type { EntryRoute } from './session/resolveEntryRoute'

export interface StrengthsAndNeedsSessionDetails extends AccessSessionDetails {
  assessmentIdentifier: AssessmentIdentifiers
  assessmentVersion?: number
}

/**
 * Session state owned by SAN, kept apart from other forms' (e.g. Sentence Plan also has `sessionDetails`).
 * Cleared on every access (clearAccessSession).
 */
export interface StrengthsAndNeedsSanSession {
  sessionDetails?: StrengthsAndNeedsSessionDetails
  /** UUID of the (current) assessment for this access, set by loadAssessment */
  assessmentUuid?: string
  /** The previous version the handover asked for, set by resolveEntryRoute */
  requestedVersionUuid?: string
  countersignedVersions?: PreviousVersionDisplay[]
  previousVersions?: PreviousVersionDisplay[]
  unaggregatedVersions?: VersionDetails[]
}

/**
 * Session data available to SAN effects.
 * Populated by the access form before the SAN form loads.
 */
export interface StrengthsAndNeedsSession {
  caseDetails?: CaseDetails
  accessDetails?: AccessSessionDetails
  handoverContext?: HandoverContext
  /** Shared with Sentence Plan: one privacy screen per session */
  privacyAccepted?: boolean
  san?: StrengthsAndNeedsSanSession
  patternDrafts?: Record<string, Record<string, unknown>>
}

/**
 * SAN's own session state, created on first use.
 */
export const sanSession = (session: StrengthsAndNeedsSession): StrengthsAndNeedsSanSession => {
  session.san ??= {}
  return session.san
}

/**
 * Data context for SAN effects.
 */
export interface StrengthsAndNeedsData {
  caseData?: CaseDetails
  sessionDetails?: StrengthsAndNeedsSessionDetails
  accessDetails?: AccessSessionDetails
  privacyAccepted?: boolean
  assessment?: AssessmentVersionQueryResult
  assessmentUuid?: string
  historicVersion?: VersionDetails
  entryRoute?: EntryRoute
  collectionUuids?: Record<string, string>
  [key: string]: unknown
}

/**
 * Request state available to SAN effects.
 */
export interface StrengthsAndNeedsState extends Record<string, unknown> {
  user: User & {
    token: string
  }
  /** Per request id, used as the audit correlationId. Set by setUpWebSession. */
  requestId: string
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
  auditService: AuditService
  coordinatorApi: CoordinatorApiClient
}
