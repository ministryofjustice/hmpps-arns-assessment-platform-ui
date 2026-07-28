import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { User } from '../../../interfaces/user'
import {
  CommandResult,
  CreateAssessmentCommandResult,
  CreateCollectionCommandResult
} from '../../../interfaces/aap-api/commandResult'
import {
  CreateAssessmentCommand, CreateCollectionCommand,
  UpdateAssessmentAnswersCommand,
  UpdateAssessmentPropertiesCommand,
} from '../../../interfaces/aap-api/command'
import { AssessmentVersionQuery } from '../../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../../../interfaces/aap-api/queryResult'
import { AssessmentIdentifiers } from '../../../interfaces/aap-api/identifier'
import { CaseDetails } from '../../../interfaces/delius-api/caseDetails'
import { AccessSessionDetails } from '../../access/effects/types'
import { HandoverContext } from '../../../interfaces/handover-api/response'
import {AssessmentPlatformApiClient} from "../../../data";
import {Collection, CollectionItem} from "../../../interfaces/aap-api/dataModel";

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
  patternDrafts?: Record<string, Record<string, unknown>>
}

/**
 * Data context for SAN effects.
 */
export interface StrengthsAndNeedsData {
  victimCollectionUuid: string
  caseData?: CaseDetails
  sessionDetails?: StrengthsAndNeedsSessionDetails
  assessment?: AssessmentVersionQueryResult
  assessmentUuid?: string
  victims?: CollectionItem[]
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
