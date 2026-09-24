import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import type { AssessmentPlatformApiFactory } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApi.type'
import {
  DataDeletionDataResponse,
  DataDeletionRequest,
  DataDeletionResponse,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentDataDeletion.type'

export interface DataDeletionToolEffectsDeps {
  assessmentPlatformApiFactory: AssessmentPlatformApiFactory
}

// -----------------------------------------------------------------------------
// Typed Effect Context
// -----------------------------------------------------------------------------

/**
 * Data stored via context.setData() / context.getData()
 */
export interface DataDeletionToolData extends Record<string, unknown> {
  csrfToken: string
}

/**
 * Form answers via context.setAnswer() / context.getAnswer()
 */
export interface DataDeletionToolAnswers extends Record<string, unknown> {
  environment: string
  clientId: string
  clientSecret: string
  assessmentUuid: string
}

/**
 * Session data via context.getSession()
 */
export interface DataDeletionToolSession {
  answers: DataDeletionToolAnswers
  currentData: DataDeletionDataResponse
  deletionRequest: DataDeletionRequest
  deletionResponse: DataDeletionResponse
  eventsValidated: boolean
  timelineValidated: boolean
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
