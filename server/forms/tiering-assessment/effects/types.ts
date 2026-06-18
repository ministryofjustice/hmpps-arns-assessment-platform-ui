import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { Session } from 'express-session'
import { AssessmentPlatformApiClient, CoordinatorApiClient, DeliusApiClient } from '../../../data'
import AuditService from '../../../services/auditService'
import FeatureFlagService from '../../../services/featureFlagService'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import { User } from '../../../interfaces/user'

/**
 * Dependencies for sentence plan effects.
 * Note: delius api used to load sentence information for about page via handover context access.
 */
export interface TieringAssessmentEffectsDeps {
  api: AssessmentPlatformApiClient
  coordinatorApi: CoordinatorApiClient
  deliusApi: DeliusApiClient
  auditService: AuditService
  featureFlagService: FeatureFlagService
  riskActuarialApi: RiskActuarialApiClient
}

export type TieringAssessmentSession = {
  assessmentUuid: string,
} & Session

export interface SentencePlanState extends Record<string, unknown> {
  user: User & { authSource: string; token: string }
  requestId: string
}

export interface TieringAssessmentData extends Record<string, unknown> {}


export type TieringAssessmentEffectContext = EffectFunctionContext<
  Record<string, unknown>,
  TieringAssessmentData,
  TieringAssessmentSession,
  SentencePlanState
>
