import { AssessmentPlatformApiClient } from '../../../data'
import AuditService from '../../../services/auditService'
import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext';
import { DataDeletionDataResponse } from '../../../interfaces/aap-api/dataDeletion';
import config from '../../../config';

export interface DataDeletionToolEffectsDeps {
  api: AssessmentPlatformApiClient
  auditService: AuditService
}

// -----------------------------------------------------------------------------
// Typed Effect Context
// -----------------------------------------------------------------------------

/**
 * Data stored via context.setData() / context.getData()
 */
export interface DataDeletionToolData extends Record<string, unknown> {
  csrfToken: string
  currentData: DataDeletionDataResponse
}

/**
 * Form answers via context.setAnswer() / context.getAnswer()
 */
export interface DataDeletionToolAnswers extends Record<string, unknown> {
  dataEnvironment: string
  clientId: string
  clientSecret: string
  assessmentUuid: string
}

/**
 * Session data via context.getSession()
 */
export interface DataDeletionToolSession {
}

/**
 * Request state via context.getState()
 */
export interface DataDeletionToolState extends Record<string, unknown> {
  csrfToken: string
}

/**
 * Typed effect context for Data Deletion Tool
 */
export type DataDeletionToolContext = EffectFunctionContext<
  DataDeletionToolAnswers,
  DataDeletionToolData,
  DataDeletionToolSession,
  DataDeletionToolState
>
