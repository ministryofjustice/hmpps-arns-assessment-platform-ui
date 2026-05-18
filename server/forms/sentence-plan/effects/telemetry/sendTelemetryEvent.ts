import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Sends a telemetry event to App Insights, enriched with assessmentUuid and requestId.
 *
 * @example
 * SentencePlanEffects.sendTelemetryEvent('SOME_EVENT')
 */
export const sendTelemetryEvent =
  (_deps: SentencePlanEffectsDeps) => (context: SentencePlanContext, eventName: string) => {
    telemetry.trackEvent(eventName, {
      assessmentUuid: context.getData('assessmentUuid'),
      requestId: context.getState('requestId'),
    })
  }
