import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { getUserContext } from './getUserContext'

/**
 * Sends a telemetry event to App Insights, enriched with assessmentUuid, requestId,
 * authSource, and userContext (PRISON/PROBATION for HMPPS_AUTH users, PRISON/COMMUNITY
 * for OASYS handover users based on subject location).
 *
 * @example
 * SentencePlanEffects.sendTelemetryEvent('SOME_EVENT')
 */
export const sendTelemetryEvent =
  (_deps: SentencePlanEffectsDeps) => (context: SentencePlanContext, eventName: string) => {
    telemetry.trackEvent(eventName, {
      assessmentUuid: context.getData('assessmentUuid'),
      requestId: context.getState('requestId'),
      authSource: context.getState('user').authSource,
      userContext: getUserContext(context),
    })
  }
