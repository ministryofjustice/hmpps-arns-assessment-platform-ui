import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { Session } from 'express-session'
import { AssessmentPlatformApiClient, CoordinatorApiClient, DeliusApiClient } from '../../../data'
import AuditService from '../../../services/auditService'
import FeatureFlagService from '../../../services/featureFlagService'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'

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

export type TieringAssessmentSession = Session & {
  patternDrafts?: Record<string, Record<string, unknown>>
  patternSubmitted?: Record<string, boolean>
  demoUser?: { name: string; role: string }
}

export type TieringAssessmentEffectContext = EffectFunctionContext<
  Record<string, unknown>,
  Record<string, unknown>,
  TieringAssessmentSession
>
